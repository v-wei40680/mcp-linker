use serde_json::{json, Value};
use std::fs;
use std::io::ErrorKind;
use std::path::Path;

pub struct JsonManager;

impl JsonManager {
    pub fn read_json_file(path: &Path) -> Result<Value, String> {
        match fs::read_to_string(path) {
            Ok(content) => match serde_json::from_str(&content) {
                Ok(json) => Ok(json),
                Err(e) => Err(format!("Failed to parse JSON: {}", e)),
            },
            Err(e) => {
                if e.kind() == ErrorKind::NotFound {
                    // Return empty JSON if file doesn't exist
                    Ok(json!({}))
                } else {
                    Err(format!("Failed to read file: {}", e))
                }
            }
        }
    }

    pub fn write_json_file(path: &Path, content: &Value) -> Result<(), String> {
        // Ensure directory exists
        if let Some(parent) = path.parent() {
            if !parent.exists() {
                if let Err(e) = fs::create_dir_all(parent) {
                    return Err(format!("Failed to create directory: {}", e));
                }
            }
        }

        // Write the JSON file with pretty formatting
        let json_string = match serde_json::to_string_pretty(content) {
            Ok(s) => s,
            Err(e) => return Err(format!("Failed to serialize JSON: {}", e)),
        };

        match fs::write(path, json_string) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to write file: {}", e)),
        }
    }

    pub fn add_mcp_server(path: &Path, name: &str, config: Value) -> Result<Value, String> {
        let mut json = Self::read_json_file(path)?;

        // Ensure mcpServers exists
        if !json.is_object() {
            json = json!({});
        }

        if !json.as_object().unwrap().contains_key("mcpServers") {
            json["mcpServers"] = json!({});
        }

        // Add new server
        json["mcpServers"][name] = config;

        // Write back to file
        Self::write_json_file(path, &json)?;

        Ok(json)
    }

    pub fn remove_mcp_server(path: &Path, name: &str) -> Result<Value, String> {
        let mut json = Self::read_json_file(path)?;

        // Check if mcpServers exists
        if json.is_object() && json.as_object().unwrap().contains_key("mcpServers") {
            if json["mcpServers"].is_object()
                && json["mcpServers"].as_object().unwrap().contains_key(name)
            {
                json["mcpServers"].as_object_mut().unwrap().remove(name);
            }
        }

        // Write back to file
        Self::write_json_file(path, &json)?;

        Ok(json)
    }

    pub fn update_mcp_server(path: &Path, name: &str, config: Value) -> Result<Value, String> {
        let mut json = Self::read_json_file(path)?;

        // Check if mcpServers exists
        if json.is_object() && json.as_object().unwrap().contains_key("mcpServers") {
            if json["mcpServers"].is_object()
                && json["mcpServers"].as_object().unwrap().contains_key(name)
            {
                json["mcpServers"][name] = config;
            } else {
                return Self::add_mcp_server(path, name, config);
            }
        } else {
            return Self::add_mcp_server(path, name, config);
        }

        // Write back to file
        Self::write_json_file(path, &json)?;

        Ok(json)
    }
}
