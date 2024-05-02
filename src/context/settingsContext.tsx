import React, { createContext, useState, useContext } from 'react';

type Props = {
  children: React.ReactNode
}

type Views = "grid" | "list";

interface SettingsContextType {
  sidebar: boolean;
  setSidebar: (show: boolean) => void;
  view: string;
  setView: (view: Views) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  sidebar: true,
  setSidebar: () => {},
  view: "grid",
  setView: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<Props> = ({ children }: Props) => {
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [view, setView] = useState<Views>("grid");

  return (
    <SettingsContext.Provider value={{ sidebar, setSidebar, view, setView }}>
      {children}
    </SettingsContext.Provider>
  );
};