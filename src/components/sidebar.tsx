import HistorySearches from "./historySearches"
import Toolbar from "./toolbar"

const Sidebar = () => {
  return (
    <div className="bg-transparent h-full w-full">
      <Toolbar />
      <HistorySearches />
    </div>
  )
}

export default Sidebar