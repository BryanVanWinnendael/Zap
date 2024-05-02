import { invoke } from "@tauri-apps/api/tauri"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const addToRecent = async (name: string, type: string) => {
  const recents = localStorage.getItem("recents")
  if (recents) {
    const parsed = JSON.parse(recents)
    const found = parsed.find((item: {name: string, type: string}) => item.name === name)
    if (found) {
      return
    }

    if (parsed.length >= 10) {
      parsed.shift()
    }
    parsed.push({name, type})
    localStorage.setItem("recents", JSON.stringify(parsed))
  } else {
    localStorage.setItem("recents", JSON.stringify([{name, type}]))
  }
}

export const handleZap = async (name: string, type: string) => {
  if (type === "File") {
    const path = name.split("\\")
    path.pop()
    const newPath = path.join("\\")
    await invoke("open", {path: newPath})
    return
  }
  await invoke("open", {path: name})
  addToRecent(name, type)
}