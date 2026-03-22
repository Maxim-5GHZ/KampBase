"use client";

import { useState, useEffect } from "react";
import FilterPanel, { FilterCategory } from "../components/FilterPanel";
import LeaderboardRow from "./LeaderboardRow";
import { hrService } from "@/app/utils/hr-service";
import { authService } from "@/app/utils/auth-service";
import { LeaderboardEntry as ApiLeaderboardEntry } from "@/app/utils/types";

type DisplayEntry = {
  userId: number;
  username: string;
  rank: number;
  name: string;
  level: number;
  completedTasks: number;
  university: string;
};

const LeaderboardPage = () => {
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    {
      name: "Университет",
      values: ["КФ МГТУ им. Н.Э. Баумана", "МГУ", "НИУ ВШЭ"],
      selected: [],
    },
  ]);

  const [entries, setEntries] = useState<ApiLeaderboardEntry[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leaderboardData, favoritesData] = await Promise.all([
          hrService.getLeaderboard(),
          hrService.getFavorites().catch(() => []),
        ]);
        setEntries(leaderboardData);
        setFavorites(new Set(favoritesData.map((f) => f.userId)));
        setError(null);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (newCategories: FilterCategory[]) => {
    setFilterCategories(newCategories);
  };

  const getUniversityForUser = (id: number) => {
    if (id % 3 === 0) return "МГУ";
    if (id % 5 === 0) return "НИУ ВШЭ";
    return "КФ МГТУ им. Н.Э. Баумана";
  };

  const displayEntries: DisplayEntry[] = entries
    .map((entry, idx) => ({
      userId: entry.userId,
      username: entry.username || "no-email@example.com",
      rank: idx + 1,
      name: `${entry.name} ${entry.lastName}`,
      level: entry.totalRate,
      completedTasks: Math.floor(entry.totalRate / 300) + 1,
      university: getUniversityForUser(entry.userId),
    }))
    .filter((entry) => {
      const universityCategory = filterCategories.find(
        (cat) => cat.name === "Университет",
      );
      if (!universityCategory || universityCategory.selected.length === 0)
        return true;
      return universityCategory.selected.includes(entry.university);
    });

  const handleToggleFavorite = async (userId: number) => {
    const currentUser = authService.getCurrentUser();
    const isHr = currentUser?.roles.includes("ROLE_HR") ?? false;

    if (!isHr) {
      alert("Только HR могут управлять избранным.");
      return;
    }

    const isFavorite = favorites.has(userId);
    try {
      if (isFavorite) {
        await hrService.removeFavorite(userId);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await hrService.addFavorite(userId);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.add(userId);
          return newSet;
        });
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="mx-4 sm:mx-8 lg:mx-16 flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen gap-6 pt-8 pb-12">
      <div className="w-full lg:w-1/5 mb-4 lg:mb-0">
        <FilterPanel
          categories={filterCategories}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="flex-1">
        <div className="bg-custom-bg-secondary rounded-2xl p-4 shadow-lg overflow-x-auto">
          <div className="flex flex-wrap items-center gap-3 p-3 border-b border-custom-secondary/30 text-custom-secondary text-sm font-medium min-w-[700px]">
            <div className="w-8 sm:w-10 text-center">№</div>
            <div className="flex-1 min-w-35">Студент</div>
            <div className="w-20 text-center">Очки</div>
            <div className="w-24 text-center">Решено</div>
            <div className="flex-1 min-w-30">ВУЗ</div>
            <div className="w-36 text-center">Действие</div>
          </div>

          <div className="divide-y divide-custom-secondary/10 min-w-[700px]">
            {displayEntries.map((entry) => (
              <div key={entry.userId} className="my-4">
                <LeaderboardRow
                  rank={entry.rank}
                  name={entry.name}
                  level={entry.level}
                  completedTasks={entry.completedTasks}
                  university={entry.university}
                  isFavorite={favorites.has(entry.userId)}
                  onToggleFavorite={() => handleToggleFavorite(entry.userId)}
                  email={entry.username}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
