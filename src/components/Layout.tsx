import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Home, Download, Clock } from "lucide-react";

import Discovery from "@/views/discovery";
import McpManage from "./McpManage";
import LangSelect from "./LangSelect";
import { PathSelector } from "./PathSelector";
import { AppSelector } from "./client-selector";
import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar";
import { Category } from "@/types";
import { needspathClient } from "@/lib/data";

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
  const { t } = useTranslation();

  // Define the app categories and their content
  const appCategories: Category[] = [
    {
      id: "discover",
      name: t("categories.discover"),
      icon: <Home size={24} />,
      content: t("content.discover"),
    },
    {
      id: "manage",
      name: t("categories.manage"),
      icon: <Download size={24} />,
      content: t("content.manage"),
    },
    {
      id: "recentlyAdded",
      name: t("categories.recentlyAdded"),
      icon: <Clock size={24} />,
      content: t("content.recentlyAdded"),
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState(appCategories[0]);

  // Render the content based on selected category
  const renderContent = () => {
    if (selectedCategory.id === "discover") {
      return <Discovery selectedApp={selectedApp} selectedPath={selectedPath} />;
    } else if (selectedCategory.id === "manage") {
      return <McpManage selectedApp={selectedApp} selectedPath={selectedPath} />;
    }
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {selectedCategory.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory.content}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar
        appCategories={appCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between pt-2 px-2">
          <span className="w-64">
            <AppSelector selectedApp={selectedApp} onChange={setSelectedApp} />
          </span>

          {needspathClient.includes(selectedApp) &&
          <PathSelector
            selectedPath={selectedPath}
            onChange={setSelectedPath}
          />}
          <LangSelect />
        </div>

        {renderContent()}
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default AppStore;
