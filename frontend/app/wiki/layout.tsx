"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowUpDown, Filter, RefreshCw } from "lucide-react";
import styles from "./wiki.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-10">{children}</main>
    </>
  );
}

function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      router.push(`/wiki?q=${encodeURIComponent(e.target.value)}`);
    } else {
      router.push(`/wiki`);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <header className="backdrop-blur-2xl fixed w-full bg-custom-bg-secondary px-4 sm:px-6 md:px-16 py-2 flex items-center gap-2 sm:gap-4 md:gap-8 lg:gap-16 shadow-2xs z-40">
      <a
        href="/wiki"
        className={`${styles.logoLink} text-custom-main font-bold text-xl sm:text-2xl whitespace-nowrap`}
      >
        <span className="sm:hidden">Wiki</span>
        <span className={`${styles.desktopText} hidden sm:inline`}>
          СтудБаза Wiki
        </span>
      </a>

      <div className="flex-1 flex items-center bg-custom-secondary rounded-search overflow-hidden">
        <div className="pl-3 text-custom-main">
          <Search className="hidden sm:inline" size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Как поднять докер..."
          className="flex-1 bg-transparent px-2 py-2 text-custom-main outline-none placeholder:text-custom-placeholder min-w-0"
        />
        <button className="btn btn-primary font-normal h-auto min-h-0 min-w-12 sm:min-w-12 md:min-w-24 py-2 px-2 sm:px-4 rounded-button shrink-0 flex items-center justify-center gap-1">
          <Search size={18} className="sm:hidden" />
          <span className="hidden sm:inline">Поиск</span>
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-custom-main">
        <button className="hover:text-custom-main/70 transition-colors hover:cursor-pointer">
          <ArrowUpDown size={20} />
        </button>
        <button className="hover:text-custom-main/70 transition-colors hover:cursor-pointer">
          <Filter size={20} />
        </button>
        <Link
          href="/wiki"
          onClick={handleRefresh}
          className="hover:text-custom-main/70 transition-colors hover:cursor-pointer"
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </Link>
      </div>
    </header>
  );
}
