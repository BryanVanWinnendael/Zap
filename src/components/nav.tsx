import { appWindow } from "@tauri-apps/api/window";
import { FaMinus } from "react-icons/fa6";
import { FiMaximize2 } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { useSettings } from "@/context/settingsContext";
import { useSearch } from "@/context/searchContext";
import ThemeButton from "./themeButton";

const Nav = () => {
  const { setSidebar, sidebar, view } = useSettings()
  const { results, loading } = useSearch()
  const minimize = () => { appWindow.minimize(); }
  const toggleMaximize = () => { appWindow.toggleMaximize() }
  const close = () => { appWindow.close() }
  const totalItems = Object.keys(results)
    .map(key => results[key].length)
    .reduce((acc, curr) => acc + curr, 0);

  const toggleSidebar = () => {
    setSidebar(!sidebar)
  }

  return (
    <div data-tauri-drag-region className="w-full h-8 flex justify-between items-center fixed top-0 px-2">
      <div data-tauri-drag-region className="flex items-center h-full gap-2">
        <BsLayoutSidebarInset className="text-white cursor-pointer" onClick={toggleSidebar}/>
        <ThemeButton />
      </div>
      <div data-tauri-drag-region className="flex items-center justify-center text-white">
        {
          !loading && (
            view === "list" && totalItems === 0
              ? "No items found"
              : view === "list"
              ? `${totalItems} items`
              : ""
          )
        }
      </div>
      <div data-tauri-drag-region className="flex items-center gap-5">
        <FaMinus onClick={minimize} className="w-4 h-4 cursor-pointer hover:text-neutral-200 text-white duration-100"/>
        <FiMaximize2 onClick={toggleMaximize} className="w-4 h-4 cursor-pointer hover:text-neutral-200 text-white duration-100"/>
        <IoCloseSharp onClick={close} className="w-4 h-4 cursor-pointer hover:text-neutral-200 text-white duration-100"/>
      </div>
    </div>
  )
}

export default Nav