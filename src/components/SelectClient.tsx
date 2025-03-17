import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useClient } from "@/lib/ClientContext";

export default function SelectClient() {
  const { selectedClient, handleClientChange } = useClient();
  const clients: string[] = ["Claude", "cursor"];

  return (
    <Select value={selectedClient} onValueChange={handleClientChange}>
      <SelectTrigger className="w-full" id="client-select">
        <SelectValue placeholder="Select a client" />
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client} value={client}>
            {client}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
