use serde::Serialize;
use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;
use tokio::time;

#[cfg(target_os = "windows")]
use std::ffi::OsString;
#[cfg(target_os = "windows")]
use std::os::windows::ffi::OsStringExt;
#[cfg(target_os = "windows")]
use windows::Win32::Foundation::MAX_PATH;
#[cfg(target_os = "windows")]
use windows::Win32::System::ProcessStatus::GetProcessImageFileNameW;
#[cfg(target_os = "windows")]
use windows::Win32::System::Threading::{OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION};
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
};

#[derive(Default, Debug, Serialize)]
struct AppUsage {
    duration_seconds: u32,
    window_titles: Vec<String>,
}

#[derive(Serialize)]
struct RawLogPayload<'a> {
    #[serde(rename = "p_employee_id")]
    employee_id: &'a str,
    #[serde(rename = "p_process_name")]
    process_name: &'a str,
    #[serde(rename = "p_window_title")]
    window_title: &'a str,
    #[serde(rename = "p_duration_seconds")]
    duration_seconds: u32,
}

#[cfg(target_os = "windows")]
fn get_active_window() -> Option<(String, String)> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.0 == std::ptr::null_mut() {
            return None;
        }

        let mut title_buf = [0u16; 512];
        let len = GetWindowTextW(hwnd, &mut title_buf);
        let title = OsString::from_wide(&title_buf[..len as usize])
            .to_string_lossy()
            .into_owned();

        let mut pid = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut pid));
        if pid == 0 {
            return None;
        }

        let process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid).ok()?;

        let mut path_buf = [0u16; MAX_PATH as usize];
        let path_len = GetProcessImageFileNameW(process, &mut path_buf);
        if path_len == 0 {
            let _ = windows::Win32::Foundation::CloseHandle(process);
            return None;
        }

        let full_path = OsString::from_wide(&path_buf[..path_len as usize])
            .to_string_lossy()
            .into_owned();

        let process_name = std::path::Path::new(&full_path)
            .file_name()
            .map(|s| s.to_string_lossy().into_owned())
            .unwrap_or_default();

        let _ = windows::Win32::Foundation::CloseHandle(process);

        Some((process_name, title))
    }
}

#[cfg(target_os = "macos")]
fn get_active_window() -> Option<(String, String)> {
    use std::process::Command;
    let script = r#"
        tell application "System Events"
            set frontApp to name of first application process whose frontmost is true
            set windowTitle to ""
            try
                tell process frontApp
                    set windowTitle to name of front window
                end tell
            end try
            return frontApp & linefeed & windowTitle
        end tell
    "#;

    let output = Command::new("osascript")
        .arg("-e")
        .arg(script)
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let result_str = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let mut lines = result_str.lines();
    let app_name = lines.next().unwrap_or("Unknown App").to_string();
    let window_title = lines.next().unwrap_or("").to_string();

    if app_name.is_empty() {
        None
    } else {
        Some((app_name, window_title))
    }
}

#[cfg(not(any(target_os = "windows", target_os = "macos")))]
fn get_active_window() -> Option<(String, String)> {
    Some(("Linux Application".to_string(), "Active Window".to_string()))
}

pub fn start_monitoring(employee_id: String, running_flag: Arc<AtomicBool>) {
    tauri::async_runtime::spawn(async move {
        let supabase_url = "https://qewwumxaxznuxlkwdvpy.supabase.co".to_string();
        let supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c".to_string();

        if supabase_url.is_empty() || supabase_key.is_empty() || employee_id.is_empty() {
            println!("Missing required config. Monitoring disabled.");
            return;
        }

        let client = reqwest::Client::new();
        let mut interval = time::interval(Duration::from_secs(5));
        let mut usage_map: HashMap<String, AppUsage> = HashMap::new();
        let mut ticks = 0;

        while running_flag.load(Ordering::Relaxed) {
            interval.tick().await;

            if let Some((process, title)) = get_active_window() {
                let entry = usage_map.entry(process).or_default();
                entry.duration_seconds += 5;
                if !entry.window_titles.contains(&title) {
                    entry.window_titles.push(title);
                }
            }

            ticks += 1;
            // Every 10 seconds (2 ticks of 5s)
            if ticks >= 2 {
                if !usage_map.is_empty() {
                    println!("Flushing {} apps to Supabase...", usage_map.len());
                    
                    let mut payloads = Vec::new();
                    for (app, usage) in &usage_map {
                        payloads.push(RawLogPayload {
                            employee_id: &employee_id,
                            process_name: app,
                            window_title: usage.window_titles.first().map(|s| s.as_str()).unwrap_or(""),
                            duration_seconds: usage.duration_seconds,
                        });
                    }

                    // Send to Supabase RPC
                    let mut all_success = true;
                    for payload in &payloads {
                        let url = format!("{}/rest/v1/rpc/log_screentime", supabase_url);
                        let res = client.post(&url)
                            .header("apikey", &supabase_key)
                            .header("Authorization", format!("Bearer {}", supabase_key))
                            .header("Content-Type", "application/json")
                            .json(payload)
                            .send()
                            .await;

                        match res {
                            Ok(response) => {
                                if !response.status().is_success() {
                                    all_success = false;
                                    println!("Supabase Error for {}: {:?}", payload.process_name, response.text().await.unwrap_or_default());
                                }
                            }
                            Err(e) => {
                                all_success = false;
                                println!("Network error for {}: {:?}", payload.process_name, e);
                            }
                        }
                    }
                    
                    if all_success {
                        println!("Successfully synced batch to Supabase.");
                        usage_map.clear();
                    } else {
                        println!("Network issue detected. Buffering {} apps for next retry...", usage_map.len());
                    }
                }

                ticks = 0;
            }
        }
        println!("Monitoring stopped cleanly.");
    });
}
