import { useState } from "react";

import useAppCategories from "./categories";

import Discovery from "@/views/discovery";
import McpManage from "@/views/manager";
import OtherPage from "@/views/other";
import LangSelect from "./LangSelect";
import { PathSelector } from "./PathSelector";
import { AppSelector } from "./client-selector";
import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar";
import { Category } from "@/types";
import { needspathClient } from "@/lib/data";
import { ServerList } from "@/components/server-list";
import mcpServers from "@/lib/servers.json"

interface ContentAreaProps {
  selectedCategory: Category;
  selectedApp: string;
  selectedPath: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  selectedCategory,
  selectedApp,
  selectedPath,
}) => {
  switch (selectedCategory.id) {
    case "discover":
      return <Discovery selectedApp={selectedApp} selectedPath={selectedPath} />;
    case "manage":
      return <McpManage selectedApp={selectedApp} selectedPath={selectedPath} />;
    case "recentlyAdded":
      return (
        <ServerList
          selectedApp={selectedApp}
          selectedPath={selectedPath}
          mcpServers={mcpServers.servers}
        />
      );
    default:
      return (
        <OtherPage
          selectedCategory={selectedCategory}
        ></OtherPage>);
  }
};

interface DashboardProps {
  selectedApp: string;
  setSelectedApp: (app: string) => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
}

// App component
const AppStore = ({
  selectedApp,
  setSelectedApp,
  selectedPath,
  setSelectedPath,
}: DashboardProps) => {
  // Define the app categories and their content
  const appCategories = useAppCategories();

  const [selectedCategory, setSelectedCategory] = useState(appCategories[0]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar
        appCategories={appCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between pt-2 px-2">
          <span className="w-64">
            <AppSelector selectedApp={selectedApp} onChange={setSelectedApp} />
          </span>

          {needspathClient.includes(selectedApp) && (
            <PathSelector
              selectedPath={selectedPath}
              onChange={setSelectedPath}
            />
          )}
          <LangSelect />
        </div>

        <div className="flex-1 overflow-auto">
          <ContentArea
            selectedCategory={selectedCategory}
            selectedApp={selectedApp}
            selectedPath={selectedPath}
          />
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default AppStore;
