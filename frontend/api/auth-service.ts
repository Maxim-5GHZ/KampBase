import axios, { AxiosInstance } from "axios";
import { LoginRequest, SignUpRequest, JwtResponse } from "./types";

class AuthService {
  private http: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = "http://localhost:8080/api/auth") {
    this.http = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Сохранение токена в памяти (на фронте можно добавить LocalStorage)
  setToken(token: string) {
    this.token = token;
  }

  // Регистрация
  async signup(data: SignUpRequest): Promise<string> {
    const response = await this.http.post("/signup", data);
    return response.data;
  }

  // Логин
  async login(data: LoginRequest): Promise<JwtResponse> {
    const response = await this.http.post<JwtResponse>("/login", data);
    this.setToken(response.data.token);
    return response.data;
  }

  // Метод для получения хедера авторизации (для других сервисов)
  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

// Экспортируем как синглтон
export const authService = new AuthService();
