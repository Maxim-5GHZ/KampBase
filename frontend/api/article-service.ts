// article-service.ts
import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";
import { fileService } from "./file-services"; // Импорт сервиса файлов
import { ArticleRequest, Article } from "./types";

class ArticleService {
  private http: AxiosInstance;

  constructor(baseURL: string = "http://localhost:8080/api/articles") {
    this.http = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    this.http.interceptors.request.use((config) => {
      const headers = authService.getAuthHeader();
      if (headers.Authorization) {
        config.headers.Authorization = headers.Authorization;
      }
      return config;
    });
  }

  /**
   * ИСПРАВЛЕННЫЙ МЕТОД:
   * 1. Сначала загружает файл на сервер.
   * 2. Получает готовую ссылку.
   * 3. Создает статью, подставляя эту ссылку в поле link.
   */
  async createWithFile(
    data: Omit<ArticleRequest, "link">,
    file: File,
  ): Promise<Article> {
    // Шаг 1: Загрузка файла
    const uploadedFileUrl = await fileService.uploadFile(file);

    // Шаг 2: Формирование запроса к БД статей
    const finalData: ArticleRequest = {
      ...data,
      link: uploadedFileUrl, // Ссылка теперь указывает на наш сервер
    };

    // Шаг 3: Сохранение метаданных статьи
    const response = await this.http.post<Article>("", finalData);
    return response.data;
  }

  async getAll(): Promise<Article[]> {
    const response = await this.http.get<Article[]>("");
    return response.data;
  }

  async get(id: number): Promise<Article> {
    const response = await this.http.get<Article>(`/${id}`);
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await this.http.delete(`/${id}`);
    return response.data;
  }
}

export const articleService = new ArticleService();
