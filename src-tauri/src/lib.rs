// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
struct Config {
    mcpServers: serde_json::Value, // 允许动态 JSON 结构
}

fn get_config_path(name: &str, user_path: Option<&str>) -> Result<String, std::io::Error> {
    let home = env::var("HOME").unwrap_or_default();
    let appdata = env::var("APPDATA").unwrap_or_default();
    match name.to_lowercase().as_str() {
        "claude" => {
            if cfg!(target_os = "macos") {
                Ok(format!(
                    "{}/Library/Application Support/Claude/claude_desktop_config.json",
                    home
                ))
            } else if cfg!(target_os = "windows") {
                Ok(format!("{}\\Claude\\claude_desktop_config.json", appdata))
            } else {
                Err(std::io::Error::new(
                    std::io::ErrorKind::NotFound,
                    "Unsupported OS for Claude config",
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
                    "Path is required for cursor",
                ))
            }
        }
        "windsurf" => Ok(format!("{}/.codeium/windsurf/mcp_config.json", home)),
        _ => Err(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "Unsupported application name",
        )),
    }
}

#[command]
fn read_json(client: &str, user_path: Option<&str>) -> Result<Config, String> {
    let json_file = get_config_path(client, user_path).map_err(|e| e.to_string())?;
    let json_str = fs::read_to_string(json_file).map_err(|e| e.to_string())?;
    let config: Config = serde_json::from_str(&json_str).map_err(|e| e.to_string())?;
    Ok(config)
}

#[command]
fn update_key(
    client: &str,
    user_path: Option<&str>,
    key: String,
    value: serde_json::Value, // 确保传入的 value 是可用的
) -> Result<(), String> {
    // 获取配置文件路径
    let json_file = get_config_path(client, user_path).map_err(|e| e.to_string())?;

    // 读取或初始化 JSON 数据
    let mut json_data: HashMap<String, Value> = match Path::new(&json_file).exists() {
        true => {
            let content = fs::read_to_string(&json_file).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        }
        false => HashMap::new(),
    };

    // 获取或初始化 "mcpServers" 对象
    let mcp_servers = json_data
        .entry("mcpServers".to_string())
        .or_insert_with(|| json!({}));

    // 确保 mcp_servers 是对象类型
    if !mcp_servers.is_object() {
        *mcp_servers = json!({});
    }
    // 更新键值对到 mcpServers
    if let Some(obj) = mcp_servers.as_object_mut() {
        obj.insert(key, value.clone()); // 使用 clone() 确保传入的 value 被正确复制
    } else {
        return Err("Failed to convert mcpServers to mutable object".to_string());
    }

    // 将更新后的 JSON 写入文件
    let new_content = serde_json::to_string_pretty(&json_data).map_err(|e| e.to_string())?;
    fs::write(&json_file, new_content).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn delete_key(client: &str, user_path: Option<&str>, key: String) -> Result<(), String> {
    let json_file = match get_config_path(client, user_path) {
        Ok(path) => path,
        Err(e) => return Err(e.to_string()),
    };

    let json_str = match fs::read_to_string(&json_file) {
        Ok(content) => content,
        Err(e) => return Err(e.to_string()),
    };

    let mut config: Config = match serde_json::from_str(&json_str) {
        Ok(config) => config,
        Err(e) => return Err(e.to_string()),
    };
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
    fs::write(json_file, new_json).map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_json, update_key, delete_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
