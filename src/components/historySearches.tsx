import { useSearch } from "@/context/searchContext"
import { useSettings } from "@/context/settingsContext"
import { Result } from "@/types"
import { IoMdClose } from "react-icons/io";

const HistorySearches = () => {
  const { history, setResults, setSearchQuery, setSelectedHistory, selectedHistory, setHistory } = useSearch()
  const { setView } = useSettings()

  const handleChangeView = (query: string, result: Result) => {
    setSearchQuery(query)
    setResults(result)
    setView("list")
    setSelectedHistory(query)
  }

  const handleDelete = (query: string) => {
    const newHistory = {...history}
    delete newHistory[query]
    setResults({})
    setHistory(newHistory)
    setSearchQuery("")
    setView("grid")
    setSelectedHistory("")
  }

  return (
    <div className="mt-5 flex flex-col gap-2">
      {
        history && Object.keys(history).map((query) => {
          if (!query) return
          return (
            <div 
              onClick={() => {
              handleChangeView(query, history[query])
              }} key={query} 
              className={`group flex justify-between items-center p-1 border bg-white hover:border-opacity-5 hover:bg-opacity-5 ${query === selectedHistory ? "bg-opacity-5 border-opacity-5" : "border-opacity-0  bg-opacity-0"} text-white backdrop-filter backdrop-blur-lg border-white rounded-md cursor-pointer w-full max-w-full flex gap-5`}>
              <p className="text-white overflow-hidden whitespace-nowrap text-ellipsis">{query}</p>
              <div className="hidden group-hover:flex" onClick={(event) => event.stopPropagation()}>
                <IoMdClose className="w-4 h-4" onClick={() => handleDelete(query)}/>
              </div>

            </div>
          )
        })
      }
    </div>
  )
}

export default HistorySearches