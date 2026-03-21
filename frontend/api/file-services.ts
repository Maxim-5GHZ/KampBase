// file-services.ts
import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";

class FileService {
  private http: AxiosInstance;

  constructor(baseURL: string = "http://localhost:8080/api/files") {
    this.http = axios.create({ baseURL });
  }

  // Метод загружает файл и возвращает строку (URL), которую прислал бэкенд
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file); // Ключ "file" совпадает с @RequestParam("file") в Java

    const headers = authService.getAuthHeader();

    const response = await this.http.post<{ message: string; url: string }>(
      "/upload",
      formData,
      {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.url; // Возвращает http://localhost:8080/uploads/uuid.md
  }
}

export const fileService = new FileService();
