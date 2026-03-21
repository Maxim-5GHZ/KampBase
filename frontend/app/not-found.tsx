import Link from 'next/link';
import { Compass, TreeDeciduous, Code, ArrowLeft, Award } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-custom-bg-main flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
            <div className="bg-custom-bg-secondary rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
            {/* Декоративный элемент — ветка дерева навыков */}
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-secondary to-accent"></div>
            
            {/* Маскот-иконка с анимацией */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                <Compass size={80} className="text-primary animate-pulse" />
                <Code size={32} className="absolute -bottom-2 -right-2 text-secondary" />
                </div>
            </div>

            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-custom-main mb-4">Навык не найден</h2>
            
            <div className="flex justify-center items-center gap-2 mb-6">
                <TreeDeciduous className="text-custom-secondary" size={20} />
                <span className="text-custom-secondary">
                Похоже, ты пытаешься открыть неизвестную ветку дерева навыков.
                </span>
                <TreeDeciduous className="text-custom-secondary" size={20} />
            </div>

            <p className="text-custom-secondary mb-8">
                Этот URL ведёт в никуда. Но не расстраивайся — в нашем дереве ещё много непройденных тропинок!
            </p>

            {/* Прогресс-бар в стиле игры (0%) */}
            <div className="w-full bg-custom-bg-main rounded-full h-4 mb-6">
                <div className="bg-primary h-4 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-xs text-custom-secondary mb-8">Прогресс освоения этой страницы: 0%</p>

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile" className="btn btn-primary gap-2">
                <ArrowLeft size={18} />
                Прокачать реальные навыки
                </Link>
                <Link href="/wiki" className="btn btn-secondary gap-2">
                <Award size={18} />
                Почитать статьи
                </Link>
            </div>

            {/* Подсказка с примерами реальных маршрутов */}
            <div className="mt-8 text-sm text-custom-secondary border-t border-custom-secondary/20 pt-4">
                <p>
                Подсказка: может, ты хотел найти{' '}
                <span className="text-primary font-mono">/tasks</span> чтобы заработать XP?
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}