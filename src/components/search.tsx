import { Input } from "@/components/ui/input"
import { useSearch } from "@/context/searchContext";
import { useSettings } from "@/context/settingsContext";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";

const Search = () => {
  const { setView } = useSettings();
  const {setLoading, loading, setResults, results, setHistory, history, setSearchQuery, searchQuery, setSelectedHistory } = useSearch();

  async function search() {
    setLoading(true);
    await invoke("search", {query: searchQuery}).then((response) => {
      const json = JSON.parse(response as string);
      for (const disk in json) {
        setResults({
          ...results,
          [disk]: json[disk],
        });
      }
      setLoading(false);
    });

    setSelectedHistory(searchQuery)
  }

  useEffect(() => {
    setHistory({
      ...history,
      [searchQuery]: results
    })
  },[results])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setView("list");
      search()
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <Input 
        disabled={loading}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchQuery(e.currentTarget.value)} type="text" placeholder="Search" 
        className="h-7 w-full bg-opacity-10 bg-white dark:bg-dark text-white backdrop-filter backdrop-blur-lg border border-opacity-5 border-white focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
    </div>
  )
}

export default Search