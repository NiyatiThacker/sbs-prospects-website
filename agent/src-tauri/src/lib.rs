mod monitor;
use std::sync::Mutex;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::State;
use std::fs;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct SupabaseConfig {
    url: String,
    key: String,
}

#[derive(Serialize, Deserialize, Default)]
struct AppConfig {
    employee_id: String,
}

// Global state to prevent starting multiple times and support clean shutdown
struct AppState {
    monitoring_started: Mutex<bool>,
    monitoring_flag: Arc<AtomicBool>,
}

#[tauri::command]
fn get_supabase_config() -> SupabaseConfig {
    SupabaseConfig {
        url: "https://qewwumxaxznuxlkwdvpy.supabase.co".to_string(),
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c".to_string(),
    }
}

#[tauri::command]
fn start_monitoring_with_credentials(employee_id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut started = state.monitoring_started.lock().unwrap();
    if *started {
        return Ok(()); // Already started
    }
    
    // Save to local config.json for persistence
    let config = AppConfig { employee_id: employee_id.clone() };
    if let Ok(json) = serde_json::to_string(&config) {
        let _ = fs::write("config.json", json);
    }
    
    *started = true;
    state.monitoring_flag.store(true, Ordering::Relaxed);
    monitor::start_monitoring(employee_id, state.monitoring_flag.clone());
    Ok(())
}

#[tauri::command]
fn stop_monitoring_and_logout(state: State<'_, AppState>) -> Result<(), String> {
    state.monitoring_flag.store(false, Ordering::Relaxed);
    let mut started = state.monitoring_started.lock().unwrap();
    *started = false;
    let _ = fs::remove_file("config.json");
    Ok(())
}

#[tauri::command]
fn pause_monitoring(state: State<'_, AppState>) -> Result<(), String> {
    state.monitoring_flag.store(false, Ordering::Relaxed);
    let mut started = state.monitoring_started.lock().unwrap();
    *started = false;
    Ok(())
}

#[tauri::command]
fn resume_monitoring(employee_id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut started = state.monitoring_started.lock().unwrap();
    if *started {
        return Ok(());
    }
    *started = true;
    state.monitoring_flag.store(true, Ordering::Relaxed);
    monitor::start_monitoring(employee_id, state.monitoring_flag.clone());
    Ok(())
}

#[tauri::command]
fn get_saved_employee_id() -> String {
    if let Ok(content) = fs::read_to_string("config.json") {
        if let Ok(config) = serde_json::from_str::<AppConfig>(&content) {
            return config.employee_id;
        }
    }
    String::new()
}

#[tauri::command]
fn hide_window(window: tauri::Window) {
    let _ = window.hide();
}

use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, MouseButton, MouseButtonState, TrayIconEvent},
    Manager
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event {
                        if let Some(window) = tray.app_handle().get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                let _ = window.hide();
                api.prevent_close();
            }
            tauri::WindowEvent::Resized(_) => {
                if let Ok(is_minimized) = window.is_minimized() {
                    if is_minimized {
                        let _ = window.hide();
                    }
                }
            }
            _ => {}
        })
        .manage(AppState {
            monitoring_started: Mutex::new(false),
            monitoring_flag: Arc::new(AtomicBool::new(false)),
        })
        .invoke_handler(tauri::generate_handler![
            get_supabase_config,
            start_monitoring_with_credentials,
            stop_monitoring_and_logout,
            pause_monitoring,
            resume_monitoring,
            get_saved_employee_id,
            hide_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
