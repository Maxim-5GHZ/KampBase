"use client";

import { useState, useEffect } from "react";
import FilterPanel, { FilterCategory } from "../components/FilterPanel";
import LeaderboardRow from "./LeaderboardRow";
import { hrService } from "@/app/utils/hr-service";
import { authService } from "@/app/utils/auth-service";
import { LeaderboardEntry as ApiLeaderboardEntry } from "@/app/utils/types";

// Тип для отображения в таблице
type DisplayEntry = {
    userId: number;
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
            values: ["КФ МГТУ им. Н.Э. Баумана"],
            selected: [],
        },
        // Фильтр по навыку убран, т.к. в реальных данных его нет
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
                    hrService.getFavorites().catch(() => []), // fallback to empty array on error
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

    // Фильтрация записей
    const filteredEntries = entries.filter((entry) => {
        const universityCategory = filterCategories.find(
            (cat) => cat.name === "Университет"
        );
        const universityMatch =
            !universityCategory || universityCategory.selected.length === 0
                ? true
                : universityCategory.selected.includes("КФ МГТУ им. Н.Э. Баумана");
        return universityMatch;
    });

    // Преобразование в формат для таблицы с добавлением ранга
    const displayEntries: DisplayEntry[] = filteredEntries.map((entry, idx) => ({
        userId: entry.userId,
        rank: idx + 1,
        name: `${entry.name} ${entry.lastName}`,
        level: entry.totalRate,
        completedTasks: 0,
        university: "КФ МГТУ им. Н.Э. Баумана",
    }));

    const handleToggleFavorite = async (userId: number) => {
        const currentUser = authService.getCurrentUser();
        const isHr = currentUser?.roles.includes("ROLE_HR") ?? false;

        if (!isHr) {
            alert("Только HR могут управлять избранным");
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
                alert("Студент удалён из избранного");
            } else {
                await hrService.addFavorite(userId);
                setFavorites((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(userId);
                    return newSet;
                });
                alert("Студент добавлен в избранное");
            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
            alert(isFavorite ? "Не удалось удалить из избранного" : "Не удалось добавить в избранное");
        }
    };

    if (loading) {
        return (
            <div className="mx-4 sm:mx-8 lg:mx-16 flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-custom-accent"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-4 sm:mx-8 lg:mx-16 flex justify-center items-center min-h-screen">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen gap-6">
            {/* Блок фильтров */}
            <div className="w-full lg:w-1/5 mb-4 lg:mb-0">
                <FilterPanel
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Список лидеров */}
            <div className="flex-1">
                <div className="bg-custom-bg-secondary rounded-2xl p-4 shadow-lg">
                    {/* Заголовки столбцов */}
                    <div className="flex flex-wrap items-center gap-3 p-3 border-b border-custom-secondary/30 text-custom-secondary text-sm font-medium">
                        <div className="w-8 sm:w-10 text-center">№</div>
                        <div className="flex-1 min-w-35">Пользователь</div>
                        <div className="w-20 text-center">Уровень</div>
                        <div className="w-24 text-center">Заданий</div>
                        <div className="flex-1 min-w-30">Университет</div>
                        <div className="w-24 text-center">Действие</div>
                    </div>

                    {/* Строки */}
                    {displayEntries.length > 0 ? (
                        <div className="divide-y divide-custom-secondary/10">
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
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-custom-secondary py-8">
                            Нет пользователей, соответствующих выбранным фильтрам.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;