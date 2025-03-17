// src/App.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
  };

  return (
    <div className="app-container">
      <div className="language-switcher">
        <button 
          onClick={() => changeLanguage("en")} 
          className={currentLang.startsWith("en") ? "active" : ""}
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage("zh")} 
          className={currentLang.startsWith("zh") ? "active" : ""}
        >
          中文
        </button>
        <button 
          onClick={() => changeLanguage("es")} 
          className={currentLang.startsWith("es") ? "active" : ""}
        >
          Español
        </button>
      </div>
      <Layout />
    </div>
  );
}

export default App;
