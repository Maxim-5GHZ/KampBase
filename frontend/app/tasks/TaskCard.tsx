"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/app/utils/auth-service";

type TaskCardProps = {
    title: string;
    difficulty: number;
    description: string;
    attachedFiles?: string[];
    rewardStars: number;
};

const TaskCard = ({
    title,
    difficulty,
    description,
    attachedFiles = [],
    rewardStars,
}: TaskCardProps) => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get current user from auth service
        const user = authService.getCurrentUser();
        if (user && user.roles.length > 0) {
            // Assuming the user has exactly one role; take the first one
            setUserRole(user.roles[0]);
        }
        setLoading(false);
    }, []);

    const renderDifficultyStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    className={`inline-block ${
                        i <= difficulty ? "text-custom-accent" : "text-custom-secondary"
                    }`}
                />
            );
        }
        return stars;
    };

    return (
        <div className="p-4 sm:p-6 bg-custom-bg-secondary rounded-card shadow-2xs">
            {/* Заголовок задания */}
            <h2 className="xl:h-[2lh] text-lg sm:text-xl font-bold text-custom-main mb-2 text-center">
                {title}
            </h2>

            {/* Строка сложности */}
            <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-sm sm:text-base text-custom-main">Сложность:</span>
                <div className="flex gap-0.5">{renderDifficultyStars()}</div>
            </div>

            {/* Описание задания */}
            <p className="xl:h-[3lh] text-custom-secondary mb-4 line-clamp-3 text-sm sm:text-base">
                {description}
            </p>

            {/* Область для просмотра прикреплённых файлов */}
            <div className="block border border-dashed border-custom-main rounded-2xl p-4 sm:p-6 mb-4">
                <div className="text-center text-custom-main font-medium mb-2 text-sm sm:text-base">
                    Прикреплённые файлы
                </div>
                {attachedFiles.length > 0 ? (
                    <ul className="text-custom-main text-xs sm:text-sm">
                        {attachedFiles.map((fileName, index) => (
                            <li key={index}>{fileName}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-custom-secondary text-xs sm:text-sm text-center">
                        Нет прикреплённых файлов
                    </p>
                )}
            </div>

            {/* Кнопка "Начать" и награда */}
            <div className="flex justify-between items-center gap-4">
                {!loading && userRole === "ROLE_STUDENT" && (
                    <button className="btn btn-primary rounded-button shadow-none px-4 py-2 text-sm sm:text-base">
                        Начать
                    </button>
                )}
                {/* If not student, we still show the reward area but without the button.
                    The layout will shift the reward to the left if no button. 
                    To keep consistent spacing, you might want to add an empty div or adjust. */}
                <div className="flex items-center gap-1 text-custom-main ml-auto">
                    <span className="text-sm sm:text-base font-medium">Награда</span>
                    <span className="text-sm sm:text-base font-bold">{rewardStars}</span>
                    <Star size={16} className="text-custom-accent" />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;