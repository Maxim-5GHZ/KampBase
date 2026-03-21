// test-back.ts
import { authService } from "./api/auth-service";
import { taskService } from "./api/task-service";
import { hrService } from "./api/hr-service";
import { skillService } from "./api/skill-service";
import { articleService } from "./api/article-service";
import { fileService } from "./api/file-services";
import { Role, ArticleFormat } from "./api/types";

// Утилиты для душного логирования
const logStep = (step: string) => {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`🚀 ЭТАП: ${step}`);
  console.log(`${"=".repeat(80)}`);
};

const logSuccess = (msg: string) => console.log(`  ✅ [УСПЕХ] ${msg}`);
const logInfo = (msg: string) => console.log(`  ℹ️ [ИНФО]  ${msg}`);
const logNerd = (msg: string) => console.log(`  🤓 [ASSERT] ${msg}`);

// Хелпер для проверки ожидаемых ошибок
async function expectError(
  promise: Promise<any>,
  expectedStatus: number,
  context: string,
) {
  try {
    await promise;
    throw new Error(
      `ОЖИДАЛАСЬ ОШИБКА ${expectedStatus}, НО ЗАПРОС ПРОШЕЛ УСПЕШНО! (${context})`,
    );
  } catch (error: any) {
    if (error.response && error.response.status === expectedStatus) {
      logSuccess(
        `Правильно отловлена ошибка ${expectedStatus} -> ${context}: ${error.response.data?.message || JSON.stringify(error.response.data)}`,
      );
    } else {
      throw error;
    }
  }
}

async function runPedanticTests() {
  const runId = Math.random().toString(36).substring(7);
  const password = "HardPassword!123";

  const users = {
    mentor: {
      username: `mentor_${runId}`,
      name: "Гендальф",
      lastName: "Белый",
      role: Role.MENTOR,
    },
    hr: {
      username: `hr_${runId}`,
      name: "Ольга",
      lastName: "Хант",
      role: Role.HR,
    },
    noobStudent: {
      username: `noob_${runId}`,
      name: "Вася",
      lastName: "Пупкин",
      role: Role.STUDENT,
    },
    proStudent: {
      username: `pro_${runId}`,
      name: "Джон",
      lastName: "Кармак",
      role: Role.STUDENT,
    },
  };

  try {
    logStep("0. ИНИЦИАЛИЗАЦИЯ: ПРОВЕРКА CORS И 405 (То, что ломалось!)");
    logInfo("Делаем запрос GET /api/articles без авторизации...");
    const initialArticles = await articleService.getAll();
    logSuccess(
      `GET /api/articles отработал успешно! Статей в базе: ${initialArticles.length}. 405 ошибка побеждена! 🎉`,
    );

    logStep("1. ИНИЦИАЛИЗАЦИЯ И РЕГИСТРАЦИЯ (AuthService)");
    for (const [key, user] of Object.entries(users)) {
      await authService.signup({ ...user, password });
      logSuccess(`Зарегистрирован ${key}: ${user.role} (${user.username})`);
    }

    logStep("2. СОЗДАНИЕ СТАТЬИ И ФАЙЛОВ (Article & File Service)");
    await authService.login({ username: users.mentor.username, password });

    const dummyContent = new Blob(["# Hello Java"], { type: "text/markdown" });
    const dummyFile = new File([dummyContent], "guide.md", {
      type: "text/markdown",
    });

    const article = await articleService.createWithFile(
      {
        title: "Гайд по Java Basics",
        about: "Для новичков",
        format: ArticleFormat.MD,
      },
      dummyFile,
    );
    logSuccess(`Статья создана! ID: ${article.id}, Link: ${article.link}`);

    // Проверяем получение одной статьи (тоже могло отваливаться)
    const fetchedArticle = await articleService.get(article.id);
    logSuccess(
      `GET /api/articles/${article.id} работает. Название: ${fetchedArticle.title}`,
    );

    logStep("3. СОЗДАНИЕ ЗАДАЧИ МЕНТОРОМ (TaskService)");
    const task = await taskService.createTask({
      title: "Написать Spring Boot CRUD",
      about: "Сделай контроллеры и сервисы",
      githubLink: "https://github.com/test/repo",
      skillName: "Java",
    });
    const globalTaskId = task.id;
    logSuccess(`Задача создана! ID: ${globalTaskId}, Требуемый навык: Java`);

    logStep("4. ПРОВЕРКА МЕХАНИКИ #1: ЖЕСТКАЯ БЛОКИРОВКА БЕЗ ПЕРКОВ");
    await authService.login({ username: users.noobStudent.username, password });

    logInfo("Пытаемся отправить решение без открытого перка 'java-basics'...");
    await expectError(
      taskService.submitSolution(globalTaskId, { commitHash: "commit-111" }),
      400,
      "Запрет на решение без базового перка",
    );

    logInfo("Открываем базовый перк...");
    await skillService.unlockPerk("java-basics");
    const noobSubmit = await taskService.submitSolution(globalTaskId, {
      commitHash: "commit-111",
    });
    const noobSolutionId = noobSubmit.solutionId;
    logSuccess(
      "Решение Noob-студента успешно отправлено после прокачки перка!",
    );

    logStep("5. ПРОВЕРКА МЕХАНИКИ #2: ДЕРЕВО НАВЫКОВ И ЗАВИСИМОСТИ");
    const proLogin = await authService.login({
      username: users.proStudent.username,
      password,
    });

    await skillService.unlockPerk("java-basics");
    await skillService.unlockPerk("java-exp"); // Даст +10% EXP

    const proSubmit = await taskService.submitSolution(globalTaskId, {
      commitHash: "commit-999",
    });
    const proSolutionId = proSubmit.solutionId;
    logSuccess(
      "Решение Pro-студента отправлено (у него есть перк на +10% EXP).",
    );

    logStep("6. ПРОВЕРКА ЗАДАНИЙ И БОНУСНЫХ МНОЖИТЕЛЕЙ (Role.MENTOR)");
    await authService.login({ username: users.mentor.username, password });

    const reviewNoob = await taskService.reviewSolution(noobSolutionId, {
      isApproved: true,
      rating: 100,
    });
    logNerd(
      `Оценено решение Noob. Назначено: 100. Получено: ${reviewNoob.receivedRating} XP.`,
    );
    if (reviewNoob.receivedRating !== 100)
      throw new Error("Математика сломалась для Noob!");

    const reviewPro = await taskService.reviewSolution(proSolutionId, {
      isApproved: true,
      rating: 100,
    });
    logNerd(
      `Оценено решение Pro. Назначено: 100. Получено: ${reviewPro.receivedRating} XP. (Сработал перк java-exp!)`,
    );
    if (reviewPro.receivedRating !== 110)
      throw new Error("Бонус от перка не сработал!");

    logStep("7. ТОТАЛЬНАЯ ПРОВЕРКА ЛИДЕРБОРДА (GET /api/hr/leaderboard)");
    await authService.login({ username: users.noobStudent.username, password });

    const leaderboardGeneral = await hrService.getLeaderboard();
    logSuccess(
      `Общий лидерборд загружен! Участников: ${leaderboardGeneral.length}`,
    );
    console.table(
      leaderboardGeneral
        .filter((u) => u.username.includes(runId))
        .map((u) => ({
          User: u.username,
          TotalXP: u.totalRate,
        })),
    );

    logInfo("Проверяем лидерборд ПО КОНКРЕТНОМУ НАВЫКУ (Java)...");
    const leaderboardJava = await hrService.getLeaderboard("Java");
    logSuccess(
      `Лидерборд по Java загружен! Участников: ${leaderboardJava.length}`,
    );
    console.table(
      leaderboardJava
        .filter((u) => u.username.includes(runId))
        .map((u) => ({
          User: u.username,
          JavaXP: u.skillPoints,
        })),
    );

    logStep("🎉 ФИНАЛ: ТЕПЕРЬ ТОЧНО РАБОТАЕТ ВООБЩЕ ВСЁ!");
  } catch (error: any) {
    console.error(`\n❌ ТЕСТ УПАЛ С ОШИБКОЙ!`);
    console.error("Детали:", error.response?.data || error.message);
  }
}

runPedanticTests();
