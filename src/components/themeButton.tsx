import { useTheme } from "@/context/themeContext";
import { MdOutlineWbSunny } from "react-icons/md";
import { LuMoon } from "react-icons/lu";

const ThemeButton = () => {
  const { setTheme, theme } = useTheme()
  
  return (
    <div className="cursor-pointer" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <LuMoon className="text-white" /> : <MdOutlineWbSunny className="text-white" />}
    </div>
  )
}

export default ThemeButton