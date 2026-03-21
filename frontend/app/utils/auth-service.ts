import axios, { AxiosInstance } from "axios";
import { LoginRequest, SignUpRequest, JwtResponse } from "./types";

interface StoredUser {
  id: number;
  username: string;
  name: string; // ДОБАВЛЕНО
  lastName: string; // ДОБАВЛЕНО
  roles: string[];
}

class AuthService {
  private http: AxiosInstance;
  private token: string | null = null;
  private user: StoredUser | null = null;

  constructor(baseURL: string = "/api/auth") {
    this.http = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("auth_token");
      if (savedToken) {
        this.setToken(savedToken);
      }
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
    this.http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    delete this.http.defaults.headers.common["Authorization"];
  }

  setUser(user: StoredUser) {
    this.user = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user));
    }
  }

  clearUser() {
    this.user = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
    }
  }

  logout() {
    this.clearToken();
    this.clearUser();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): StoredUser | null {
    return this.user;
  }

  async signup(data: SignUpRequest): Promise<string> {
    const response = await this.http.post("/signup", data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<JwtResponse> {
    const response = await this.http.post<JwtResponse>("/login", data);
    this.setToken(response.data.token);
    this.setUser({
      id: response.data.id,
      username: response.data.username,
      name: response.data.name, // СОХРАНЯЕМ ИМЯ
      lastName: response.data.lastName, // СОХРАНЯЕМ ФАМИЛИЮ
      roles: response.data.roles,
    });
    return response.data;
  }

  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

export const authService = new AuthService();

if (typeof window !== "undefined") {
  (window as any).auth = authService;
}
