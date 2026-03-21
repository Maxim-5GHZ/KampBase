"use client";

import { User } from "lucide-react";

type LeaderboardRowProps = {
    rank: number;
    name: string;
    level: string | number;
    completedTasks: number;
    university: string;
    isFavorite: boolean;
    onToggleFavorite?: () => void;
};

const LeaderboardRow = ({
    rank,
    name,
    level,
    completedTasks,
    university,
    isFavorite,
    onToggleFavorite,
}: LeaderboardRowProps) => {
    return (
        <div className="flex flex-wrap items-center gap-3 p-3 sm:p-1 bg-custom-bg-secondary rounded-3xl shadow-sm border border-custom-secondary/20 hover:shadow-md transition-shadow">
            {/* Rank */}
            <div className="w-8 sm:w-10 text-center font-bold text-custom-main">
                {rank}
            </div>

            {/* User Icon & Name */}
            <div className="flex items-center gap-2 flex-1 min-w-35">
                <User size={18} className="text-custom-accent shrink-0" />
                <span className="text-custom-main font-medium truncate">{name}</span>
            </div>

            {/* Level */}
            <div className="w-20 text-center text-custom-secondary text-sm sm:text-base">
                {level}
            </div>

            {/* Completed Tasks */}
            <div className="w-24 text-center text-custom-main font-medium text-sm sm:text-base">
                {completedTasks}
            </div>

            {/* University */}
            <div className="flex-1 min-w-30 text-custom-secondary text-sm sm:text-base truncate">
                {university}
            </div>

            {/* Toggle Favorite Button */}
            <button
                onClick={onToggleFavorite}
                className={`btn btn-primary rounded-button px-3 py-1 text-sm sm:text-base shadow-none min-w-1/10 ${isFavorite ? "bg-transparent" : ""}`}
            >
                {isFavorite ? "Удалить" : "Связаться"}
            </button>
        </div>
    );
};

export default LeaderboardRow;