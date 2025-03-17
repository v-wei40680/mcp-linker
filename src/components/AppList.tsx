import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apps } from "./data";
import { useStore } from "@/lib/stores";

interface serverConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
}

interface FormState {
  args: string;
  env: Record<string, string>;
}

export function AppList() {
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [formStates, setFormStates] = useState<Record<number, FormState>>({});
  const selectedClient = useStore((state: any) => state.selectedClient);

  const initializeFormState = (app: typeof Apps[0]) => {
    if (!formStates[app.id]) {
      setFormStates(prev => ({
        ...prev,
        [app.id]: {
          args: app.args,
          env: app.env || {}
        }
      }));
    }
  };

  async function updateConfig(selectedServer: string, value: serverConfig) {
    try {
      await invoke("update_key", {
        client: selectedClient,
        user_path: "",
        key: selectedServer,
        value: value,
      });
    } catch (error) {}
  }

  const handleSubmit = async (appId: number) => {
    const app = Apps.find((a) => a.id === appId);
    const formState = formStates[appId];

    if (app && formState) {
      await updateConfig(app.name, {
        command: app.command,
        args: formState.args.split(" "),
        env: formState.env,
      });
      setOpenDialog(null);
    }
  };

  const handleArgsChange = (appId: number, value: string) => {
    setFormStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        args: value
      }
    }));
  };

  const handleEnvChange = (appId: number, key: string, value: string) => {
    setFormStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        env: {
          ...prev[appId].env,
          [key]: value
        }
      }
    }));
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
                  if (open) {
                    initializeFormState(app);
                  }
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
                      <Input value={app.command} readOnly />
                    </div>
                    <div className="grid gap-2">
                      <Label>args</Label>
                      <Input 
                        value={formStates[app.id]?.args || app.args}
                        onChange={(e) => handleArgsChange(app.id, e.target.value)}
                      />
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
                              value={formStates[app.id]?.env[key] || value}
                              onChange={(e) => handleEnvChange(app.id, key, e.target.value)}
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
