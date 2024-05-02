// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cache;
mod disk;
mod file_explorer;
use file_explorer::FileExplorer;
use lazy_static::lazy_static;
use std::{
    process::Command,
    sync::{Arc, Mutex},
};
use tauri::Manager;
use window_shadows::set_shadow;
use window_vibrancy::apply_acrylic;

lazy_static! {
    static ref FILE_EXPLORER: Arc<Mutex<Option<FileExplorer>>> = Arc::new(Mutex::new(None));
}

#[tauri::command]
async fn initialize_file_explorer(window: tauri::Window) {
    let mut file_explorer = FILE_EXPLORER.lock().unwrap();
    if file_explorer.is_none() {
        *file_explorer = Some(FileExplorer::new(window));
    }
}

#[tauri::command]
async fn search(query: String) -> String {
    let file_explorer = FILE_EXPLORER.lock().unwrap();
    let file_explorer = file_explorer.as_ref().unwrap();
    let results = file_explorer.search(&query);
    serde_json::to_string(&results).unwrap()
}

#[tauri::command]
async fn open(path: String) -> bool {
    Command::new("explorer")
        .arg(path) // <- Specify the directory you'd like to open.
        .spawn()
        .unwrap();
    true
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            apply_acrylic(&window, Some((0, 0, 0, 10))).expect("Failed to apply acrylic effect");

            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            initialize_file_explorer,
            search,
            open
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
