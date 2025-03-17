import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface ClientContextType {
  selectedClient: string;
  handleClientChange: (value: string) => void;
}

// Create context with default value as undefined
const ClientContext = createContext<ClientContextType | undefined>(undefined);

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [selectedClient, setSelectedClient] = useState<string>("claude");

  const handleClientChange = (value: string) => {
    setSelectedClient(value);
  };

  const value: ClientContextType = {
    selectedClient,
    handleClientChange,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}

// Custom hook with type checking
export function useClient(): ClientContextType {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}
