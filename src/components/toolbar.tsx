import { useSettings } from "@/context/settingsContext";
import Search from "./search"
import { GoHome } from "react-icons/go";
import { useSearch } from "@/context/searchContext";

const Toolbar = () => {
  const { setView } = useSettings()
  const { setSelectedHistory } = useSearch()

  const handleSetGrid = () => {
    setView("grid")
    setSelectedHistory("")
  }

  return (
    <div className="flex items-center gap-2 w-auto">
      <GoHome onClick={handleSetGrid} className="text-2xl cursor-pointer text-white" />
      <Search />
    </div>
  )
}

export default Toolbar