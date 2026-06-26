#[tauri::command]
fn backend_url() -> String {
    "http://localhost:5000".to_string()
}

#[tauri::command]
fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            backend_url,
            app_version
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
