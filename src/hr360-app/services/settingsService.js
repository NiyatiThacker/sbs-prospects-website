/**
 * Settings service — allotted hours, app categories, alert thresholds.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let settingsState = {
  allottedHours: {
    default: 8,
    overrides: [
      { department: 'Engineering', hours: 8 },
      { department: 'Sales', hours: 7.5 },
    ],
  },
  appCategories: [
    { app: 'VS Code', category: 'productive' },
    { app: 'Figma', category: 'productive' },
    { app: 'Jira', category: 'productive' },
    { app: 'GitHub', category: 'productive' },
    { app: 'Google Docs', category: 'productive' },
    { app: 'Slack', category: 'neutral' },
    { app: 'Zoom', category: 'neutral' },
    { app: 'Chrome', category: 'neutral' },
    { app: 'YouTube', category: 'distracting' },
    { app: 'Twitter/X', category: 'distracting' },
    { app: 'Reddit', category: 'distracting' },
  ],
  alertThresholds: {
    lowUtilization: 70,
    criticalUtilization: 60,
    consecutiveDays: 3,
  },
};

export async function getSettings() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('app_classifications')
        .select('*');
      
      if (error) throw error;

      if (data && data.length > 0) {
        const uniqueMap = {};
        
        // Regex to catch transient window titles (e.g., "0% Complete", "100% Complete")
        const garbageRegex = /^\d+%\s*Complete$/i;

        data.forEach(item => {
          const name = item.display_name?.trim();
          if (name && !garbageRegex.test(name) && !uniqueMap[name]) {
            uniqueMap[name] = item.category || 'neutral';
          }
        });
        
        const appCategories = Object.entries(uniqueMap)
          .map(([app, category]) => ({ app, category }))
          .sort((a, b) => a.app.localeCompare(b.app));
        settingsState.appCategories = appCategories;

        return {
          ...settingsState,
          appCategories,
        };
      }
    } catch (err) {
      console.error('[Supabase] Error fetching settings, falling back to mock:', err);
    }
  }

  await delay(400);
  return { ...settingsState };
}

export async function updateSettings(updates) {
  if (isSupabaseConfigured) {
    try {
      if (updates.appCategories) {
        for (const item of updates.appCategories) {
          const { error } = await supabase
            .from('app_classifications')
            .update({ category: item.category })
            .eq('display_name', item.app);
          if (error) throw error;
        }
      }
      // Also update local state
      settingsState = { ...settingsState, ...updates };
      return settingsState;
    } catch (err) {
      console.error('[Supabase] Error updating settings:', err);
    }
  }

  await delay(500);
  settingsState = { ...settingsState, ...updates };
  return settingsState;
}

