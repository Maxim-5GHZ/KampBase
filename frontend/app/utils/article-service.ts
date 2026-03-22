// frontend/app/utils/article-service.ts
import { ArticleRequest, Article, ArticleFormat } from "./types";
import { authService } from "./auth-service";

let mockArticles: Article[] = [
  {
    id: 1,
    title: "Как поднять Docker с нуля",
    about:
      "Пошаговое руководство по настройке Docker для локальной разработки. Учимся писать Dockerfile и docker-compose.yml.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink: "/image1.png",
    author: "AlexDev",
    authorId: 1,
    starCount: 142,
  },
  {
    id: 2,
    title: "Основы проектирования REST API",
    about:
      "Разбираем основные принципы REST, правильное именование эндпоинтов, статусы ответов и версионирование API.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink: "/image2.png",
    author: "Maria_Backend",
    authorId: 2,
    starCount: 89,
  },
  {
    id: 3,
    title: "Введение в микросервисную архитектуру",
    about:
      "Плюсы и минусы микросервисов. Когда стоит переходить от монолита и какие инструменты (RabbitMQ, Kafka) использовать.",
    format: ArticleFormat.PDF,
    link: "#",
    previewPhotoLink: "/image3.png",
    author: "TechLead",
    authorId: 3,
    starCount: 256,
  },
  {
    id: 4,
    title: "Оптимизация SQL-запросов",
    about:
      "Быстрые запросы для высоконагруженных систем. Разбираем B-Tree индексы, EXPLAIN и правильные JOIN.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink: "/image4.png",
    author: "DBA_Guru",
    authorId: 4,
    starCount: 115,
  },
  {
    id: 5,
    title: "Паттерны проектирования в Java",
    about:
      "Singleton, Factory, Strategy, Observer. Разбираем классические паттерны GoF на реальных примерах из Spring Framework.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink: "/image5.png",
    author: "JavaMaster",
    authorId: 5,
    starCount: 310,
  },
  {
    id: 6,
    title: "Clean Architecture: Стоит ли использовать?",
    about:
      "Разбираем слоистую архитектуру Дядюшки Боба. Разделение domain, use-case и infrastructure слоев.",
    format: ArticleFormat.MD,
    link: "#",
    previewPhotoLink: "/image6.png",
    author: "Arch_Guy",
    authorId: 6,
    starCount: 204,
  },
];

let nextId = 7;

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
