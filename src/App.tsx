// src/App.tsx
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";

import Layout from "./components/Layout";
import "./App.css";

function App() {
  const [selectedApp, setSelectedApp] = useState<string>("claude");
  const [selectedPath, setSelectedPath] = useState<string>("");

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <Layout
        selectedApp={selectedApp}
        setSelectedApp={setSelectedApp}
        selectedPath={selectedPath}
        setSelectedPath={setSelectedPath}
      />
    </ThemeProvider>
  );
}

export default App;
