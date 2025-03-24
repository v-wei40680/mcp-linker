// ServerConfigDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Server, serverConfig } from "../types";
import { useTranslation } from "react-i18next";

interface ServerConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentServer: Server | null;
  config: serverConfig | null;
  selectedApp: string;
  setConfig: (config: serverConfig) => void;
  handleSubmit: () => void;
  handleArgsChange: (value: string) => void;
  handleCommandChange: (value: string) => void;
  handleEnvChange: (key: string, value: string) => void;
}

export function ServerConfigDialog({
  isOpen,
  onOpenChange,
  currentServer,
  selectedApp,
  config,
  setConfig,
  handleSubmit,
  handleArgsChange,
  handleCommandChange,
  handleEnvChange,
}: ServerConfigDialogProps) {
  if (!config || !currentServer) return null;
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-auto bg-background dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-gray-100">{currentServer.name} Configuration</DialogTitle>
          <DialogDescription className="text-muted-foreground dark:text-gray-400">
            Configure the command args and environment variables
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          {currentServer.configs.map((c) => (
            <Button key={c.command} onClick={() => setConfig(c)} variant="default">
              {c.command}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-foreground dark:text-gray-100">Command</Label>
            <Input value={config.command} onChange={(e) => handleCommandChange(e.target.value)} className="dark:bg-gray-700 dark:border-gray-600"  />
          </div>
          {config.args && (
            <div className="grid gap-2">
              <Label className="text-foreground dark:text-gray-100">args</Label>
              <Textarea
                value={config.args.join(" ")}
                onChange={(e) => handleArgsChange(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}
          {config.env && (
            <div className="grid gap-2">
              <h2 className="text-foreground dark:text-gray-100">env</h2>
              {Object.entries(config.env).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 items-center gap-2">
                  <Label className="col-span-1 text-foreground dark:text-gray-100">{key}</Label>
                  <Input
                    className="col-span-3 dark:bg-gray-700 dark:border-gray-600"
                    value={value}
                    onChange={(e) => handleEnvChange(key, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleSubmit}>
          {t("addTo")} {selectedApp}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
