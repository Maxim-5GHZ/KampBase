"use client";

import { useEffect, useState } from "react";
import { User, Star, Award, Newspaper, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";
import { taskService } from "@/app/utils/task-service";
import { skillService } from "@/app/utils/skill-service";

type Achievement = { id: string; name: string; short: string };

type StudentData = {
  firstName: string;
  lastName: string;
  university: string;
  stars: number;
  level: number;
  xp: number;
  maxXp: number;
  achievements: Achievement[];
};

export default function StudentProfileCard() {
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const user = authService.getCurrentUser();
      if (!user) return router.push("/login");

      try {
        const [skillsTree, allPerks] = await Promise.all([
          taskService.getMySkills(),
          skillService.getAllPerks(),
        ]);

        const rate = skillsTree.rate || 0;
        const level = Math.floor(rate / 1000) + 1;
        const xp = rate % 1000;
        const unlocked = skillsTree.unlockedPerks || [];
        const achievements = unlocked.map((perkId) => {
          const perk = allPerks.find((p) => p.id === perkId);
          return {
            id: perkId,
            name: perk?.name || perkId,
            short: perk?.short || "Д",
          };
        });

        setStudentData({
          firstName: user.name || "Студент",
          lastName: user.lastName || "",
          university: "КФ МГТУ им. Н.Э. Баумана",
          stars: rate,
          level,
          xp,
          maxXp: 1000,
          achievements,
        });
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  if (loading || !studentData) {
    return (
      <div className="flex flex-col items-center p-8 rounded-4xl bg-custom-bg-secondary h-full justify-center">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  const progressPercent = (studentData.xp / studentData.maxXp) * 100;

  return (
    <div className="flex flex-col items-center p-4 rounded-4xl bg-custom-bg-secondary gap-y-4 md:gap-y-6 min-h-[90vh]">
      <div className="mt-4">
        <div className="flex justify-center mb-4">
          <User size={120} className="text-custom-accent" />
        </div>
        <h2 className="text-2xl font-bold text-center text-custom-main mb-1">
          {studentData.firstName} {studentData.lastName}
        </h2>
        <p className="text-center text-custom-secondary mb-4">
          {studentData.university}
        </p>

        <div className="flex justify-center gap-6 mb-4">
          <div className="flex items-center gap-2" title="Общий рейтинг">
            <Star size={20} className="text-custom-accent" />
            <span className="text-custom-main">{studentData.stars}</span>
          </div>
          <div className="flex items-center gap-2" title="Уровень">
            <Award size={20} className="text-custom-accent" />
            <span className="text-custom-main">{studentData.level}</span>
          </div>
        </div>

        <div className="w-full max-w-xs mx-auto mb-2">
          <div className="w-full h-4 bg-custom-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-custom-accent rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <p className="text-center text-custom-secondary text-sm">
          {studentData.xp} / {studentData.maxXp} XP
        </p>
      </div>

      <div className="flex flex-col items-center w-full">
        <h3 className="text-2xl font-semibold text-custom-main mb-4">
          Открытые навыки
        </h3>
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {studentData.achievements.length > 0 ? (
            studentData.achievements.map((ach) => (
              <div key={ach.id} className="flex flex-col items-center w-20">
                <div className="w-14 h-14 rounded-full bg-custom-accent flex items-center justify-center text-white text-xl font-bold mb-2 shadow-lg">
                  {ach.short}
                </div>
                <span className="text-custom-main text-xs text-center leading-tight">
                  {ach.name}
                </span>
              </div>
            ))
          ) : (
            <p className="text-custom-secondary text-sm">
              Пока нет открытых навыков
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto w-full flex flex-col items-center gap-3 pb-4">
        <button
          onClick={() => router.push("/wiki")}
          className="btn btn-primary w-full md:w-3/4 rounded-button"
        >
          <Newspaper size={18} />
          Читать Wiki
        </button>

        <button
          onClick={handleLogout}
          className="btn btn-secondary bg-transparent w-full md:w-3/4 rounded-button flex items-center justify-center gap-2 text-custom-main"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </div>
    </div>
  );
}
