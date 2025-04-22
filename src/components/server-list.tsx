// AppList.tsx (updated)
import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ServerType } from "../types";
import { open } from "@tauri-apps/plugin-shell";
import { ServerConfigDialog } from "./ServerConfigDialog";
import { useTranslation } from "react-i18next";
import { Flame, Github } from "lucide-react";


interface AppListProps {
  selectedApp: string;
  selectedPath: string;
  mcpServers: ServerType[];
}

export function ServerList({ selectedApp, selectedPath, mcpServers }: AppListProps) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState<ServerType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredServers = mcpServers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openDialog = (server: ServerType) => {
    setCurrentServer(server);
    setIsDialogOpen(true);
  };

  function openUrl(url: string, branch = "main") {
    if (url.includes("github.com") && url.includes("modelcontextprotocol")) {
      const parts = url.split("/src/");
      const baseUrl = parts[0];
      const path = parts[1] ? `/src/${parts[1]}` : "";
      url = `${baseUrl}/tree/${branch}${path}`;
    }
    open(url);
  }
  return (
    <div ref={containerRef} className="h-full">
      <Input
        type="text"
        placeholder="Search servers by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredServers.map((app) => (
          <Card
            key={`${app.name}-${app.source}`}
            className="hover:shadow-lg transition-shadow"
          >
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

      {currentServer && (
        <ServerConfigDialog
          isOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          currentServer={currentServer}
          selectedApp={selectedApp}
          selectedPath={selectedPath}
          mcpServers={mcpServers}
        />
      )}
    </div>
  );
}
