// frontend/app/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, BookOpen, ClipboardList, Trophy, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Список роутов, где навбар НЕ должен отображаться
  const publicRoutes = ["/login", "/registration", "/forgot-password"];

  // 1. Ждем монтирования компонента в браузере
  useEffect(() => {
    setMounted(true);

    // Инициализация темы
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const shouldBeDark =
      storedTheme === "dark" || (!storedTheme && systemPrefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 2. Если мы еще на сервере (hydration), ничего не рендерим, чтобы избежать Error #300
  if (!mounted) return null;

  // Если это страница логина или регистрации - скрываем навбар
  if (publicRoutes.includes(pathname)) return null;

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
    <nav className="fixed top-0 left-0 w-full h-12 bg-custom-bg-secondary backdrop-blur-sm bg-opacity-90 z-50 flex items-center justify-center gap-3 sm:gap-6 px-2 sm:px-4 shadow-sm">
      {/* Декоративная линия сверху */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-custom-accent to-transparent" />

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

      {/* Переключатель темы */}
      <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="cursor-pointer p-1.5 rounded-full hover:bg-custom-secondary/20 transition-all duration-300 focus:outline-none"
          aria-label="Переключить тему"
        >
          {isDark ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon
              size={20}
              className="text-custom-secondary hover:text-custom-main"
            />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
