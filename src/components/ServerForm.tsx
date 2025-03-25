import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConfigType } from "@/types/config";

const envSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const formSchema = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.string(),
  env: z.array(envSchema).optional(),
});

interface ServerFormProps {
  config: ConfigType["mcpServers"][string];
  onSubmit: (values: ConfigType["mcpServers"][string]) => void;
}

export function ServerForm({ config, onSubmit }: ServerFormProps) {
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

  function handleSubmit(values: z.infer<typeof formSchema>) {
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
    onSubmit(updatedConfig);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                <Input {...field} placeholder="space-separated args" />
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
  );
}