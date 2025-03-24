import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import { PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const envSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const formSchema = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.string(),
  env: z.array(envSchema).optional(),
});

type ConfigType = {
  mcpServers: {
    [key: string]: {
      command: string;
      args: string[];
      env?: Record<string, string>;
    };
  };
};

interface ServerCardProps {
  serverKey: string;
  config: ConfigType["mcpServers"][string];
  onUpdate: (key: string, config: ConfigType["mcpServers"][string]) => void;
  onDelete: (key: string) => void;
}

export function ServerCard({
  serverKey,
  config,
  onUpdate,
  onDelete,
}: ServerCardProps) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const envArray = config.env
    ? Object.entries(config.env).map(([key, value]) => ({ key, value }))
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      command: config.command,
      args: config.args.join(" "),
      env: envArray,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "env",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedConfig = {
      command: values.command,
      args: values.args.split(" ").filter(Boolean),
      env: values.env?.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
    console.log(updatedConfig);
    onUpdate(serverKey, updatedConfig);
    setOpen(false);
  }

  const handleDeleteConfirm = () => {
    onDelete(serverKey);
    setDeleteDialogOpen(false);
  };

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{serverKey}</CardTitle>
        <div className="flex space-x-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <PenSquare className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit {serverKey}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="command"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Command</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="args"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arguments</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="space-separated args"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormLabel>Environment Variables</FormLabel>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`env.${index}.key`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Key" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`env.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Value" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    Save
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete {serverKey}?
              </p>
              <DialogFooter className="mt-4 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex flex-col">
            <span className="font-medium">Command:</span>
            <span className="text-muted-foreground break-words">
              {config.command}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface McpServerProps {
  selectedApp: string;
  selectedPath: string;
}

export default function McpManage({
  selectedApp,
  selectedPath,
}: McpServerProps) {
  const [config, setConfig] = useState<ConfigType>({
    mcpServers: {
      server1: {
        command: "uvx",
        args: ["mcp-server"],
        env: {
          Secret: "",
        },
      },
    },
  });

  useEffect(() => {
    if (!selectedApp || (selectedApp !== "claude" && !selectedPath)) {
      return;
    }

    loadConfig();
  }, [selectedApp, selectedPath]);

  async function loadConfig() {
    if (selectedApp === "claude" || selectedPath) {
      try {
        console.log("folder", selectedPath);
        const data = await invoke<ConfigType>("read_json_file", {
          appName: selectedApp,
          path: selectedPath || undefined,
        });
        console.log("data", data);

        if (data) {
          setConfig(data);
        }
        console.log("Config loaded successfully", data);
      } catch (error) {
        setConfig({ mcpServers: {} });
        console.error(`Error loading config: ${error}`);
      }
    } else {
      setConfig({ mcpServers: {} });
    }
  }

  const handleUpdate = async (
    key: string,
    updatedConfig: ConfigType["mcpServers"][string],
  ) => {
    try {
      await invoke("update_mcp_server", {
        appName: selectedApp,
        path: selectedPath || undefined,
        serverName: key,
        serverConfig: updatedConfig,
      });
      await loadConfig();
    } catch (error) {
      console.error(`Error update_key: ${error}`);
    }
  };

  async function deleteConfigKey(key: string) {
    try {
      await invoke("remove_mcp_server", {
        appName: selectedApp,
        path: selectedPath || undefined,
        serverName: key,
      });
      await loadConfig();
      console.log("Key deleted successfully");
    } catch (error) {
      console.error(`Error deleting key: ${error}`);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Object.entries(config.mcpServers).map(([key, serverConfig]) => (
        <ServerCard
          key={key}
          serverKey={key}
          config={serverConfig}
          onUpdate={handleUpdate}
          onDelete={deleteConfigKey}
        />
      ))}
    </div>
  );
}
