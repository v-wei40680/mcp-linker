import { useState, forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useStore } from "@/lib/stores";

const SelectClient = forwardRef<HTMLButtonElement>((props, ref) => {
  const [client, setClient] = useState("claude");
  const setSelectedClient = useStore((state: any) => state.setSelectedClient);
  const mcpClients: string[] = ["claude", "cursor"];

  function handleClientChange(client: string) {
    setClient(client);
    setSelectedClient(client);
    console.log(client);
  }

  return (
    <Select value={client} onValueChange={handleClientChange}>
      <SelectTrigger 
        ref={ref}
        className="w-full capitalize" 
        id="client-select"
        aria-label="Select AI client"
      >
        <SelectValue placeholder="Select a client" />
      </SelectTrigger>
      <SelectContent>
        {mcpClients.map((mcpClient) => (
          <SelectItem key={mcpClient} value={mcpClient}>
            {mcpClient}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

SelectClient.displayName = "SelectClient";

export default SelectClient;
