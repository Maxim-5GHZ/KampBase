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
    const user = authService.getCurrentUser();
    if (user && user.roles.length > 0) setUserRole(user.roles[0]);
    setLoading(false);
  }, []);

  const renderDifficultyStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`inline-block ${i <= difficulty ? "text-custom-accent" : "text-custom-secondary"}`}
        />,
      );
    }
    return stars;
  };

  const handleStartTask = () => {
    alert(
      "Отлично! Задание добавлено в ваш профиль. Можете приступать к выполнению.",
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-custom-bg-secondary rounded-card shadow-2xs">
      <h2 className="xl:h-[2lh] text-lg sm:text-xl font-bold text-custom-main mb-2 text-center">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-sm sm:text-base text-custom-main">
          Сложность:
        </span>
        <div className="flex gap-0.5">{renderDifficultyStars()}</div>
      </div>
      <p className="xl:h-[3lh] text-custom-secondary mb-4 line-clamp-3 text-sm sm:text-base">
        {description}
      </p>

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

      <div className="flex justify-between items-center gap-4">
        {!loading && userRole === "ROLE_STUDENT" && (
          <button
            onClick={handleStartTask}
            className="btn btn-primary rounded-button shadow-none px-4 py-2 text-sm sm:text-base hover:scale-105 transition"
          >
            Начать
          </button>
        )}
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
