import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface FormData {
  name: string;
  command: string;
  args: string;
  envs?: { key: string; value: string }[];
}

interface AppDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  handleSubmit: () => void;
}

export const AppDialog: React.FC<AppDialogProps> = ({
  open,
  setOpen,
  formData,
  setFormData,
  handleSubmit,
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    envIndex?: number,
  ) => {
    const { name, value } = e.target;

    if (envIndex !== undefined && formData.envs) {
      const newEnvs = [...formData.envs];
      newEnvs[envIndex] = {
        ...newEnvs[envIndex],
        value: value,
      };
      setFormData({ ...formData, envs: newEnvs });
    } else if (name === "args") {
      setFormData({ ...formData, args: value });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>填写应用信息</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Name"
            value={formData.name}
            disabled
          />
          <Input
            name="command"
            placeholder="Command"
            value={formData.command}
            disabled
          />
          <Input
            name="args"
            placeholder="Args"
            value={formData.args}
            onChange={handleChange}
          />
          <div>
            {formData.envs?.map((env, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  name="envKey"
                  placeholder="Env key"
                  value={env.key}
                  disabled
                />
                <Input
                  name="envValue"
                  placeholder="Env Value"
                  value={env.value}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
            ))}
          </div>
        </div>
        <Button onClick={handleSubmit}>提交</Button>
      </DialogContent>
    </Dialog>
  );
};
