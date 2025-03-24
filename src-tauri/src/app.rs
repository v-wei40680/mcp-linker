use std::env;
use std::path::{Path, PathBuf};

pub struct AppConfig {
    pub name: String,
    pub path: PathBuf,
}

impl AppConfig {
    pub fn new(name: &str, path: Option<&str>) -> Self {
        let path = match (name, path) {
            ("claude", _) => {
                // For Claude, we use the default path
                let home = env::var("HOME").unwrap_or_else(|_| String::from("~"));
                PathBuf::from(home)
                    .join("Library/Application Support/Claude/claude_desktop_config.json")
            }
            ("cursor", Some(base_path)) => {
                // For Cursor, we use the provided path + .cursor/mcp.json
                PathBuf::from(base_path).join(".cursor/mcp.json")
            }
            (_, Some(path)) => {
                // For any other app, use the provided path directly
                PathBuf::from(path)
            }
            _ => {
                // Default case
                PathBuf::from("")
            }
        };

        Self {
            name: name.to_string(),
            path,
        }
    }

    pub fn get_path(&self) -> &Path {
        &self.path
    }
}
