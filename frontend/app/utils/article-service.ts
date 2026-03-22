// File: ./frontend/app/utils/article-service.ts
import { ArticleRequest, Article, ArticleFormat } from "./types";
import { authService } from "./auth-service";

let mockArticles: Article[] = [
  {
    id: 1,
    title: "Как поднять Docker с нуля",
    about:
      "Пошаговое руководство по настройке Docker для локальной разработки. Учимся писать Dockerfile.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80",
    author: "AlexDev",
    authorId: 1,
    starCount: 142,
  },
  {
    id: 2,
    title: "Основы проектирования REST API",
    about:
      "Разбираем основные принципы REST, правильное именование эндпоинтов, статусы ответов.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    author: "Maria_Backend",
    authorId: 2,
    starCount: 89,
  },
  {
    id: 3,
    title: "Введение в микросервисную архитектуру",
    about:
      "Плюсы и минусы микросервисов. Когда стоит переходить и какие инструменты использовать.",
    format: ArticleFormat.PDF,
    link: "#",
    previewPhotoLink:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    author: "TechLead",
    authorId: 3,
    starCount: 256,
  },
  {
    id: 4,
    title: "Оптимизация SQL",
    about: "Быстрые запросы для высоконагруженных систем. Разбираем индексы.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    author: "DBA_Guru",
    authorId: 4,
    starCount: 115,
  },
];

let nextId = 5;

class ArticleService {
  async createWithFile(
    data: Omit<ArticleRequest, "link">,
    file: File,
  ): Promise<Article> {
    const user = authService.getCurrentUser();
    const newArticle: Article = {
      ...data,
      id: nextId++,
      link: "#",
      author: user?.name || user?.username || "Вы",
      authorId: user?.id || 999,
      starCount: 0,
      previewPhotoLink:
        data.previewPhotoLink ||
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    };
    mockArticles = [newArticle, ...mockArticles];
    return newArticle;
  }

  async delete(id: number): Promise<{ message: string }> {
    mockArticles = mockArticles.filter((a) => a.id !== id);
    return { message: "ok" };
  }

  async get(id: number): Promise<Article> {
    return mockArticles.find((a) => a.id === id) as Article;
  }

  async getAll(): Promise<Article[]> {
    return [...mockArticles];
  }

  async search(title: string): Promise<Article[]> {
    return mockArticles.filter((a) =>
      a.title.toLowerCase().includes(title.toLowerCase()),
    );
  }
}

export const articleService = new ArticleService();
