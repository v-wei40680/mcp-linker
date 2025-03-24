import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Button } from "./ui/button";
// import { useTranslation } from "react-i18next";

type ToolStatus = {
  name: string;
  cmd: string;
  pkg: string;
  fallbackUrl?: string; // Add fallback URL for manual installation
};

const STORAGE_KEY = 'tools_check_status';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function InstallTools() {
  // const { t } = useTranslation();
  const [toolsStatus, setToolsStatus] = useState<
    Record<string, boolean | null>
  >({
    python3: null,
    npx: null,
    uv: null,
  });

  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [firstLoad, setFirstLoad] = useState(true);

  const toolsConfig: ToolStatus[] = [
    {
      name: "Python",
      cmd: "python3",
      pkg: "python3",
      fallbackUrl: "https://www.python.org/downloads/",
    },
    {
      name: "npx",
      cmd: "npx",
      pkg: "nodejs",
      fallbackUrl: "https://nodejs.org/en/download/",
    },
    {
      name: "UV",
      cmd: "uv",
      pkg: "astral/uv",
      fallbackUrl: "https://github.com/astral-sh/uv",
    },
  ];

  useEffect(() => {
    if (firstLoad) {
      loadOrCheckTools();
      setFirstLoad(false);
    }
  }, [firstLoad]);

  const loadOrCheckTools = async () => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { status, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        // If cache is still valid (less than 24 hours old)
        if (now - timestamp < CACHE_DURATION) {
          setToolsStatus(status);
          // Show cached status without making system calls
          Object.entries(status).forEach(([cmd, installed]) => {
            const tool = toolsConfig.find(t => t.cmd === cmd);
            if (tool) {
              if (installed) {
                toast.success(`${tool.name} is installed`, { duration: 1000 });
              } else {
                toast(`${tool.name} not installed`, {
                  action: {
                    label: "Install",
                    onClick: async () => await installTool(tool),
                  },
                  duration: 5000,
                });
              }
            }
          });
          return;
        }
      }
      
      // If no cache or cache expired, perform actual check
      await checkAllTools();
    } catch (error) {
      console.error('Error loading cached status:', error);
      await checkAllTools();
    }
  };

  async function checkAllTools() {
    const updatedStatus = { ...toolsStatus };

    for (const tool of toolsConfig) {
      try {
        const installed = await invoke<boolean>("check_command_exists", {
          command: tool.cmd,
        });
        console.log(
          `${tool.name}: ${installed ? "installed" : "not installed"}`,
        );

        if (!installed) {
          toast(`${tool.name} not installed`, {
            action: {
              label: "Install",
              onClick: async () => await installTool(tool),
            },
            duration: 5000,
          });
        } else {
          toast.success(`${tool.name} is installed`, { duration: 1000 });
        }
        updatedStatus[tool.cmd] = installed;
      } catch (error) {
        console.error(`Failed to check ${tool.name}:`, error);
        updatedStatus[tool.cmd] = false;
        toast.error(`Failed to check ${tool.name}`);
      }
    }

    setToolsStatus(updatedStatus);
    
    // Cache the results
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        status: updatedStatus,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching status:', error);
    }
  }

  async function installTool(tool: ToolStatus) {
    // Prevent multiple installation attempts
    if (isInstalling[tool.cmd]) {
      return;
    }

    setIsInstalling((prev) => ({ ...prev, [tool.cmd]: true }));

    const toastId = toast.loading(`Installing ${tool.name}...`);

    try {
      const result = await invoke<{ Ok: string } | { Err: string }>(
        "install_command",
        { packageName: tool.pkg, packageManage: "brew" },
      );

      if ("Ok" in result) {
        toast.success(`${tool.name} installed successfully`, {
          id: toastId,
          duration: 2000,
        });
        setToolsStatus((prev) => ({
          ...prev,
          [tool.cmd]: true,
        }));
      } else {
        toast.error(
          <div>
            <p>
              Failed to install {tool.name}: {result.Err}
            </p>
            {tool.fallbackUrl && (
              <p className="text-sm mt-1">
                Please install manually from:
                <a
                  href={tool.fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline ml-1"
                >
                  {tool.fallbackUrl}
                </a>
              </p>
            )}
          </div>,
          { id: toastId, duration: 10000 },
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(
        <div>
          <p>
            Failed to install {tool.name}: {errorMessage}
          </p>
          {tool.fallbackUrl && (
            <p className="text-sm mt-1">
              Please install manually from:
              <a
                href={tool.fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline ml-1"
              >
                {tool.fallbackUrl}
              </a>
            </p>
          )}
        </div>,
        { id: toastId, duration: 10000 },
      );
      console.error(`Failed to install ${tool.name}:`, error);
    } finally {
      setIsInstalling((prev) => ({ ...prev, [tool.cmd]: false }));
    }
  }

  return (
    <div className="flex relative group">
      <Button onClick={() => checkAllTools()}>checkAllTools</Button>
    </div>
  );
}
