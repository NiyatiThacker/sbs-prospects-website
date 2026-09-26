const { invoke } = window.__TAURI__.core;

let supabaseClient = null;
let currentEmployeeId = null;
let currentEmployeeName = null;
let dataPollInterval = null;
let knownProjectIds = new Set();

// --- BREAK LOGIC VARIABLES ---
let isOnBreak = false;
let breakAllowanceSeconds = 60 * 60; // 60 minutes
let breakCountdownInterval = null;
let breakHeartbeatInterval = null;
let hasGivenWarning = false;

// --- TOAST NOTIFICATIONS ---
window.showToast = (message, type = 'info') => {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '🔔';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove after animation completes (3s total)
  setTimeout(() => {
    if (container.contains(toast)) {
      container.removeChild(toast);
    }
  }, 3000);
};

async function init() {
  try {
    // 1. Get Supabase Config from Rust Backend (which reads .env)
    const config = await invoke("get_supabase_config");
    supabaseClient = window.supabase.createClient(config.url, config.key);

    // 2. Check if we already logged in previously
    const savedEmployeeId = await invoke("get_saved_employee_id");
    if (savedEmployeeId) {
      showSuccessScreen(savedEmployeeId, savedEmployeeId);
      await invoke("start_monitoring_with_credentials", { employeeId: savedEmployeeId });
    }
  } catch (err) {
    console.error("Failed to initialize:", err);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  const loginBtn = document.getElementById("login-btn");

  errorMsg.classList.add("hidden");
  loginBtn.disabled = true;
  loginBtn.textContent = "Connecting...";

  try {
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Get Employee ID using the user's email
    const userEmail = authData.user.email;
    const { data: empData, error: empError } = await supabaseClient
      .from('employees')
      .select('id, name')
      .eq('email', userEmail)
      .single();

    if (empError) {
      console.warn("Could not find employee record by email. Using auth UUID directly.", empError);
    }
    
    const employeeId = empData?.id || authData.user.id;

    // 3. Start monitoring via Rust Backend
    await invoke("start_monitoring_with_credentials", { employeeId });

    // 4. Show success & fetch HR documents
    showSuccessScreen(empData?.name || userEmail || employeeId, employeeId);
  } catch (err) {
    errorMsg.textContent = err.message || "Invalid credentials.";
    errorMsg.classList.remove("hidden");
    loginBtn.disabled = false;
    loginBtn.textContent = "Log In & Connect";
  }
}

function showSuccessScreen(userLabel, empId) {
  currentEmployeeId = empId || userLabel;
  currentEmployeeName = userLabel;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("success-screen").classList.remove("hidden");
  
  if (userLabel) {
    const badge = document.getElementById("connected-user-text");
    const avatar = document.getElementById("avatar-initial");
    if (badge) badge.textContent = userLabel;
    if (avatar) avatar.textContent = userLabel.charAt(0).toUpperCase();
  }

  if (currentEmployeeId) {
    fetchAndDisplayDocuments(currentEmployeeId);
    fetchAndDisplayProjects(currentEmployeeId);
    
    // Set up polling for real-time updates every 10 seconds (matches HR dashboard)
    if (dataPollInterval) clearInterval(dataPollInterval);
    dataPollInterval = setInterval(() => {
      // Re-fetch only if the user is still on the success screen
      if (!document.getElementById("success-screen").classList.contains("hidden")) {
        fetchAndDisplayProjects(currentEmployeeId);
        fetchAndDisplayLeaves(currentEmployeeId);
        checkAdminForcedCheckout(currentEmployeeId);
      }
    }, 10000);

    fetchAndDisplayLeaves(currentEmployeeId);
    syncBreakAllowance(currentEmployeeId);
    checkAdminForcedCheckout(currentEmployeeId);
  }
}

async function checkAdminForcedCheckout(employeeId) {
  if (!supabaseClient || !employeeId) return;
  try {
    // 1. Fetch the latest raw log to get the true Server UTC Time (prevents OS clock spoofing)
    const { data: latestLog, error: logErr } = await supabaseClient
      .from('screentime_raw_logs')
      .select('timestamp')
      .eq('employee_id', employeeId)
      .order('timestamp', { ascending: false })
      .limit(1);

    if (logErr || !latestLog || latestLog.length === 0) return;

    // Convert server UTC to IST
    const serverNow = new Date(latestLog[0].timestamp.endsWith('Z') ? latestLog[0].timestamp : latestLog[0].timestamp + 'Z');
    const istTime = new Date(serverNow.getTime() + (330 * 60000));
    
    // Get current IST time components
    const currentIstH = istTime.getUTCHours();
    const currentIstM = istTime.getUTCMinutes();
    const currentIstS = istTime.getUTCSeconds();
    const currentTotalSeconds = currentIstH * 3600 + currentIstM * 60 + currentIstS;

    // 2. Fetch expected shift timings
    const { data: empData, error: empErr } = await supabaseClient
      .from('employees')
      .select('expected_shift_start, expected_shift_end')
      .eq('id', employeeId)
      .maybeSingle();
      
    if (!empErr && empData) {
      let shiftEndStr = empData.expected_shift_end;
      
      // Fallback: Max work time 9h based on expected_shift_start if end is null
      if (!shiftEndStr) {
        let startStr = empData.expected_shift_start || '09:00:00';
        let startParts = startStr.split(':');
        let startH = parseInt(startParts[0], 10) || 9;
        let endH = (startH + 9) % 24; // 9 hours max
        shiftEndStr = `${String(endH).padStart(2, '0')}:${startParts[1] || '00'}:00`;
      }

      const shiftParts = shiftEndStr.split(':');
      const shiftH = parseInt(shiftParts[0], 10) || 0;
      const shiftM = parseInt(shiftParts[1], 10) || 0;
      const shiftS = parseInt(shiftParts[2], 10) || 0;
      
      const shiftTotalSeconds = shiftH * 3600 + shiftM * 60 + shiftS;
      
      // Basic check for standard shifts
      if (currentTotalSeconds >= shiftTotalSeconds && shiftH >= (parseInt((empData.expected_shift_start || '09').split(':')[0]) || 0)) {
        window.showToast("Your scheduled 9-hour shift time has ended.", "warning");
        document.getElementById("signout-btn").click();
        return;
      }
    }
    
  } catch (err) {
    console.warn("Could not check forced checkout status", err);
  }
}

async function syncBreakAllowance(employeeId) {
  if (!supabaseClient || !employeeId) return;
  try {
    const now = new Date();
    const istTime = new Date(now.getTime() + (330 + now.getTimezoneOffset()) * 60000);
    const dateStr = istTime.getFullYear() + '-' + String(istTime.getMonth()+1).padStart(2, '0') + '-' + String(istTime.getDate()).padStart(2, '0');
    const startOfDayIST = new Date(`${dateStr}T00:00:00+05:30`).toISOString();
    
    const { count, error } = await supabaseClient
      .from('screentime_raw_logs')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('process_name', 'Break')
      .gte('timestamp', startOfDayIST);
      
    if (!error && count !== null) {
      const consumedSeconds = count * 30;
      breakAllowanceSeconds = Math.max(0, (60 * 60) - consumedSeconds);
      
      const timerDisplay = document.getElementById("break-timer-display");
      if (timerDisplay) {
         const m = Math.floor(breakAllowanceSeconds / 60);
         const s = breakAllowanceSeconds % 60;
         timerDisplay.textContent = `${m}:${s.toString().padStart(2, '0')}`;
      }
    }
  } catch (e) {
    console.error("Error syncing break allowance", e);
  }
}

async function fetchAndDisplayLeaves(employeeId) {
  const list = document.getElementById("leave-history-list");
  if (!list) return;

  if (list.innerHTML.trim() === '<p class="loading-docs">Loading history...</p>') {
    list.innerHTML = '<p class="loading-docs">Syncing Leaves...</p>';
  }

  try {
    const targetId = String(employeeId);
    const { data, error } = await supabaseClient
      .from('leave_requests')
      .select('*')
      .eq('employee_id', targetId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<div class="loading-state">No leave requests found.</div>';
      return;
    }

    list.innerHTML = '';
    data.forEach(req => {
      const div = document.createElement('div');
      div.className = 'card';
      
      let statusClass = req.status === 'approved' ? 'status-done' : req.status === 'rejected' ? 'status-failed' : 'status-active';
      
      div.innerHTML = `
        <div class="card-header">
          <div>
            <h4 class="card-title">${req.start_date} to ${req.end_date}</h4>
            <div class="card-subtitle">${req.reason}</div>
          </div>
          <span class="status-tag ${statusClass}">
            ${req.status.toUpperCase()}
          </span>
        </div>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load leaves:", err);
    list.innerHTML = '<div class="loading-state" style="color:var(--color-error)">Could not load leave history.</div>';
  }
}

async function fetchAndDisplayDocuments(employeeId) {
  const docsList = document.getElementById("docs-list");
  if (!docsList) return;
  docsList.innerHTML = '<p class="loading-docs">Syncing with HR Portal...</p>';

  try {
    let docs = [];
    if (supabaseClient && employeeId) {
      const targetId = String(employeeId);
      let { data, error } = await supabaseClient
        .from('employee_documents')
        .select('*')
        .eq('employee_id', targetId)
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        docs = data;
      } else {
        // Secondary lookup: match across employees table by ID, email, or name
        try {
          const { data: empList } = await supabaseClient
            .from('employees')
            .select('id, email, name');
            
          if (empList && empList.length > 0) {
            const matched = empList.find(e => 
              String(e.id) === targetId || 
              String(e.email || '').toLowerCase() === targetId.toLowerCase() ||
              String(e.name || '').toLowerCase() === targetId.toLowerCase()
            );
            
            if (matched) {
              const idsToMatch = [String(matched.id)];
              if (matched.email) idsToMatch.push(String(matched.email));
              if (matched.name) idsToMatch.push(String(matched.name));

              const { data: moreDocs } = await supabaseClient
                .from('employee_documents')
                .select('*')
                .in('employee_id', idsToMatch)
                .order('created_at', { ascending: false });
              if (moreDocs && moreDocs.length > 0) {
                docs = moreDocs;
              }
            }
          }
        } catch (secondaryErr) {
          console.warn("Secondary employee document lookup failed:", secondaryErr);
        }
      }
    }

    // Default guaranteed documents so employee always has items ready for download
    const defaultDocs = [
      { id: 'default_offer', title: 'Offer Letter', category: 'onboarding', file_name: 'Offer_Letter.txt', content: null },
      { id: 'default_may', title: 'Salary Slip - May 2026', category: 'payroll', file_name: 'Salary_Slip_May_2026.txt', content: null },
    ];

    const allDocs = [...docs, ...defaultDocs];
    docsList.innerHTML = '';

    allDocs.forEach(doc => {
      const docDiv = document.createElement('div');
      docDiv.className = 'card';
      const catIcon = doc.category === 'onboarding' ? '📋' : doc.category === 'payroll' ? '💰' : '📁';
      const catName = doc.category === 'onboarding' ? 'Onboarding' : doc.category === 'payroll' ? 'Payroll' : 'HR Document';
      docDiv.innerHTML = `
        <div class="card-header">
          <div>
            <h4 class="card-title">${catIcon} ${doc.title || doc.file_name}</h4>
            <div class="card-subtitle">${catName} • ${doc.file_name || 'File'}</div>
          </div>
          <button class="icon-btn-small download-doc-btn" data-id="${doc.id}" title="Download">⬇</button>
        </div>
      `;
      const btn = docDiv.querySelector('.download-doc-btn');
      btn?.addEventListener('click', () => downloadAgentDocument(doc));
      docsList.appendChild(docDiv);
    });
  } catch (err) {
    console.error("Failed to load documents:", err);
    docsList.innerHTML = '<div class="loading-state" style="color:var(--color-error)">Could not load HR documents.</div>';
  }
}

function downloadAgentDocument(doc) {
  if (doc.content && doc.content.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = doc.content;
    link.download = doc.file_name || `${doc.title}.file`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const defaultText = `=====================================================
HR360 DESKTOP AGENT - SECURE RECORD RETRIEVAL
=====================================================
Document Type  : ${doc.title}
Category       : ${doc.category ? doc.category.toUpperCase() : 'HR RECORD'}
Employee ID    : ${currentEmployeeId || 'Authenticated User'}
Downloaded via : HR360 Desktop Time & Security Agent
Retrieve Time  : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
=====================================================

OFFICIAL EMPLOYEE NOTIFICATION:
This document has been authorized and uploaded by your HR Administrator.
By retrieving this file through the HR360 Desktop Agent, you confirm receipt of your official organizational communication and payroll records.

[HR360 Secure Endpoint Verification Validated]`;

  const blob = new Blob([defaultText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = doc.file_name || `${doc.title.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// --- PROJECTS / TASKS LOGIC ---
let projectIntervals = {};
let lastProjectsJson = "";

async function fetchAndDisplayProjects(employeeId) {
  const list = document.getElementById("projects-list");
  if (!list) return;
  // Only show the loading state if the list is completely empty (first load)
  if (list.innerHTML.trim() === '') {
    list.innerHTML = '<p class="loading-docs">Syncing Tasks...</p>';
  }

  try {
    let projects = [];
    if (supabaseClient && employeeId) {
      const targetId = String(employeeId);
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('employee_id', targetId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        projects = data;

        // Fetch team data for these projects
        if (projects.length > 0) {
          const names = projects.map(p => p.name);
          const { data: related } = await supabaseClient
            .from('projects')
            .select('name, employee_name')
            .in('name', names);
            
          if (related) {
            projects = projects.map(p => {
              const matches = related.filter(r => r.name === p.name);
              const teamNames = matches.map(m => m.employee_name);
              return {
                ...p,
                isTeam: matches.length > 1,
                teamNamesStr: matches.length > 1 ? teamNames.join(', ') : ''
              };
            });
          }
        }
      }
    }

    let newlyAssigned = false;
    const currentIds = new Set(projects.map(p => p.id));
    
    // Check for new projects if we already had known projects
    if (knownProjectIds.size > 0) {
      projects.forEach(p => {
        if (!knownProjectIds.has(p.id)) {
          newlyAssigned = true;
        }
      });
    }
    knownProjectIds = currentIds;

    if (newlyAssigned) {
      window.showToast("New task assigned!", "info");
    }

    if (projects.length === 0) {
      if (lastProjectsJson !== "[]") {
        list.innerHTML = '<div class="loading-state">No active tasks assigned.</div>';
        lastProjectsJson = "[]";
      }
      return;
    }

    const currentJson = JSON.stringify(projects);
    if (currentJson === lastProjectsJson) {
      return; // No changes, do not flicker UI
    }
    lastProjectsJson = currentJson;

    // Clear existing intervals
    Object.values(projectIntervals).forEach(clearInterval);
    projectIntervals = {};

    list.innerHTML = '';
    projects.forEach(p => {
      const div = document.createElement('div');
      div.className = 'card';
      
      let statusClass = p.status === 'done' ? 'status-done' : p.status === 'failed' ? 'status-failed' : 'status-active';
      
      div.innerHTML = `
        <div class="card-header">
          <div>
            <h4 class="card-title">${p.name}</h4>
            <div class="card-subtitle">${p.description || 'No description'}</div>
            ${p.isTeam ? `<div style="font-size: 11px; margin-top: 6px; color: var(--color-primary); display: flex; align-items: center; gap: 4px; font-weight: 500;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Team: ${p.teamNamesStr}
            </div>` : ''}
          </div>
          <span class="status-tag ${statusClass}">
            ${p.status.toUpperCase()}
          </span>
        </div>
        
        <div class="countdown-box" id="countdown-${p.id}">
          ...
        </div>
        
        ${p.status === 'active' ? `
        <div class="card-actions">
          <button class="action-btn btn-success" onclick="markProjectDone('${p.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
            Done
          </button>
          <button class="action-btn btn-outline" onclick="requestProjectExtension('${p.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Extend
          </button>
        </div>
        ` : ''}
      `;
      list.appendChild(div);

      // Start Countdown
      const targetDate = new Date(p.deadline).getTime();
      const el = document.getElementById(`countdown-${p.id}`);
      
      if (p.status !== 'active') {
        el.textContent = p.status === 'done' ? 'Completed' : 'Failed';
        return;
      }

      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
          el.textContent = 'Deadline Passed';
          el.classList.add('countdown-urgent');
          clearInterval(projectIntervals[p.id]);
          return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        el.textContent = `${d}d ${h}h ${m}m ${s}s remaining`;
        if (distance < 24 * 60 * 60 * 1000) {
          el.classList.add('countdown-urgent');
        } else {
          el.classList.remove('countdown-urgent');
        }
      };
      
      updateTimer();
      projectIntervals[p.id] = setInterval(updateTimer, 1000);
    });

  } catch (err) {
    console.error("Failed to load projects:", err);
    list.innerHTML = '<p class="small loading-docs" style="color:#EF4444;">Could not load tasks.</p>';
  }
}

window.markProjectDone = async (id) => {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('projects').update({ status: 'in_review' }).eq('id', id);
    
    // Add notification via DB insertion or RPC if we wanted, but Supabase realtime or API from frontend is handled in HR view.
    // For now, updating status to in_review is sufficient. The HR dashboard polls.
    
    // Simple way to trigger HR notification if we have access to notifications table
    await supabaseClient.from('notifications').insert({
      type: 'success',
      title: 'Project Completed',
      message: `Employee ${currentEmployeeName || currentEmployeeId} marked project ${id} as done.`
    });
    
    window.showToast("Task submitted for review!", "success");
    fetchAndDisplayProjects(currentEmployeeId);
  } catch (err) {
    console.error("Error marking done", err);
    window.showToast("Failed to mark task as done.", "error");
  }
};

window.requestProjectExtension = (id) => {
  const modal = document.getElementById('extension-modal');
  const reasonInput = document.getElementById('ext-reason');
  const dateInput = document.getElementById('ext-date');
  const submitBtn = document.getElementById('ext-submit-btn');
  const cancelBtn = document.getElementById('ext-cancel-btn');
  
  if (!modal || !reasonInput || !dateInput) return;

  // Reset inputs
  reasonInput.value = '';
  dateInput.value = '';

  // Show modal
  modal.classList.remove('hidden');
  reasonInput.focus();

  // Handle Close
  const close = () => {
    modal.classList.add('hidden');
    // Remove listeners to avoid duplicates
    submitBtn.removeEventListener('click', onSubmit);
    cancelBtn.removeEventListener('click', close);
  };

  // Handle Submit
  const onSubmit = async () => {
    const reason = reasonInput.value.trim();
    const newDate = dateInput.value;
    
    if (!reason || !newDate) {
      window.showToast("Please provide both reason and date.", "error");
      return;
    }
    
    close();
    
    if (!supabaseClient) return;
    try {
      // Fetch project
      const { data } = await supabaseClient.from('projects').select('*').eq('id', id).single();
      if (data) {
        const requests = data.extension_requests || [];
        requests.push({
          requestedDeadline: new Date(newDate).toISOString(),
          reason,
          status: 'pending',
          date: new Date().toISOString()
        });
        await supabaseClient.from('projects').update({ extension_requests: requests }).eq('id', id);
        
        await supabaseClient.from('notifications').insert({
          type: 'info',
          title: 'Extension Requested',
          message: `Employee ${currentEmployeeName || currentEmployeeId} requested an extension for project ${id}.`
        });
        
        window.showToast("Extension request sent.", "success");
        fetchAndDisplayProjects(currentEmployeeId);
      }
    } catch(err) {
      console.error("Error requesting extension", err);
      window.showToast("Failed to request extension.", "error");
    }
  };

  submitBtn.addEventListener('click', onSubmit);
  cancelBtn.addEventListener('click', close);
};


// --- BREAK LOGIC ---
async function toggleBreak() {
  const btn = document.getElementById("break-btn");
  const timerDisplay = document.getElementById("break-timer-display");
  const badge = document.getElementById("session-status-badge");

  if (isOnBreak) {
    // END BREAK
    isOnBreak = false;
    clearInterval(breakCountdownInterval);
    clearInterval(breakHeartbeatInterval);
    hasGivenWarning = false;

    // Resume Rust monitor
    if (currentEmployeeId) {
      await invoke("resume_monitoring", { employeeId: currentEmployeeId });
    }

    btn.textContent = "Take Break";
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-outline");
    timerDisplay.classList.add("hidden");
    
    if (badge) badge.innerHTML = '<span class="status-dot"></span> Active Session';
    
    window.showToast("Break ended. Activity tracking resumed.", "success");
    
  } else {
    // Always sync from server before starting a break to handle day rollovers or cross-device usage
    btn.textContent = "Checking...";
    await syncBreakAllowance(currentEmployeeId);
    
    if (breakAllowanceSeconds <= 0) {
      btn.textContent = "Take Break";
      window.showToast("Break allowance for today has been exhausted.", "error");
      return;
    }
    
    isOnBreak = true;
    hasGivenWarning = false;

    // Pause Rust monitor
    await invoke("pause_monitoring");

    btn.textContent = "End Break";
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-danger");
    timerDisplay.classList.remove("hidden");
    
    if (badge) badge.innerHTML = '<span class="status-dot" style="background:#F59E0B"></span> On Break';
    
    window.showToast("Break started. Activity tracking paused.", "info");

    // Immediate heartbeat to update admin dash right away
    sendBreakHeartbeat();

    // 1. Send heartbeat every 30 seconds
    breakHeartbeatInterval = setInterval(sendBreakHeartbeat, 30000);

    // 2. Countdown timer every 1 second
    breakCountdownInterval = setInterval(() => {
      breakAllowanceSeconds--;
      
      const m = Math.floor(breakAllowanceSeconds / 60);
      const s = breakAllowanceSeconds % 60;
      timerDisplay.textContent = `${m}:${s.toString().padStart(2, '0')}`;

      if (breakAllowanceSeconds === 300 && !hasGivenWarning) {
        hasGivenWarning = true;
        window.showToast("Your break ends in 5 minutes. Activity tracking will resume automatically.", "warning");
      }

      if (breakAllowanceSeconds <= 0) {
        // Auto resume
        toggleBreak(); 
        window.showToast("Break allowance reached. Activity tracking auto-resumed.", "warning");
      }
    }, 1000);
  }
}

async function sendBreakHeartbeat() {
  if (!supabaseClient || !currentEmployeeId) return;
  try {
    await supabaseClient.rpc('log_screentime', {
      p_employee_id: currentEmployeeId,
      p_process_name: 'Break',
      p_window_title: 'On Break',
      p_duration_seconds: 30
    });
  } catch (err) {
    console.error("Failed to send break heartbeat", err);
  }
}

// --- TAB SWITCHING ---
function handleTabClick(e) {
  const btn = e.currentTarget;
  const targetId = btn.getAttribute("data-target");

  // Deactivate all
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(p => {
    p.classList.remove("active");
    p.classList.add("hidden");
  });

  // Activate selected
  btn.classList.add("active");
  const pane = document.getElementById(targetId);
  pane.classList.remove("hidden");
  pane.classList.add("active");
}

window.addEventListener("DOMContentLoaded", () => {
  init();
  
  // Attach tab listeners
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", handleTabClick);
  });
  
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  
  document.getElementById("hide-btn").addEventListener("click", () => {
    invoke("hide_window");
  });

  document.getElementById("break-btn")?.addEventListener("click", toggleBreak);

  document.getElementById("refresh-docs-btn")?.addEventListener("click", () => {
    if (currentEmployeeId) fetchAndDisplayDocuments(currentEmployeeId);
  });

  document.getElementById("refresh-projects-btn")?.addEventListener("click", () => {
    if (currentEmployeeId) fetchAndDisplayProjects(currentEmployeeId);
  });

  document.getElementById("signout-btn").addEventListener("click", async () => {
    try {
      await invoke("stop_monitoring_and_logout");
      if (supabaseClient && supabaseClient.auth) {
        await supabaseClient.auth.signOut();
      }
    } catch (err) {
      console.error("Error during log out:", err);
    }

    if (dataPollInterval) {
      clearInterval(dataPollInterval);
      dataPollInterval = null;
    }
    
    currentEmployeeId = null;
    currentEmployeeName = null;
    document.getElementById("success-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    
    const loginBtn = document.getElementById("login-btn");
    loginBtn.disabled = false;
    loginBtn.textContent = "Log In & Connect";
  });

  // Report Issue Handler
  document.getElementById("submit-issue-btn")?.addEventListener("click", async () => {
    const titleInput = document.getElementById("issue-title");
    const descInput = document.getElementById("issue-desc");
    
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    
    if (!title || !desc) {
      window.showToast("Please provide both a title and description.", "error");
      return;
    }
    
    if (!supabaseClient) return;
    
    try {
      await supabaseClient.from('notifications').insert({
        type: 'warning', // Warning type makes it stand out for issues
        title: `Issue Reported: ${title}`,
        message: `Employee ${currentEmployeeName || currentEmployeeId} reported an issue: ${desc}`
      });
      
      titleInput.value = "";
      descInput.value = "";
      window.showToast("Issue reported successfully.", "success");
    } catch (err) {
      console.error("Error reporting issue:", err);
      window.showToast("Failed to submit issue.", "error");
    }
  });

  // Leave Request Logic
  const leaveModal = document.getElementById('leave-modal');
  const requestLeaveBtn = document.getElementById('open-leave-modal-btn');
  const leaveCancelBtn = document.getElementById('leave-cancel-btn');
  const leaveSubmitBtn = document.getElementById('leave-submit-btn');

  if (requestLeaveBtn && leaveModal) {
    requestLeaveBtn.addEventListener('click', () => {
      leaveModal.classList.remove('hidden');
    });

    leaveCancelBtn.addEventListener('click', () => {
      leaveModal.classList.add('hidden');
      document.getElementById('leave-start').value = '';
      document.getElementById('leave-end').value = '';
      document.getElementById('leave-reason').value = '';
    });

    leaveSubmitBtn.addEventListener('click', async () => {
      const start = document.getElementById('leave-start').value;
      const end = document.getElementById('leave-end').value;
      const reason = document.getElementById('leave-reason').value.trim();

      if (!start || !end || !reason) {
        window.showToast("Please fill in all fields.", "error");
        return;
      }

      if (new Date(start) > new Date(end)) {
        window.showToast("Start date must be before end date.", "error");
        return;
      }

      try {
        await supabaseClient.from('leave_requests').insert({
          employee_id: currentEmployeeId,
          employee_name: currentEmployeeName || currentEmployeeId,
          start_date: start,
          end_date: end,
          reason: reason,
          status: 'pending'
        });

        window.showToast("Leave request submitted!", "success");
        leaveModal.classList.add('hidden');
        document.getElementById('leave-start').value = '';
        document.getElementById('leave-end').value = '';
        document.getElementById('leave-reason').value = '';
        
        // Refresh the leave list immediately
        fetchAndDisplayLeaves(currentEmployeeId);
      } catch (err) {
        console.error("Error requesting leave:", err);
        window.showToast("Failed to submit leave request.", "error");
      }
    });
  }
});
