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
    totalRate: 2500,
    skillPoints: null,
  },
  {
    userId: 6,
    username: "morozov",
    name: "Максим",
    lastName: "Морозов",
    totalRate: 2100,
    skillPoints: null,
  },
  {
    userId: 7,
    username: "volkov",
    name: "Сергей",
    lastName: "Волков",
    totalRate: 1950,
    skillPoints: null,
  },
  {
    userId: 8,
    username: "lebedeva",
    name: "Ольга",
    lastName: "Лебедева",
    totalRate: 1800,
    skillPoints: null,
  },
  {
    userId: 9,
    username: "novikov",
    name: "Никита",
    lastName: "Новиков",
    totalRate: 1650,
    skillPoints: null,
  },
  {
    userId: 10,
    username: "popov",
    name: "Артем",
    lastName: "Попов",
    totalRate: 1500,
    skillPoints: null,
  },
  {
    userId: 11,
    username: "sokolov",
    name: "Михаил",
    lastName: "Соколов",
    totalRate: 1200,
    skillPoints: null,
  },
  {
    userId: 12,
    username: "mikhailova",
    name: "Мария",
    lastName: "Михайлова",
    totalRate: 950,
    skillPoints: null,
  },
  {
    userId: 13,
    username: "fedorov",
    name: "Роман",
    lastName: "Федоров",
    totalRate: 800,
    skillPoints: null,
  },
  {
    userId: 14,
    username: "alekseev",
    name: "Егор",
    lastName: "Алексеев",
    totalRate: 600,
    skillPoints: null,
  },
  {
    userId: 15,
    username: "vasiliev",
    name: "Илья",
    lastName: "Васильев",
    totalRate: 450,
    skillPoints: null,
  },
];

let mockFavorites = new Set<number>([1, 4]); // По умолчанию Иван и Дмитрий в избранном

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
