// AppList.tsx (updated)
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mcpServers, needspathClient } from "../lib/data";
import type { Server, serverConfig } from "../types";
import { open } from "@tauri-apps/plugin-shell";
import { ServerConfigDialog } from "./ServerConfigDialog";
import { useTranslation } from "react-i18next";
import { Flame, Github } from "lucide-react";
import { toast } from "sonner";

interface AppListProps {
  selectedApp: string;
  selectedPath: string;
}

export function ClientList({ selectedApp, selectedPath }: AppListProps) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [config, setConfig] = useState<serverConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServers = mcpServers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openDialog = (server: Server) => {
    setCurrentServer(server);
    const currentConfig = server.configs[0];
    const env = currentConfig.env
      ? Object.fromEntries(
          Object.entries(currentConfig.env).map(([key]) => [key, ""]),
        )
      : {};
    const newConfig = {
      command: currentConfig.command,
      env: env,
      args: currentConfig.args,
    };
    setConfig(newConfig);
    setIsDialogOpen(true);
  };

  async function updateConfig(selectedServer: string, value: serverConfig) {
    try {
      await invoke("add_mcp_server", {
        appName: selectedApp,
        path: selectedPath,
        serverName: selectedServer,
        serverConfig: value,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async () => {
    if (needspathClient.includes(selectedApp) && !selectedPath) {
      toast.error("Path is required");
      return;
    }
    if (!currentServer) {
      toast.error("Please select a server");
      return;
    }

    const client = mcpServers.find((a) => a.source === currentServer.source);
    if (!client) {
      toast.error("Client not found");
      return;
    }

    if (client && config) {
      try {
        await updateConfig(client.name, config);
        setIsDialogOpen(false);
        toast.success("Configuration updated successfully");
      } catch (error) {
        console.error("Failed to update config:", error);
        toast.error("Failed to update configuration");
      }
    }
  };

  const handleArgsChange = (value: string) => {
    if (config) {
      // Only update if the value has actually changed
      const newArgs = value.split(" ").filter((arg) => arg !== "");
      if (JSON.stringify(newArgs) !== JSON.stringify(config.args)) {
        setConfig({ ...config, args: newArgs });
      }
    }
  };

  const handleCommandChange = (value: string) => {
    if (config) {
      setConfig({ ...config, command: value });
    }
  };

  const handleEnvChange = (key: string, value: string) => {
    if (config) {
      setConfig({ ...config, env: { ...config.env, [key]: value } });
    }
  };

  function openUrl(url: string, branch = "main") {
    if (url.includes("github.com") && url.includes("modelcontextprotocol")) {
      const parts = url.split("/src/");
      const baseUrl = parts[0];
      const path = parts[1] ? `/src/${parts[1]}` : "";
      url = `${baseUrl}/tree/${branch}${path}`;
    }
    console.log(url);
    open(url);
  }

  return (
    <div>
      <Input
        type="text"
        placeholder="Search servers by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredServers.map((app) => (
          <Card key={app.source} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  <span
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-500 hover:underline"
                    onClick={() => openUrl(app.source || "")}
                  >
                    {app.name} <Github size={18} />
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  {app.is_official && (
                    <span className="text-green-500" title="Official">
                      ✅
                    </span>
                  )}
                  {app.is_hot && (
                    <span className="text-orange-500" title="Hot">
                      <Flame size={18} />
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  By {app.developer}
                </p>
                <p className="text-sm line-clamp-2">{app.description || ""}</p>
              </div>

              <Button
                className="w-full"
                onClick={() => openDialog(app)}
                variant="default"
              >
                {t("get")}
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      <ServerConfigDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentServer={currentServer}
        selectedApp={selectedApp}
        config={config}
        setConfig={setConfig}
        handleSubmit={handleSubmit}
        handleArgsChange={handleArgsChange}
        handleCommandChange={handleCommandChange}
        handleEnvChange={handleEnvChange}
      />
    </div>
  );
}
