import { useState } from 'react';
import { open } from "@tauri-apps/plugin-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PathSelectorProps {
  selectedApp: string;
  selectedPath: string;
  onChange: (path: string) => void;
}

export function PathSelector({ selectedApp, selectedPath, onChange }: PathSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBrowse = async () => {
    try {
      setIsLoading(true);
      const selectedPath = await open({
        directory: true,
        multiple: false,
      });

      if (selectedPath) {
        onChange(selectedPath);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hide for Claude which uses a fixed path
  if (selectedApp === 'claude') {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex space-x-2">
        <Input
          value={selectedPath}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="Select a directory..."
          readOnly
        />
        <Button
          onClick={handleBrowse}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Browse'}
        </Button>
      </div>
    </div>
  );
}