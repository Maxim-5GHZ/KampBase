"use client";

import { User, Mail, Github } from "lucide-react";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  level: number;
  topSkillName: string | null;
  topSkillPoints: number | null;
  requestedSkillPoints: number | null;
  university: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  email: string;
}

const LeaderboardRow = ({
  rank,
  name,
  level,
  topSkillName,
  topSkillPoints,
  requestedSkillPoints,
  university,
  isFavorite,
  onToggleFavorite,
  email,
}: LeaderboardRowProps) => {
  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 bg-custom-bg-secondary rounded-3xl shadow-sm border border-custom-secondary/20 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-8 sm:w-10 text-center font-bold text-custom-main shrink-0">
          {rank}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <User size={18} className="text-custom-accent shrink-0" />
          <span className="text-custom-main font-medium truncate">{name}</span>
        </div>

        <div className="w-24 text-center text-custom-main font-bold text-sm sm:text-base shrink-0">
          {level} XP
        </div>

        <div className="w-32 text-center text-sm sm:text-base shrink-0">
          {requestedSkillPoints !== null ? (
            <span className="text-custom-accent font-semibold">
              {requestedSkillPoints} XP
            </span>
          ) : topSkillName ? (
            <span className="text-custom-secondary">
              {topSkillName}{" "}
              <span className="text-custom-main font-semibold">
                {topSkillPoints}
              </span>
            </span>
          ) : (
            <span className="text-custom-secondary opacity-50">
              Нет навыков
            </span>
          )}
        </div>

        <div className="w-32 text-center text-custom-secondary text-sm sm:text-base truncate shrink-0">
          {university}
        </div>

        <button
          onClick={onToggleFavorite}
          className={`btn btn-primary rounded-button px-3 py-1 text-sm sm:text-base shadow-none w-36 shrink-0 ${
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
