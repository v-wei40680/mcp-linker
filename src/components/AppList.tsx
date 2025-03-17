import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apps } from "./data";
interface serverConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
}

export function AppList() {
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  async function updateConfig(selectedServer: string, value: serverConfig) {
    try {
      await invoke("update_key", {
        key: selectedServer,
        value: value,
      });
    } catch (error) {}
  }

  const handleSubmit = async (appId: number) => {
    const app = Apps.find((a) => a.id === appId);

    if (app) {
      await updateConfig(app.name, {
        command: app.command,
        args: app.args.split(" "),
        env: app.env ? app.env : {},
      });
      // 这里可以添加你的提交逻辑，例如 API 调用
      setOpenDialog(null); // 提交后关闭对话框
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Apps.map((app) => (
        <Card key={app.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </div>
              <Dialog
                open={openDialog === app.id}
                onOpenChange={(open) => {
                  setOpenDialog(open ? app.id : null);
                  if (!open) setFormData({});
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gray-200 text-blue-600 py-1 px-3 rounded text-sm font-medium">
                    Get
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{app.name} Configuration</DialogTitle>
                    <DialogDescription>
                      Configure the command args and environment variables
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Command</Label>
                      <Input value={app.command} disabled />
                    </div>
                    <div className="grid gap-2">
                      <Label>args</Label>
                      <Input value={app.args} />
                    </div>
                    {app.env && (
                      <div className="grid gap-2">
                        <h2>env</h2>
                        {Object.entries(app.env).map(([key, value]) => (
                          <div
                            key={key}
                            className="grid grid-cols-2 items-center gap-2"
                          >
                            <Label className="col-span-1">{key}</Label>
                            <Input
                              className="col-span-3"
                              defaultValue={value}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button onClick={() => handleSubmit(app.id)}>
                    Add server
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
