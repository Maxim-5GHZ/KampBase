"use client";

import { useEffect, useState } from "react";
import { User, Users, ClipboardList, LogOut, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";
import { taskService } from "@/app/utils/task-service";
import { ArticleRequest, ArticleFormat } from "@/app/utils/types";
import { articleService } from "@/app/utils/article-service";

export default function MentorProfileCard() {
  const router = useRouter();
  const [mentorData, setMentorData] = useState<any>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // Состояние называется articleFormData
  const [articleFormData, setArticleFormData] = useState<
    Omit<ArticleRequest, "link">
  >({
    title: "",
    about: "",
    format: ArticleFormat.MD,
    previewPhotoLink: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = authService.getCurrentUser();
      if (!user) return router.push("/login");
      try {
        const allTasks = await taskService.getAllTasks();
        const myTasks = allTasks.filter((t) => t.author.userId === user.id);
        setMentorData({
          name: `${user.name} ${user.lastName}`,
          tasksCount: myTasks.length,
          studentsCount: 12,
        });
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, [router]);

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Выберите файл статьи");

    try {
      await articleService.createWithFile(articleFormData, selectedFile);
      setIsArticleModalOpen(false);

      // Сброс формы
      setArticleFormData({
        title: "",
        about: "",
        format: ArticleFormat.MD,
        previewPhotoLink: "",
      });
      setSelectedFile(null);

      // Уведомляем другие компоненты об обновлении
      window.dispatchEvent(new Event("articleCreated"));
    } catch (error) {
      alert("Ошибка загрузки");
    }
  };

  if (!mentorData)
    return (
      <div className="animate-pulse bg-custom-bg-secondary h-64 rounded-card" />
    );

  return (
    <div className="flex flex-col items-center p-6 rounded-card bg-custom-bg-secondary gap-y-6 shadow-lg">
      <div className="text-center">
        <User size={80} className="text-custom-accent mx-auto mb-4" />
        <h2 className="text-xl font-bold text-custom-main">
          {mentorData.name}
        </h2>
        <p className="text-custom-secondary text-sm">Ментор</p>
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center gap-3 text-custom-main">
          <ClipboardList size={20} className="text-custom-accent" />
          <span>Заданий: {mentorData.tasksCount}</span>
        </div>
        <div className="flex items-center gap-3 text-custom-main">
          <Users size={20} className="text-custom-accent" />
          <span>Студентов: {mentorData.studentsCount}</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <button
          onClick={() => setIsArticleModalOpen(true)}
          className="btn btn-primary rounded-button w-full flex gap-2"
        >
          <Plus size={18} /> Статья
        </button>
        <button
          onClick={() => {
            authService.logout();
            router.push("/login");
          }}
          className="btn btn-ghost text-custom-secondary w-full flex gap-2"
        >
          <LogOut size={18} /> Выйти
        </button>
      </div>

      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-custom-bg-main rounded-3xl p-6 w-full max-w-md border border-custom-secondary/20">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-custom-main">
                Новая статья Wiki
              </h3>
              <X
                className="cursor-pointer text-custom-secondary"
                onClick={() => setIsArticleModalOpen(false)}
              />
            </div>
            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <input
                className="input input-bordered w-full bg-custom-bg-secondary"
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
                className="textarea textarea-bordered w-full bg-custom-bg-secondary h-32"
                placeholder="Краткое описание"
                value={articleFormData.about}
                // ИСПРАВЛЕНО: Теперь используется правильное имя функции setArticleFormData
                onChange={(e) =>
                  setArticleFormData({
                    ...articleFormData,
                    about: e.target.value,
                  })
                }
                required
              />
              <div className="form-control">
                <label className="label-text mb-2 text-custom-secondary">
                  Файл статьи (.md или .pdf)
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full bg-custom-bg-secondary"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <button className="btn btn-primary w-full rounded-button mt-4">
                Опубликовать
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
