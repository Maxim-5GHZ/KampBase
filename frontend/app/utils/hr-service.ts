import { LeaderboardEntry, UserShortInfo } from "./types";

// Вспомогательная функция для генерации честных данных
function createMockUser(
  id: number,
  username: string,
  name: string,
  lastName: string,
  company: string,
  skills: Record<string, number>,
): LeaderboardEntry {
  // Считаем общий рейтинг (сумма скиллов + немного базового опыта)
  const baseRate = Math.floor(Math.random() * 500) + 100;
  const totalRate =
    Object.values(skills).reduce((sum, val) => sum + val, 0) + baseRate;

  // Ищем лучший навык
  let topSkillName: string | null = null;
  let topSkillPoints = 0;
  for (const [sName, sPts] of Object.entries(skills)) {
    if (sPts > topSkillPoints) {
      topSkillPoints = sPts;
      topSkillName = sName;
    }
  }

  return {
    userId: id,
    username,
    name,
    lastName,
    company,
    totalRate,
    skillPoints: null, // Заполняется динамически при поиске
    topSkillName,
    topSkillPoints,
    skills,
  };
}

// Генерируем большую и красивую базу студентов
let mockLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    1,
    "ivanov@mail.ru",
    "Иван",
    "Иванов",
    "КФ МГТУ им. Н.Э. Баумана",
    { Java: 3200, SQL: 1500, Python: 200 },
  ),
  createMockUser(2, "petrova@yandex.ru", "Анна", "Петрова", "НИУ ВШЭ", {
    Python: 4100,
    SQL: 800,
    JavaScript: 1200,
  }),
  createMockUser(3, "smirnov@gmail.com", "Алексей", "Смирнов", "МГУ", {
    JavaScript: 3500,
    Java: 1100,
  }),
  createMockUser(4, "sidorov@mail.ru", "Дмитрий", "Сидоров", "МФТИ", {
    Python: 2800,
    Java: 2900,
    SQL: 2000,
  }),
  createMockUser(
    5,
    "kuznetsova@bk.ru",
    "Елена",
    "Кузнецова",
    "КФ МГТУ им. Н.Э. Баумана",
    { SQL: 3800, Python: 900 },
  ),
  createMockUser(6, "morozov@inbox.ru", "Максим", "Морозов", "СПбГУ", {
    Java: 4500,
    JavaScript: 500,
  }),
  createMockUser(7, "volkov@yandex.ru", "Сергей", "Волков", "НИУ ВШЭ", {
    JavaScript: 2100,
    Python: 2150,
  }),
  createMockUser(8, "lebedeva@mail.ru", "Ольга", "Лебедева", "МГУ", {
    Python: 5000,
  }),
  createMockUser(9, "novikov@gmail.com", "Никита", "Новиков", "МФТИ", {
    Java: 1800,
    SQL: 1900,
    JavaScript: 1500,
  }),
  createMockUser(
    10,
    "popov@yandex.ru",
    "Артем",
    "Попов",
    "КФ МГТУ им. Н.Э. Баумана",
    { SQL: 4200, Java: 800 },
  ),
  createMockUser(11, "sokolov@mail.ru", "Михаил", "Соколов", "НИУ ВШЭ", {
    JavaScript: 4000,
    Python: 300,
  }),
  createMockUser(12, "mikhailova@bk.ru", "Мария", "Михайлова", "МГУ", {
    Java: 2500,
    Python: 2500,
  }),
  createMockUser(13, "fedorov@gmail.com", "Роман", "Федоров", "МФТИ", {
    SQL: 1500,
    JavaScript: 1600,
  }),
  createMockUser(14, "alekseev@yandex.ru", "Егор", "Алексеев", "СПбГУ", {
    Python: 3200,
    SQL: 1100,
  }),
  createMockUser(
    15,
    "vasiliev@mail.ru",
    "Илья",
    "Васильев",
    "КФ МГТУ им. Н.Э. Баумана",
    { Java: 3900 },
  ),
  createMockUser(16, "zaitseva@yandex.ru", "Дарья", "Зайцева", "НИУ ВШЭ", {
    JavaScript: 2800,
    SQL: 2200,
  }),
  createMockUser(17, "stepanov@gmail.com", "Кирилл", "Степанов", "МГУ", {
    Python: 1500,
    Java: 3100,
  }),
  createMockUser(18, "orlova@mail.ru", "Алина", "Орлова", "МФТИ", {
    SQL: 4500,
  }),
  createMockUser(
    19,
    "pavlov@bk.ru",
    "Виктор",
    "Павлов",
    "КФ МГТУ им. Н.Э. Баумана",
    { JavaScript: 3100, Java: 2000 },
  ),
  createMockUser(20, "makarov@yandex.ru", "Денис", "Макаров", "СПбГУ", {
    Python: 3800,
    JavaScript: 1000,
  }),
  createMockUser(21, "andreeva@gmail.com", "Виктория", "Андреева", "НИУ ВШЭ", {
    Java: 4200,
    SQL: 500,
  }),
  createMockUser(22, "romanov@mail.ru", "Тимур", "Романов", "МГУ", {
    JavaScript: 4800,
  }),
  createMockUser(23, "kiselev@yandex.ru", "Григорий", "Киселев", "МФТИ", {
    Python: 2200,
    SQL: 2300,
  }),
  createMockUser(
    24,
    "ilna@bk.ru",
    "Ксения",
    "Ильина",
    "КФ МГТУ им. Н.Э. Баумана",
    { Java: 2800, Python: 1400 },
  ),
  createMockUser(25, "gusev@gmail.com", "Артур", "Гусев", "СПбГУ", {
    SQL: 3300,
    JavaScript: 1800,
  }),
];

let mockFavorites = new Set<number>([1, 4, 8]); // Несколько человек в избранном по умолчанию

class HrService {
  async getLeaderboard(skill?: string): Promise<LeaderboardEntry[]> {
    // Имитация задержки сети для красоты
    await new Promise((resolve) => setTimeout(resolve, 400));

    let result = [...mockLeaderboard];

    if (skill && skill.trim() !== "") {
      // 1. Оставляем только тех, у кого есть этот навык (> 0)
      result = result.filter(
        (u) => u.skills && u.skills[skill] && u.skills[skill] > 0,
      );

      // 2. Сортируем по очкам именно этого навыка (по убыванию)
      result.sort((a, b) => (b.skills![skill] || 0) - (a.skills![skill] || 0));

      // 3. Подставляем очки навыка в публичное поле для UI
      return result.map((u) => ({
        ...u,
        skillPoints: u.skills![skill],
      }));
    }

    // Если навык не выбран — сортируем по общему рейтингу
    result.sort((a, b) => b.totalRate - a.totalRate);
    return result.map((u) => ({ ...u, skillPoints: null }));
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
