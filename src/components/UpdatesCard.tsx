import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const Apps = [
  {
    id: 1,
    name: "Sequential Thinking",
    description: "Thinking",
    command: "npx",
    args: "-y @modelcontextprotocol/server-sequential-thinking",
  },
  {
    id: 2,
    name: "Brave Search",
    description: "Brave",
    command: "npx",
    args: "-y @modelcontextprotocol/server-brave-search",
    env: {
      BRAVE_API_KEY: "token",
      Secret: "hi",
    },
  },
];

export function AppList() {
  const [openDialog, setOpenDialog] = useState<number | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Apps.map((app) => (
        <Card key={app.id}>
          <CardHeader>
            <CardTitle>{app.name}</CardTitle>
            <CardDescription>{app.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Command: {app.command}</p>
            <p>Args: {app.args}</p>
          </CardContent>
          <CardFooter>
            <Dialog
              open={openDialog === app.id}
              onOpenChange={(open) => setOpenDialog(open ? app.id : null)}
            >
              <DialogTrigger asChild>
                <Button>Get</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{app.name} Configuration</DialogTitle>
                  <DialogDescription>
                    Configure the command and environment variables
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Command</Label>
                    <Input value={`${app.command} ${app.args}`} readOnly />
                  </div>
                  {app.env && (
                    <div className="grid gap-2">
                      <Label>Environment Variables</Label>
                      {Object.entries(app.env).map(([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-4 items-center gap-4"
                        >
                          <Label className="col-span-1">{key}</Label>
                          <Input
                            value={value}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
