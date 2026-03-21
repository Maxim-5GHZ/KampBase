import axios, { AxiosInstance } from "axios";
import { authService } from "./auth-service";
import { Perk } from "./types";

class SkillService {
  private http: AxiosInstance;

  constructor(baseURL: string = "/api/skills") {
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

  async getAllPerks(): Promise<Perk[]> {
    const response = await this.http.get<Perk[]>("/perks");
    return response.data;
  }

  async unlockPerk(perkId: string): Promise<{ message: string }> {
    const response = await this.http.post<{ message: string }>(
      `/perks/${perkId}/unlock`,
    );
    return response.data;
  }
}

export const skillService = new SkillService();
