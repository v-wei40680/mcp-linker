import { useTranslation } from "react-i18next";
import { ClientList } from "@/components/client-list";

interface Props {
  selectedApp: string;
  selectedPath: string;
}

export default function Discovery({ selectedApp, selectedPath }: Props) {
  const { t } = useTranslation();
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
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t("featuredApps")}
      </h2>
      <ClientList selectedApp={selectedApp} selectedPath={selectedPath} />
    </div>
  );
}
