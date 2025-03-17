// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::command;

use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use serde_json::{Value, from_str, to_string_pretty};


#[derive(Debug, Serialize, Deserialize)]
struct Config {
    mcpServers: serde_json::Value, // 允许动态 JSON 结构
}

fn get_config_path(name: &str, user_path: Option<&str>) -> Result<String, std::io::Error> {
    match name.to_lowercase().as_str() {
        "claude" => {
            if cfg!(target_os = "macos") {
                let home = env::var("HOME").unwrap_or_default();
                Ok(format!("{}/Library/Application Support/Claude/claude_desktop_config.json", home))
            } else if cfg!(target_os = "windows") {
                let appdata = env::var("APPDATA").unwrap_or_default();
                Ok(format!("{}\\Claude\\claude_desktop_config.json", appdata))
            } else {
                Err(std::io::Error::new(
                    std::io::ErrorKind::NotFound,
                    "Unsupported OS for Claude config"
                ))
            }
        }
        "cursor" => {
            if let Some(path) = user_path {
                let full_path = PathBuf::from(path).join(".cursor/mcp.json");
                Ok(full_path.to_string_lossy().to_string())
            } else {
                Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    "Path is required for cursor"
                ))
            }
        }
        _ => {
            Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                "Unsupported application name"
            ))
        }
    }
}

#[command]
fn read_json(client: &str, user_path: Option<&str>) -> Result<Config, String> {
    let JSON_FILE = get_config_path(client, user_path)?;
    let json_str = fs::read_to_string(JSON_FILE).map_err(|e| e.to_string())?;
    let config: Config = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;
    Ok(config)
}

#[command]
fn update_key(client: &str, user_path: Option<&str>, key: String, value: serde_json::Value) -> Result<(), String> {
    let JSON_FILE = get_config_path(client, user_path)?;
    let json_str = fs::read_to_string(JSON_FILE).map_err(|e| e.to_string())?;
    let mut config: Config = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;

    // 更新 key 的值
    config.mcpServers[key] = value;

    // 保存 JSON
    let new_json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(JSON_FILE, new_json).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn delete_key(client: &str, user_path: Option<&str>, key: String) -> Result<(), String> {
    let JSON_FILE = get_config_path(client, user_path)?;
    let json_str = fs::read_to_string(JSON_FILE).map_err(|e| e.to_string())?;
    let mut config: Config = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;

    let mut deleted = false;

    // 删除 mcpServers 里的 key
    if let serde_json::Value::Object(ref mut map) = config.mcpServers {
        if map.remove(&key).is_some() {
            deleted = true;
        }
    }

    // 如果 key 根本不存在
    if !deleted {
        return Err("key 不存在".to_string());
    }
    // 保存 JSON
    let new_json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(JSON_FILE, new_json).map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![ read_json, update_key, delete_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
