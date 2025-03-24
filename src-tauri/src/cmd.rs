use crate::app::AppConfig;
use crate::json_manager::JsonManager;
use serde_json::Value;
use std::process::Command;

#[tauri::command]
pub async fn read_json_file(app_name: String, path: Option<String>) -> Result<Value, String> {
    let app_config = AppConfig::new(&app_name, path.as_deref());
    let file_path = app_config.get_path();

    if !file_path.exists() && app_name != "claude" {
        return Err(format!("File not found: {}", file_path.display()));
    }

    JsonManager::read_json_file(file_path)
}

#[tauri::command]
pub async fn write_json_file(
    app_name: String,
    path: Option<String>,
    content: Value,
) -> Result<(), String> {
    let app_config = AppConfig::new(&app_name, path.as_deref());
    let file_path = app_config.get_path();

    JsonManager::write_json_file(file_path, &content)
}

#[tauri::command]
pub async fn get_app_path(app_name: String, path: Option<String>) -> Result<String, String> {
    let app_config = AppConfig::new(&app_name, path.as_deref());
    let file_path = app_config.get_path();

    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn add_mcp_server(
    app_name: String,
    path: Option<String>,
    server_name: String,
    server_config: Value,
) -> Result<Value, String> {
    let app_config = AppConfig::new(&app_name, path.as_deref());
    let file_path = app_config.get_path();

    JsonManager::add_mcp_server(file_path, &server_name, server_config)
}

#[tauri::command]
pub async fn remove_mcp_server(
    app_name: String,
    path: Option<String>,
    server_name: String,
) -> Result<Value, String> {
    let app_config = AppConfig::new(&app_name, path.as_deref());
    let file_path = app_config.get_path();

    JsonManager::remove_mcp_server(file_path, &server_name)
}

#[tauri::command]
pub async fn update_mcp_server(
    app_name: String,
    path: Option<String>,
    server_name: String,
    server_config: Value,
) -> Result<Value, String> {
    let app_config = AppConfig::new(&app_name, path.as_deref());
    let file_path = app_config.get_path();

    JsonManager::update_mcp_server(file_path, &server_name, server_config)
}

#[tauri::command]
pub fn install_command(
    package_name: String,
    package_manage: Option<String>,
) -> Result<String, String> {
    let manager = package_manage.unwrap_or("brew".to_string());
    // Special handling for UV installation
    if manager.contains("curl") {
        return install_uv_by_curl();
    }

    #[cfg(target_os = "windows")]
    let result = Command::new("powershell")
        .args(&["-Command", &format!("winget install {}", package_name)])
        .output();

    #[cfg(target_os = "macos")]
    let result = Command::new("sh")
        .args(&["-c", &format!("brew install {}", package_name)])
        .output();

    #[cfg(target_os = "linux")]
    let result = {
        // Try to detect package manager
        if Command::new("apt").arg("-v").output().is_ok() {
            Command::new("sudo")
                .args(&["apt", "install", "-y", &package_name])
                .output()
        } else if Command::new("dnf").arg("-v").output().is_ok() {
            Command::new("sudo")
                .args(&["dnf", "install", "-y", &package_name])
                .output()
        } else if Command::new("pacman").arg("-V").output().is_ok() {
            Command::new("sudo")
                .args(&["pacman", "-S", "--noconfirm", &package_name])
                .output()
        } else {
            return Err("Unsupported Linux package manager".to_string());
        }
    };

    match result {
        Ok(output) => {
            if output.status.success() {
                Ok("installed successfully".to_string())
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();
                let stdout = String::from_utf8_lossy(&output.stdout).to_string();

                if stderr.is_empty() && stdout.is_empty() {
                    Err("Unknown installation error".to_string())
                } else if !stderr.is_empty() {
                    Err(stderr)
                } else {
                    Err(stdout)
                }
            }
        }
        Err(e) => Err(format!("Failed to execute installation command: {}", e)),
    }
}

fn install_uv_by_curl() -> Result<String, String> {
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    {
        // Install UV using curl for macOS and Linux
        let result = Command::new("curl")
            .args(&["-LsSf", "https://astral.sh/uv/install.sh"])
            .stdout(std::process::Stdio::piped())
            .spawn()
            .and_then(|child| Command::new("sh").stdin(child.stdout.unwrap()).output());

        match result {
            Ok(output) => {
                if output.status.success() {
                    Ok("UV installed successfully".to_string())
                } else {
                    let error_msg = String::from_utf8_lossy(&output.stderr).to_string();
                    if error_msg.is_empty() {
                        Err("UV installation failed with no error message".to_string())
                    } else {
                        Err(error_msg)
                    }
                }
            }
            Err(e) => Err(format!("Failed to execute UV installation script: {}", e)),
        }
    }

    #[cfg(target_os = "windows")]
    {
        // For Windows, use PowerShell to install UV
        let result = Command::new("powershell")
            .args(&[
                "-Command",
                "iwr https://astral.sh/uv/install.ps1 -useb | iex",
            ])
            .output();

        match result {
            Ok(output) => {
                if output.status.success() {
                    Ok("UV installed successfully".to_string())
                } else {
                    let error_msg = String::from_utf8_lossy(&output.stderr).to_string();
                    if error_msg.is_empty() {
                        Err("UV installation failed with no error message".to_string())
                    } else {
                        Err(error_msg)
                    }
                }
            }
            Err(e) => Err(format!("Failed to execute UV installation script: {}", e)),
        }
    }

    // Fallback for unsupported operating systems
    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    {
        Err("UV installation is not supported on this operating system".to_string())
    }
}

// Additional command to check if a command exists
#[tauri::command]
pub fn check_command_exists(command: String) -> Result<bool, String> {
    let exists = match std::env::consts::OS {
        "windows" => Command::new("powershell")
            .args(&[
                "-Command",
                &format!("Get-Command {} -ErrorAction SilentlyContinue", command),
            ])
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false),
        _ => Command::new("which")
            .arg(&command)
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false),
    };

    Ok(exists)
}

#[tauri::command]
pub async fn install_uv() -> Result<String, String> {
    let brew_check = Command::new("which")
        .arg("uv")
        .output()
        .map_err(|e| e.to_string())?;

    if brew_check.status.success() {
        return Ok(String::from_utf8_lossy(&brew_check.stdout)
            .trim()
            .to_string());
    }

    let output = Command::new("brew")
        .args(["install", "uv"])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
    }
}
