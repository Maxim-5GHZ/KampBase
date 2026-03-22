"use client";

import { useState, useEffect } from "react";
import FilterPanel, { FilterCategory } from "../components/FilterPanel";
import LeaderboardRow from "./LeaderboardRow";
import { hrService } from "@/app/utils/hr-service";
import { authService } from "@/app/utils/auth-service";
import { LeaderboardEntry as ApiLeaderboardEntry } from "@/app/utils/types";

const LeaderboardPage = () => {
  // Фильтр для боковой панели (используем ВУЗы из нашего мока)
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    {
      name: "Университет",
      values: ["КФ МГТУ им. Н.Э. Баумана", "МГУ", "НИУ ВШЭ", "МФТИ", "СПбГУ"],
      selected: [],
    },
  ]);

  const [sortBySkill, setSortBySkill] = useState<string>(""); // Состояние дропдауна сортировки
  const [entries, setEntries] = useState<ApiLeaderboardEntry[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leaderboardData, favoritesData] = await Promise.all([
          hrService.getLeaderboard(sortBySkill || undefined),
          hrService.getFavorites().catch(() => []),
        ]);
        setEntries(leaderboardData);
        setFavorites(new Set(favoritesData.map((f) => f.userId)));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortBySkill]); // Перезапрашиваем данные при смене навыка сортировки

  const handleFilterChange = (newCategories: FilterCategory[]) => {
    setFilterCategories(newCategories);
  };

  const handleToggleFavorite = async (userId: number) => {
    const currentUser = authService.getCurrentUser();
    const isHr = currentUser?.roles.includes("ROLE_HR") ?? false;

    if (!isHr) {
      alert("Только HR могут управлять избранным.");
      return;
    }

    const isFavorite = favorites.has(userId);
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
  };

  // Фильтруем данные по галочкам из левой панели (ВУЗ)
  const displayEntries = entries
    .map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      university: entry.company || "Не указан",
    }))
    .filter((entry) => {
      const universityCategory = filterCategories.find(
        (cat) => cat.name === "Университет",
      );
      if (!universityCategory || universityCategory.selected.length === 0)
        return true;
      return universityCategory.selected.includes(entry.university);
    });

  return (
    <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen gap-6 pt-8 pb-12">
      <div className="w-full lg:w-1/5 mb-4 lg:mb-0">
        <FilterPanel
          categories={filterCategories}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="flex-1">
        {/* Хедер с селектом для сортировки по навыкам */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-custom-main">Топ студентов</h1>
          <select
            className="select select-bordered bg-custom-bg-secondary text-custom-main border-custom-secondary/30"
            value={sortBySkill}
            onChange={(e) => setSortBySkill(e.target.value)}
          >
            <option value="">🏆 Сортировка: Общий рейтинг</option>
            <option value="Java">☕ Java</option>
            <option value="Python">🐍 Python</option>
            <option value="JavaScript">🟨 JavaScript</option>
            <option value="SQL">💾 SQL</option>
          </select>
        </div>

        <div className="bg-custom-bg-secondary rounded-2xl p-4 shadow-lg overflow-x-auto min-h-[500px] relative">
          {/* Спиннер загрузки поверх таблицы при смене фильтра */}
          {loading && (
            <div className="absolute inset-0 bg-custom-bg-secondary/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <span className="loading loading-spinner loading-lg text-custom-accent"></span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 p-3 border-b border-custom-secondary/30 text-custom-secondary text-sm font-medium min-w-[750px]">
            <div className="w-8 sm:w-10 text-center shrink-0">№</div>
            <div className="flex-1 min-w-[200px]">Студент</div>
            <div className="w-24 text-center shrink-0">Всего XP</div>
            <div className="w-32 text-center shrink-0">
              {sortBySkill ? `Очки: ${sortBySkill}` : "Топ навык"}
            </div>
            <div className="w-32 text-center shrink-0">ВУЗ</div>
            <div className="w-36 text-center shrink-0">Действие</div>
          </div>

          <div className="divide-y divide-custom-secondary/10 min-w-[750px]">
            {displayEntries.map((entry) => (
              <div key={entry.userId} className="my-4">
                <LeaderboardRow
                  rank={entry.rank}
                  name={`${entry.name} ${entry.lastName}`}
                  level={entry.totalRate}
                  topSkillName={entry.topSkillName}
                  topSkillPoints={entry.topSkillPoints}
                  requestedSkillPoints={entry.skillPoints}
                  university={entry.university}
                  isFavorite={favorites.has(entry.userId)}
                  onToggleFavorite={() => handleToggleFavorite(entry.userId)}
                  email={entry.username || "no-email@example.com"}
                />
              </div>
            ))}
          </div>

          {displayEntries.length === 0 && !loading && (
            <div className="p-8 text-center text-custom-secondary">
              Студентов с такими параметрами не найдено
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
