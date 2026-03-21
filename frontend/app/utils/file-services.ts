import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";

class FileService {
  private http: AxiosInstance;

  constructor(baseURL: string = "/api/files") {
    this.http = axios.create({
      baseURL,
    });

    this.http.interceptors.request.use((config) => {
      const headers = authService.getAuthHeader();
      if (headers.Authorization) {
        config.headers.Authorization = headers.Authorization;
      }
      return config;
    });
  }

  // Метод принимает объект File (из <input type="file">)
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file); // Ключ "file" должен совпадать с @RequestParam("file") в Java

    const response = await this.http.post<{ message: string; url: string }>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url; // Возвращаем готовую ссылку (http://localhost:8080/uploads/...)
  }
}

export const fileService = new FileService();