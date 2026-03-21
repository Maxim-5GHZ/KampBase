import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";
import { ArticleRequest, Article } from "./types";
import { fileService } from "./file-services";

class ArticleService {
  private http: AxiosInstance;

  constructor(baseURL: string = "/api/articles") {
    this.http = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    this.http.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const headers = authService.getAuthHeader();
        if (headers.Authorization) {
          config.headers.Authorization = headers.Authorization;
        }
      }
      return config;
    });
  }

  async create(data: ArticleRequest): Promise<Article> {
    const response = await this.http.post<Article>("", data);
    return response.data;
  }

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

  async update(id: number, data: ArticleRequest): Promise<Article> {
    const response = await this.http.put<Article>(`/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await this.http.delete(`/${id}`);
    return response.data;
  }

  async get(id: number): Promise<Article> {
    const response = await this.http.get<Article>(`/${id}`);
    return response.data;
  }

  async getAll(): Promise<Article[]> {
    // ИСПРАВЛЕНО: Изменено с "/" на ""
    const response = await this.http.get<Article[]>("");
    return response.data;
  }

  async search(title: string): Promise<Article[]> {
    const response = await this.http.get<Article[]>("/search", {
      params: { title },
    });
    return response.data;
  }
}

export const articleService = new ArticleService();
