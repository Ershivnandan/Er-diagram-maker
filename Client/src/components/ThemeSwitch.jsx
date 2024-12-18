import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";


const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded text-black text-2xl dark:text-white"
      >
        {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
      </button>
    </>
  );
};

export default ThemeSwitch;
