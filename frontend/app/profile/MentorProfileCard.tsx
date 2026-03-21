"use client";

import { useEffect, useState } from "react";
import { User, Users, ClipboardList, ListTodo, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";
import { taskService } from "@/app/utils/task-service";

type TaskStat = {
  id: string;
  title: string;
  completionPercent: number;
  participatingStudents: number;
};

type MentorData = {
  firstName: string;
  lastName: string;
  tasksCount: number;
  studentsCount: number;
  tasks: TaskStat[];
};

export default function MentorProfileCard() {
  const router = useRouter();
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Забираем все таски
        const allTasks = await taskService.getAllTasks();
        // Фильтруем только те, которые создал этот ментор
        const myTasks = allTasks.filter((t) => t.author.userId === user.id);

        let totalUniqueStudents = new Set<number>();
        const tasksStats: TaskStat[] = [];

        // Подсчитываем статистику для каждой таски
        for (const task of myTasks) {
          try {
            const solutions = await taskService.getTaskSolutions(task.id);

            solutions.forEach((s) => totalUniqueStudents.add(s.user.userId));

            const participatingStudents = new Set(
              solutions.map((s) => s.user.userId),
            ).size;
            const approved = solutions.filter(
              (s) => s.status === "APPROVED",
            ).length;
            const completionPercent =
              solutions.length > 0
                ? Math.round((approved / solutions.length) * 100)
                : 0;

            tasksStats.push({
              id: String(task.id),
              title: task.title,
              completionPercent,
              participatingStudents,
            });
          } catch (e) {
            // Если нет решений, просто добавляем пустую статистику
            tasksStats.push({
              id: String(task.id),
              title: task.title,
              completionPercent: 0,
              participatingStudents: 0,
            });
          }
        }

        setMentorData({
          firstName: user.name || "Ментор",
          lastName: user.lastName || "",
          tasksCount: myTasks.length,
          studentsCount: totalUniqueStudents.size,
          tasks: tasksStats.slice(0, 3), // Показываем только 3 последние в профиле
        });
      } catch (error) {
        console.error("Ошибка загрузки профиля ментора:", error);
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

  if (loading || !mentorData) {
    return (
      <div className="flex flex-col items-center p-8 rounded-4xl bg-custom-bg-secondary h-full justify-center">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 rounded-4xl bg-custom-bg-secondary gap-y-4 md:gap-y-8">
      <div className="mt-4">
        <div className="flex justify-center mb-4">
          <User size={120} className="text-custom-accent" />
        </div>

        <h2 className="text-2xl font-bold text-center text-custom-main mb-1">
          {mentorData.firstName} {mentorData.lastName}
        </h2>
        <p className="text-center text-custom-secondary mb-4">Ментор</p>
      </div>

      <div className="w-full px-4">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={20} className="text-custom-accent" />
          <span className="text-custom-main font-medium">
            Заданий: {mentorData.tasksCount}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Users size={20} className="text-custom-accent" />
          <span className="text-custom-main font-medium">
            Аудитория: {mentorData.studentsCount} чел.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 w-full px-4">
        <h3 className="text-xl font-semibold text-custom-main mb-2">
          Сводка заданий
        </h3>

        {mentorData.tasks.length > 0 ? (
          mentorData.tasks.map((task) => (
            <div
              key={task.id}
              className="mb-3 p-3 bg-custom-bg-main rounded-xl border border-custom-secondary/20"
            >
              <p className="text-custom-main font-semibold truncate">
                {task.title}
              </p>
              <div className="flex justify-between text-custom-secondary text-sm mt-1">
                <span>Выполнили: {task.completionPercent}%</span>
                <span>Сдано: {task.participatingStudents}</span>
              </div>
              <progress
                className="progress progress-primary w-full mt-1"
                value={task.completionPercent}
                max="100"
              ></progress>
            </div>
          ))
        ) : (
          <p className="text-custom-secondary text-sm text-center py-4">
            Вы еще не создали заданий.
          </p>
        )}

        <button
          onClick={() => router.push("/tasks")}
          className="self-center btn btn-primary w-full md:w-3/4 rounded-button mt-2"
        >
          <ListTodo />
          Все задания
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-secondary bg-transparent w-full md:w-3/4 rounded-button flex items-center justify-center gap-2 mb-4 text-custom-main"
      >
        <LogOut size={18} />
        Выйти
      </button>
    </div>
  );
}
