import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Home, Download, Clock, Github } from "lucide-react";
import { open } from "@tauri-apps/plugin-shell";
import { AppList } from "./AppList";
import McpManage from "./McpManage";
import LangSelect from "./LangSelect";
import { PathSelector } from "./PathSelector";
import { AppSelector } from "./AppSelector";
import CommandChecker from "./CommandChecker";
import { Toaster } from "sonner";
import { ModeToggle } from "./mode-toggle";

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
  const appCategories = [
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
      id: "recently",
      name: t("categories.recentlyAdded"),
      icon: <Clock size={24} />,
      content: t("content.recentlyAdded"),
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState(appCategories[0]);

  // Render the content based on selected category
  const renderContent = () => {
    if (selectedCategory.id === "discover") {
      return (
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            {t("categories.discover")}
          </h1>
          {/* Hero banner */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 mb-8">
            <div className="p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">{t("featured.title")}</h2>
              <p className="text-lg mb-4">{t("featured.description")}</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-200">
                {t("featured.button")}
              </button>
            </div>
            <div className="absolute right-8 bottom-8 w-32 h-32 bg-white/20 rounded-xl backdrop-blur-sm"></div>
          </div>
          {/* Featured apps */}
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t("featuredApps")}</h2>
          <AppList selectedApp={selectedApp} selectedPath={selectedPath} />
        </div>
      );
    } else if (selectedCategory.id === "manage") {
      return (
        <div className="p-2">
          {" "}
          <McpManage selectedApp={selectedApp} selectedPath={selectedPath} />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{selectedCategory.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{selectedCategory.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="flex gap-2 cursor-pointer hover:text-blue-500 hover:underline">

          <Github />
          <a onClick={() => open("https://github.com/milisp/mcp-store")} className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {t("appStore")} 
          </a>
          </div>

          <nav>
            <ul>
              {appCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                      selectedCategory.id === category.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-3">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User section */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-lg">{t("username")[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t("username")}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">{t("viewProfile")}</p>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between pt-2 px-2">
          <span className="w-64">
            <AppSelector selectedApp={selectedApp} onChange={setSelectedApp} />
          </span>

          <PathSelector
            selectedApp={selectedApp}
            selectedPath={selectedPath}
            onChange={setSelectedPath}
          />
          <CommandChecker />
          <LangSelect />
        </div>

        {renderContent()}
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default AppStore;
