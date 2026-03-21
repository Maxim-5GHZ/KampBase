"use client";

import { useState, useEffect } from "react";
import FilterPanel, { FilterCategory } from "../components/FilterPanel";
import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";
import { taskService } from "@/app/utils/task-service";
import { Task } from "@/app/utils/types";

const difficultyMap: Record<string, number> = {
    "★": 1,
    "★ ★": 2,
    "★ ★ ★": 3,
    "★ ★ ★ ★": 4,
    "★ ★ ★ ★ ★": 5,
};

const Tasks = () => {
    const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
        {
            name: "Сложность",
            values: ["★", "★★", "★★★", "★★★★", "★★★★★"],
            selected: [],
        },
        {
            name: "Навык",
            values: ["Java", "Python", "JavaScript", "SQL", "Проектирование БД"],
            selected: [],
        },
    ]);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                // Artificial delay to demonstrate skeleton (1000 ms)
                await new Promise((resolve) => setTimeout(resolve, 300));
                const allTasks = await taskService.getAllTasks();
                setTasks(allTasks);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError("Не удалось загрузить задания");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter((task) => {
        const difficultyCategory = filterCategories.find((cat) => cat.name === "Сложность");
        const skillsCategory = filterCategories.find((cat) => cat.name === "Навык");

        // Difficulty filter – all tasks currently have difficulty 1
        const difficultyMatch =
            !difficultyCategory || difficultyCategory.selected.length === 0
                ? true
                : difficultyCategory.selected.some((starStr) => difficultyMap[starStr] === 1);

        // Skill filter
        const skillsMatch =
            !skillsCategory || skillsCategory.selected.length === 0
                ? true
                : skillsCategory.selected.includes(task.skillName);

        return difficultyMatch && skillsMatch;
    });

    const handleFilterChange = (newCategories: FilterCategory[]) => {
        setFilterCategories(newCategories);
    };

    if (loading) {
        return (
            <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
                {/* Filter panel placeholder */}
                <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
                    <FilterPanel
                        categories={filterCategories}
                        onFilterChange={handleFilterChange}
                    />
                </div>
                {/* Skeleton grid (6 items) */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8">
                        {Array(6)
                            .fill(null)
                            .map((_, i) => (
                                <TaskCardSkeleton key={i} />
                            ))}
                    </div>
                </div>
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
        <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
            {/* Блок фильтров */}
            <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
                <FilterPanel
                    categories={filterCategories}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Сетка заданий */}
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            title={task.title}
                            difficulty={1}
                            description={task.about}
                            attachedFiles={[]}
                            rewardStars={100}
                        />
                    ))}
                </div>
                {filteredTasks.length === 0 && (
                    <div className="text-center text-custom-secondary mt-8">
                        Нет заданий, соответствующих выбранным фильтрам.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;