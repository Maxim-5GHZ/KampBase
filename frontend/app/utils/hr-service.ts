// File: ./frontend/app/utils/hr-service.ts
import { LeaderboardEntry, UserShortInfo } from "./types";

let mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: 1,
    username: "ivanov",
    name: "Иван",
    lastName: "Иванов",
    totalRate: 5400,
    skillPoints: null,
  },
  {
    userId: 2,
    username: "petrova",
    name: "Анна",
    lastName: "Петрова",
    totalRate: 4200,
    skillPoints: null,
  },
  {
    userId: 3,
    username: "smirnov",
    name: "Алексей",
    lastName: "Смирнов",
    totalRate: 3100,
    skillPoints: null,
  },
  {
    userId: 4,
    username: "sidorov",
    name: "Дмитрий",
    lastName: "Сидоров",
    totalRate: 2800,
    skillPoints: null,
  },
  {
    userId: 5,
    username: "kuznetsova",
    name: "Елена",
    lastName: "Кузнецова",
    totalRate: 1500,
    skillPoints: null,
  },
];

let mockFavorites = new Set<number>();

class HrService {
  async getLeaderboard(skill?: string): Promise<LeaderboardEntry[]> {
    return [...mockLeaderboard].sort((a, b) => b.totalRate - a.totalRate);
  }

  async addFavorite(studentId: number): Promise<{ message: string }> {
    mockFavorites.add(studentId);
    return { message: "ok" };
  }

  async removeFavorite(studentId: number): Promise<{ message: string }> {
    mockFavorites.delete(studentId);
    return { message: "ok" };
  }

  async getFavorites(): Promise<UserShortInfo[]> {
    return mockLeaderboard
      .filter((u) => mockFavorites.has(u.userId))
      .map((u) => ({
        userId: u.userId,
        username: u.username,
        name: u.name,
        lastName: u.lastName,
      }));
  }
}

export const hrService = new HrService();
