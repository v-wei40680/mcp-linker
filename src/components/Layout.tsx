import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Home, Compass, Grid3X3, Award, Download, Clock } from "lucide-react";
import SelectClient from "./SelectClient";
import { AppList } from "./AppList";
import McpManage from "./McpManage";
import LangSelect from "./LangSelect";
import FolderSelect from "./FolderSelect";
import { useStore } from "@/lib/stores";
import { Input } from "./ui/input";

// App component
const AppStore = () => {
  const { t } = useTranslation();
  const selectedFolder = useStore((state) => state.selectedFolder);
  const selectedClient = useStore((state) => state.selectedClient);

  // Define the app categories and their content
  const appCategories = [
    {
      id: "discover",
      name: t("categories.discover"),
      icon: <Home size={24} />,
      content: t("content.discover"),
    },
    {
      id: "arcade",
      name: t("categories.arcade"),
      icon: <Grid3X3 size={24} />,
      content: t("content.arcade"),
    },
    {
      id: "create",
      name: t("categories.create"),
      icon: <Compass size={24} />,
      content: t("content.create"),
    },
    {
      id: "work",
      name: t("categories.work"),
      icon: <Award size={24} />,
      content: t("content.work"),
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
          <h1 className="text-3xl font-bold mb-8">
            {t("categories.discover")}
          </h1>

          {/* Hero banner */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 mb-8">
            <div className="p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">{t("featured.title")}</h2>
              <p className="text-lg mb-4">{t("featured.description")}</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium">
                {t("featured.button")}
              </button>
            </div>
            <div className="absolute right-8 bottom-8 w-32 h-32 bg-white/20 rounded-xl backdrop-blur-sm"></div>
          </div>

          {/* Featured apps */}
          <h2 className="text-xl font-semibold mb-4">{t("featuredApps")}</h2>
          <AppList />
        </div>
      );
    } else if (selectedCategory.id === "manage") {
      return (
        <div className="p-2">
          {" "}
          <McpManage />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{selectedCategory.name}</h2>
          <p className="text-gray-600">{selectedCategory.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-6">
            {t("appStore")}
          </h1>

          <nav>
            <ul>
              {appCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                      selectedCategory.id === category.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-200"
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
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 mr-2"></div>
            <div>
              <p className="font-medium">{t("username")}</p>
              <p className="text-xs text-gray-500">{t("viewProfile")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between pt-2 px-2">
          {selectedClient && selectedClient !== "claude" && <FolderSelect />}
          <span className="w-64">
            <SelectClient />
          </span>

          {selectedClient && selectedClient !== "claude" && (
            <Input value={selectedFolder || ""} readOnly />
          )}
          <LangSelect />
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default AppStore;
