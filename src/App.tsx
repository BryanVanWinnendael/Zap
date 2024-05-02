import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import DiskGrid from "./components/diskGrid";
import ResultList from "./components/resultList";
import { useSearch } from "./context/searchContext";
import Nav from "./components/nav";
import Sidebar from "./components/sidebar";
import { useSettings } from "./context/settingsContext";

function App() {
  const { sidebar, view } = useSettings();
  const { setLoading } = useSearch();
  
 
  useEffect(() => {
    async function init() {
      await appWindow.setDecorations(false).then((res) => {
        console.log(res);
      })
      await invoke("initialize_file_explorer").then(() => {
        setLoading(false);
      });
    }

    init();
  }, []);

  return (
    <div className="w-screen h-screen flex bg-background dark:bg-background">
      <Nav />
      
      <div className="w-full h-full px-2 pt-4 pb-7 mt-5">
        <ResizablePanelGroup direction="horizontal">
        
          <ResizablePanel minSize={15} defaultSize={20} className={`${sidebar ? "" : "!flex-[0]"}`}>
            {sidebar && <Sidebar />}
          </ResizablePanel>
          <div className="flex h-full items-center group py-5 cursor-ew-resize">
            { sidebar && <ResizableHandle className="m-1 duration-200 h-5 group-hover:h-full rounded-md"/> }
          </div>
      
          <ResizablePanel>
            <div className="w-full h-full bg-white dark:bg-dark rounded-sm p-4">
              <div className="h-full w-full">
                {
                  view === "grid" ? <DiskGrid />
                  : <ResultList />
                }
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default App;
