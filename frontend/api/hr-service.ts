// hr-service.ts
import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";
import { LeaderboardEntry, UserShortInfo } from "./types";

class HrService {
  private http: AxiosInstance;

  constructor(baseURL: string = "http://localhost:8080/api/hr") {
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

  async getLeaderboard(skill?: string): Promise<LeaderboardEntry[]> {
    const response = await this.http.get<LeaderboardEntry[]>("/leaderboard", {
      params: skill ? { skill } : {},
    });
    return response.data;
  }

  async addFavorite(studentId: number): Promise<{ message: string }> {
    const response = await this.http.post<{ message: string }>(
      `/favorites/${studentId}`,
    );
    return response.data;
  }

  async removeFavorite(studentId: number): Promise<{ message: string }> {
    const response = await this.http.delete<{ message: string }>(
      `/favorites/${studentId}`,
    );
    return response.data;
  }

  async getFavorites(): Promise<UserShortInfo[]> {
    const response = await this.http.get<UserShortInfo[]>("/favorites");
    return response.data;
  }
}

export const hrService = new HrService();
