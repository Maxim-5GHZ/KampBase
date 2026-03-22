"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import MentorProfileCard from "./MentorProfileCard";
import WorkArea from "./MentorWorkArea";
import { taskService } from "@/app/utils/task-service";
import { articleService } from "@/app/utils/article-service";
import { Article, TaskRequest, Task } from "@/app/utils/types";
import { authService } from "../utils/auth-service";
import MyArticles from "./MyArticles";

export default function MentorProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<TaskRequest>({
    title: "",
    about: "",
    githubLink: "",
    skillName: "Java",
  });

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await articleService.getAll();
      // Показываем только статьи текущего ментора
      const user = authService.getCurrentUser();
      const myArticles = fetchedArticles.filter((a) => a.authorId === user?.id);
      setArticles(myArticles);
    } catch (error) {
      console.error("Ошибка при загрузке статей:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const allTasks = await taskService.getAllTasks();
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return;

      const mentorTasks = allTasks.filter(
        (task) => task.author.userId === currentUser.id,
      );
      setTasks(mentorTasks);
    } catch (err) {
      setErrorTasks("Не удалось загрузить задания");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchArticles();

    // Подписываемся на событие создания статьи, чтобы обновить список без F5
    const handleRefreshArticles = () => fetchArticles();
    window.addEventListener("articleCreated", handleRefreshArticles);

    return () =>
      window.removeEventListener("articleCreated", handleRefreshArticles);
  }, []);

  const handleDeleteArticle = async (id: number) => {
    if (confirm("Удалить эту статью?")) {
      await articleService.delete(id);
      fetchArticles();
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await taskService.createTask(formData);
      setIsModalOpen(false);
      setFormData({ title: "", about: "", githubLink: "", skillName: "Java" });
      fetchTasks();
    } catch (error) {
      console.error("Ошибка создания задания:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen gap-6 py-4">
      <div className="w-full lg:w-1/4">
        <MentorProfileCard />
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <WorkArea tasks={tasks} loading={loadingTasks} error={errorTasks} />
        <MyArticles articles={articles} onDelete={handleDeleteArticle} />
      </div>

      {/* Кнопка создания задания */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 btn btn-primary rounded-full shadow-2xl flex items-center gap-2 z-40 p-4"
      >
        <Plus size={24} />
        <span className="hidden sm:inline font-bold">Создать задание</span>
      </button>

      {/* Модалка задания */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-custom-bg-main rounded-3xl shadow-2xl w-full max-w-md border border-custom-secondary/20">
            <div className="flex justify-between items-center p-6 border-b border-custom-secondary/10">
              <h2 className="text-xl font-bold text-custom-main">
                Новое задание
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-custom-secondary hover:text-custom-main"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleTaskSubmit} className="p-6 space-y-4">
              <input
                placeholder="Название"
                className="input input-bordered w-full bg-custom-bg-secondary"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Описание"
                className="textarea textarea-bordered w-full bg-custom-bg-secondary h-24"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                required
              />
              <input
                placeholder="GitHub Link"
                className="input input-bordered w-full bg-custom-bg-secondary"
                value={formData.githubLink}
                onChange={(e) =>
                  setFormData({ ...formData, githubLink: e.target.value })
                }
                required
              />
              <select
                className="select select-bordered w-full bg-custom-bg-secondary"
                value={formData.skillName}
                onChange={(e) =>
                  setFormData({ ...formData, skillName: e.target.value })
                }
              >
                <option>Java</option>
                <option>JavaScript</option>
                <option>Python</option>
                <option>SQL</option>
              </select>
              <button
                disabled={isSubmitting}
                className="btn btn-primary w-full rounded-button"
              >
                {isSubmitting ? "Создание..." : "Опубликовать"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
