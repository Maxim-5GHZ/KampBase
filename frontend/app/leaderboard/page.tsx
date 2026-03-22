// File: ./frontend/app/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import FilterPanel, { FilterCategory } from "../components/FilterPanel";
import LeaderboardRow from "./LeaderboardRow";
import { hrService } from "@/app/utils/hr-service";
import { authService } from "@/app/utils/auth-service";
import { LeaderboardEntry as ApiLeaderboardEntry } from "@/app/utils/types";

// Импорты для отрисовки дерева навыков
import { SkillTree } from "@/app/profile/_tree/SkillTree";
import { nodes as baseNodes } from "@/app/profile/_tree/data";
import { Node } from "@/app/profile/_tree/types";

/**
 * Логика "генератора" дерева:
 * Проверяем очки по каждому направлению и открываем соответствующие узлы,
 * чтобы дерево в модалке соответствовало цифрам в таблице.
 */
const generateStudentTree = (skills: Record<string, number> = {}): Node[] => {
  return baseNodes.map((node) => {
    let isOpen = false;

    // Корень всегда открыт
    if (node.id === "root") isOpen = true;

    // Ветка JAVA
    if (node.id.startsWith("java")) {
      const pts = skills["Java"] || 0;
      if (node.id === "java-basics" && pts > 0) isOpen = true;
      if (node.id === "java-exp" && pts > 1000) isOpen = true;
      if (node.id === "java-rep" && pts > 2500) isOpen = true;
    }

    // Ветка PYTHON
    if (node.id.startsWith("python")) {
      const pts = skills["Python"] || 0;
      if (node.id === "python-basics" && pts > 0) isOpen = true;
      if (node.id === "python-exp" && pts > 1000) isOpen = true;
      if (node.id === "python-rep" && pts > 2500) isOpen = true;
    }

    // Ветка JAVASCRIPT
    if (node.id.startsWith("js")) {
      const pts = skills["JavaScript"] || 0;
      if (node.id === "js-basics" && pts > 0) isOpen = true;
      if (node.id === "js-exp" && pts > 1000) isOpen = true;
      if (node.id === "js-rep" && pts > 2500) isOpen = true;
    }

    // Ветка SQL и ПРОЕКТИРОВАНИЕ БД
    if (node.id.startsWith("sql") || node.id.startsWith("db")) {
      const pts = skills["SQL"] || 0;
      if (node.id === "sql-basics" && pts > 0) isOpen = true;
      if (node.id === "sql-exp" && pts > 1200) isOpen = true;
      if (node.id === "sql-rep" && pts > 2800) isOpen = true;
      if (node.id === "db-design" && pts > 1800) isOpen = true;
      if (node.id === "db-master" && pts > 3500) isOpen = true;
    }

    return { ...node, isOpen };
  });
};

const LeaderboardPage = () => {
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    {
      name: "Университет",
      values: ["КФ МГТУ им. Н.Э. Баумана", "МГУ", "НИУ ВШЭ", "МФТИ", "СПбГУ"],
      selected: [],
    },
  ]);

  const [sortBySkill, setSortBySkill] = useState<string>("");
  const [entries, setEntries] = useState<ApiLeaderboardEntry[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Состояние для открытия модального окна с деревом конкретного студента
  const [selectedStudentTree, setSelectedStudentTree] = useState<{
    name: string;
    totalRate: number;
    nodes: Node[];
  } | null>(null);

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
  }, [sortBySkill]);

  const handleFilterChange = (newCategories: FilterCategory[]) => {
    setFilterCategories(newCategories);
  };

  const handleToggleFavorite = async (userId: number) => {
    const currentUser = authService.getCurrentUser();
    const isHr = currentUser?.roles.includes("ROLE_HR") ?? false;

    if (!isHr) {
      alert("Только HR могут управлять списком избранного.");
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

  // Метод для открытия модалки с деревом
  const handleViewTree = (entry: ApiLeaderboardEntry) => {
    const customNodes = generateStudentTree(entry.skills || {});
    setSelectedStudentTree({
      name: `${entry.name} ${entry.lastName}`,
      totalRate: entry.totalRate,
      nodes: customNodes,
    });
  };

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
    <>
      <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen gap-6 pt-8 pb-12">
        <div className="w-full lg:w-1/5 mb-4 lg:mb-0">
          <FilterPanel
            categories={filterCategories}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-custom-main">
              Топ студентов
            </h1>
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
              <div className="w-48 text-center shrink-0 text-right pr-4">
                Действие
              </div>
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
                    onViewTree={() => handleViewTree(entry)} // Передаем функцию открытия дерева
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

      {/* МОДАЛЬНОЕ ОКНО С КАРТОЙ НАВЫКОВ (Drag-to-Scroll) */}
      {selectedStudentTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 bg-black/70 backdrop-blur-sm">
          <div className="bg-custom-bg-main border border-custom-secondary/20 rounded-[2.5rem] w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
            {/* Шапка модалки */}
            <div className="flex justify-between items-center p-6 sm:px-10 border-b border-custom-secondary/20 bg-custom-bg-secondary/50 backdrop-blur-md z-20 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-custom-main">
                  Карта навыков:{" "}
                  <span className="text-custom-accent">
                    {selectedStudentTree.name}
                  </span>
                </h2>
                <div className="flex gap-4 mt-1">
                  <p className="text-custom-secondary text-sm">
                    Всего: {selectedStudentTree.totalRate} XP
                  </p>
                  <p className="text-custom-accent text-sm font-bold">
                    Уровень:{" "}
                    {Math.floor(selectedStudentTree.totalRate / 1000) + 1}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentTree(null)}
                className="btn btn-ghost btn-circle text-custom-secondary hover:text-custom-main hover:bg-custom-bg-main transition-all"
              >
                <X size={28} />
              </button>
            </div>

            {/* Область с деревом (теперь со скроллом и перетаскиванием) */}
            <div className="flex-1 bg-custom-bg-main relative overflow-hidden">
              <SkillTree
                nodes={selectedStudentTree.nodes}
                skillPoints={selectedStudentTree.totalRate}
                selectedId={null}
              />

              {/* Подсказка-оверлей */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-custom-bg-secondary/90 backdrop-blur border border-custom-secondary/20 rounded-full text-custom-secondary text-xs z-20 pointer-events-none shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-custom-accent animate-pulse"></span>
                Зажмите левую кнопку мыши, чтобы перемещаться по карте
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderboardPage;
