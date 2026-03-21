"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, BookOpen, ClipboardList, Trophy, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const publicRoutes = ["/login", "/registration", "/forgot-password"];
  if (publicRoutes.includes(pathname)) return null;
  // Применить тему
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Инициализация темы при загрузке
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
      applyTheme(true);
    } else if (storedTheme === "light") {
      setIsDark(false);
      applyTheme(false);
    } else {
      // Нет сохранённой темы – используем системные настройки
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(systemPrefersDark);
      applyTheme(systemPrefersDark);
    }

    // Следим за изменением системной темы, если пользователь не выбрал вручную
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        // Нет сохранённого выбора – следуем за системой
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Переключение темы по кнопке
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      applyTheme(newTheme);
      return newTheme;
    });
  };

  const menuItems = [
    { name: "Профиль", path: "/profile", icon: User },
    { name: "Wiki", path: "/wiki", icon: BookOpen },
    { name: "Задания", path: "/tasks", icon: ClipboardList },
    { name: "Топ студентов", path: "/leaderboard", icon: Trophy },
  ];

  const handleClick = (name: string) => {
    setClickedItem(name);
    setTimeout(() => setClickedItem(null), 200);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-12 custom-bg-secondary backdrop-blur-sm bg-opacity-90 z-50 flex items-center justify-center gap-3 sm:gap-6 px-2 sm:px-4">
      {/* Декоративная линия */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-linear-to-r from-transparent via-custom-accent to-transparent" />

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        const isClicked = clickedItem === item.name;

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => handleClick(item.name)}
            className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md transition-all duration-300 group"
          >
            <Icon
              size={20}
              className={`
                                transition-all duration-300
                                ${isActive ? "text-custom-accent" : "text-custom-secondary group-hover:text-custom-main group-hover:scale-110"}
                                ${isClicked ? "scale-125 text-custom-accent" : ""}
                            `}
            />
            <span
              className={`
                                hidden sm:inline-block text-sm transition-all duration-300
                                ${isActive ? "text-custom-main" : "text-custom-secondary group-hover:text-custom-main"}
                                ${isClicked ? "scale-105" : ""}
                            `}
            >
              {item.name}
            </span>
            {isActive && (
              <span className="hidden sm:inline-block ml-1 w-1.5 h-1.5 rounded-full bg-custom-accent animate-pulse" />
            )}
            {isClicked && (
              <span className="absolute inset-0 rounded-md bg-custom-accent opacity-20 animate-ping" />
            )}
          </Link>
        );
      })}

      {/* Блок переключения темы */}
      <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="cursor-pointer p-1 rounded-md transition-all duration-300 hover:scale-110 focus:outline-none"
          aria-label="Переключить тему"
        >
          {isDark ? (
            <Sun
              size={22}
              className="text-custom-secondary hover:text-custom-main"
            />
          ) : (
            <Moon
              size={22}
              className="text-custom-secondary hover:text-custom-main"
            />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
