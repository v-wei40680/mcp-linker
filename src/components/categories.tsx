import { useTranslation } from "react-i18next";
import { Home, Download, Clock } from "lucide-react";
import { Category } from "@/types";

const useAppCategories = (): Category[] => {
  const { t } = useTranslation();
  return [
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
};

export default useAppCategories;
