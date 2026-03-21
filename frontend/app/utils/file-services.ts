
import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";

class FileService {
  private http: AxiosInstance;

  constructor(baseURL: string = "/api/files") {
    this.http = axios.create({
      baseURL,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    this.http.interceptors.request.use((config) => {
      const headers = authService.getAuthHeader();
      if (headers.Authorization) {
        config.headers.Authorization = headers.Authorization;
      }
      return config;
    });
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.http.post<string>("/upload", formData);
    return response.data;
  }
}

export const fileService = new FileService();
