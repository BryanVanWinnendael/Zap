import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { SearchProvider } from "./context/searchContext";
import { SettingsProvider } from "./context/settingsContext";
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { DisksProvider } from "./context/diskContext";
import { ThemeProvider } from "./context/themeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <SearchProvider>
          <DisksProvider>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </DisksProvider>
        </SearchProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
