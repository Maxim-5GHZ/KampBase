import Link from "next/link";
import { Compass, BookOpen, Trophy, Code, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-custom-bg-main flex flex-col items-center justify-center overflow-hidden relative">
      {/* Декоративный фон */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-custom-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl px-6 py-20 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-custom-bg-secondary border border-custom-secondary/20 mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-custom-accent animate-pulse"></span>
          <span className="text-sm font-medium text-custom-main">
            Платформа для развития навыков
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-custom-main mb-6 tracking-tight">
          Прокачай себя с <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-custom-accent to-primary">
            СтудБаза
          </span>
        </h1>

        <p className="text-lg md:text-xl text-custom-secondary mb-12 max-w-2xl mx-auto">
          Выполняй задания от менторов, читай полезные статьи в Wiki, открывай
          новые навыки в дереве прокачки и стань лучшим в рейтинге.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/registration"
            className="btn btn-primary rounded-button px-8 py-3 text-lg flex items-center gap-2 w-full sm:w-auto"
          >
            Начать сейчас <ArrowRight size={20} />
          </Link>
          <Link
            href="/login"
            className="btn btn-secondary rounded-button px-8 py-3 text-lg w-full sm:w-auto"
          >
            Уже есть аккаунт
          </Link>
        </div>

        {/* Карточки фичей */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-custom-bg-secondary p-6 rounded-3xl border border-custom-secondary/10 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Code size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-custom-main mb-2">
              Реальные задачи
            </h3>
            <p className="text-custom-secondary">
              Решай таски, отправляй пулл-реквесты и получай фидбек от опытных
              менторов.
            </p>
          </div>

          <div className="bg-custom-bg-secondary p-6 rounded-3xl border border-custom-secondary/10 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-custom-accent/10 flex items-center justify-center mb-4">
              <Compass size={24} className="text-custom-accent" />
            </div>
            <h3 className="text-xl font-bold text-custom-main mb-2">
              Дерево навыков
            </h3>
            <p className="text-custom-secondary">
              Наглядно отслеживай свой прогресс. Каждая решенная задача
              открывает новые горизонты.
            </p>
          </div>

          <div className="bg-custom-bg-secondary p-6 rounded-3xl border border-custom-secondary/10 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
              <Trophy size={24} className="text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-custom-main mb-2">
              Топ студентов
            </h3>
            <p className="text-custom-secondary">
              Участвуй в рейтинге. Лучшие студенты получают приглашения от
              HR-специалистов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
