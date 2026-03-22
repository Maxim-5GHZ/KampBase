"use client";

import { useEffect, useState } from "react";
import {
  User,
  Users,
  ClipboardList,
  ListTodo,
  LogOut,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";
import { taskService } from "@/app/utils/task-service";
import { ArticleRequest, ArticleFormat, Article } from "@/app/utils/types";
import { articleService } from "@/app/utils/article-service";

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
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleFormData, setArticleFormData] = useState<
    Omit<ArticleRequest, "link">
  >({
    title: "",
    about: "",
    format: ArticleFormat.MD,
    previewPhotoLink: "",
  });
  const [selectedArticleFile, setSelectedArticleFile] = useState<File | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      const user = authService.getCurrentUser();
      if (!user) return router.push("/login");

      try {
        const allTasks = await taskService.getAllTasks();
        const myTasks = allTasks.filter((t) => t.author.userId === user.id);
        let totalUniqueStudents = new Set<number>();
        const tasksStats: TaskStat[] = [];

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
          tasks: tasksStats.slice(0, 3),
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

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleFile) return alert("Выберите файл");
    try {
      await articleService.createWithFile(articleFormData, selectedArticleFile);
      setIsArticleModalOpen(false);
      setArticleFormData({
        title: "",
        about: "",
        format: ArticleFormat.MD,
        previewPhotoLink: "",
      });
      setSelectedArticleFile(null);
      window.location.reload();
    } catch (error) {
      alert("Ошибка при загрузке статьи");
    }
  };

  if (loading || !mentorData) {
    return (
      <div className="flex flex-col items-center p-8 rounded-4xl bg-custom-bg-secondary h-full justify-center">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 rounded-4xl bg-custom-bg-secondary gap-y-4 md:gap-y-6 min-h-[90vh]">
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
          <ListTodo /> Все задания
        </button>
      </div>

      <div className="mt-auto w-full flex flex-col items-center gap-3 pb-4">
        <button
          onClick={() => setIsArticleModalOpen(true)}
          className="btn btn-secondary w-full md:w-3/4 rounded-button flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Написать статью
        </button>

        <button
          onClick={handleLogout}
          className="btn btn-secondary bg-transparent w-full md:w-3/4 rounded-button flex items-center justify-center gap-2 text-custom-main"
        >
          <LogOut size={18} /> Выйти
        </button>
      </div>

      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-custom-bg-main rounded-3xl p-6 w-full max-w-md border border-custom-secondary/20">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-custom-main">
                Новая статья
              </h3>
              <X
                className="cursor-pointer"
                onClick={() => setIsArticleModalOpen(false)}
              />
            </div>
            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <input
                className="w-full input input-bordered bg-custom-bg-secondary"
                placeholder="Заголовок"
                value={articleFormData.title}
                onChange={(e) =>
                  setArticleFormData({
                    ...articleFormData,
                    title: e.target.value,
                  })
                }
                required
              />
              <textarea
                className="w-full textarea textarea-bordered bg-custom-bg-secondary"
                placeholder="О чем статья?"
                value={articleFormData.about}
                onChange={(e) =>
                  setArticleFormData({
                    ...articleFormData,
                    about: e.target.value,
                  })
                }
                required
              />
              <select
                className="select select-bordered w-full bg-custom-bg-secondary"
                value={articleFormData.format}
                onChange={(e) =>
                  setArticleFormData({
                    ...articleFormData,
                    format: e.target.value as ArticleFormat,
                  })
                }
              >
                <option value={ArticleFormat.MD}>Markdown (.md)</option>
                <option value={ArticleFormat.PDF}>PDF (.pdf)</option>
              </select>
              <input
                type="file"
                className="file-input file-input-bordered w-full bg-custom-bg-secondary"
                onChange={(e) =>
                  setSelectedArticleFile(e.target.files?.[0] || null)
                }
                required
              />
              <button className="btn btn-secondary w-full rounded-button">
                Загрузить в Wiki
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
