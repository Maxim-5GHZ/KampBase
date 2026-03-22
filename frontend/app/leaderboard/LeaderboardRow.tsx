"use client";

import { User, Mail, Github } from "lucide-react";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  level: string | number;
  completedTasks: number;
  university: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  email: string;
}

const LeaderboardRow = ({
  rank,
  name,
  level,
  completedTasks,
  university,
  isFavorite,
  onToggleFavorite,
  email,
}: LeaderboardRowProps) => {
  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 bg-custom-bg-secondary rounded-3xl shadow-sm border border-custom-secondary/20 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-8 sm:w-10 text-center font-bold text-custom-main">
          {rank}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-35">
          <User size={18} className="text-custom-accent shrink-0" />
          <span className="text-custom-main font-medium truncate">{name}</span>
        </div>

        <div className="w-20 text-center text-custom-secondary text-sm sm:text-base">
          {level}
        </div>

        <div className="w-24 text-center text-custom-main font-medium text-sm sm:text-base">
          {completedTasks}
        </div>

        <div className="flex-1 min-w-30 text-custom-secondary text-sm sm:text-base truncate">
          {university}
        </div>

        <button
          onClick={onToggleFavorite}
          className={`btn btn-primary rounded-button px-3 py-1 text-sm sm:text-base shadow-none w-36 ${
            isFavorite
              ? "bg-transparent border border-custom-accent text-custom-accent"
              : ""
          }`}
        >
          {isFavorite ? "Скрыть" : "Связаться"}
        </button>
      </div>

      {isFavorite && (
        <div className="flex flex-wrap items-center gap-6 ml-0 sm:ml-14 mt-2 text-sm text-custom-main p-3 bg-custom-bg-main rounded-xl border border-custom-secondary/20">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-custom-accent" />
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Github size={16} className="text-custom-accent" />
            <span className="opacity-70">github.com/{email.split("@")[0]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardRow;
