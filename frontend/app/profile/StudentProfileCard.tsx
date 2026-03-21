import { User, Star, Award } from "lucide-react";

type StudentData = {
    firstName: string;
    lastName: string;
    university: string;
    stars: number;
    level: number;
    xp: number;
    maxXp: number;
    achievements: {
        id: string;
        name: string;
    }[];
};

export default function StudentProfileCard() {
    // Заглушка
    const studentData: StudentData = {
        firstName: "Иван",
        lastName: "Иванович",
        university: "КФ МГТУ им. Н.Э. Баумана",
        stars: 1250,
        level: 15,
        xp: 2565,
        maxXp: 8600,
        achievements: [
        { id: "1", name: "Достижение 1" },
        { id: "2", name: "Достижение 2" },
        { id: "3", name: "Достижение 3" },
        { id: "4", name: "Достижение 4" },
        ],
    };

    const progressPercent = (studentData.xp / studentData.maxXp) * 100;

    return (
        <div className="flex flex-col items-center p-4 rounded-4xl bg-custom-bg-secondary gap-y-4 md:gap-y-8">
        {/* Шапка */}
        <div className="mt-8 md:mt-16">
            {/* Аватарка */}
            <div className="flex justify-center mb-4">
            <User size={120} className="text-custom-accent" />
            </div>

            {/* Имя и отчество */}
            <h2 className="text-2xl font-bold text-center text-custom-main mb-1">
            {studentData.firstName} {studentData.lastName}
            </h2>

            {/* Университет */}
            <p className="text-center text-custom-secondary mb-4">
            {studentData.university}
            </p>

            {/* Строка со звёздами и уровнем */}
            <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
                <Star size={20} className="text-custom-accent" />
                <span className="text-custom-main">{studentData.stars}</span>
            </div>
            <div className="flex items-center gap-2">
                <Award size={20} className="text-custom-accent" />
                <span className="text-custom-main">{studentData.level}</span>
            </div>
            </div>

            {/* Прогресс-бар */}
            <div className="w-full max-w-xs mx-auto mb-2">
                <div className="w-full h-4 bg-custom-secondary rounded-full overflow-hidden">
                    <div
                    className="h-full bg-custom-accent rounded-full"
                    style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Текст XP */}
            <p className="text-center text-custom-secondary text-sm">
            {studentData.xp} / {studentData.maxXp}
            </p>
        </div>

        {/* Блок достижений */}
        <div className="flex flex-col items-center w-full mb-8 md:mb-16">
            <h3 className="text-2xl font-semibold text-custom-main mb-4">
            Достижения
            </h3>

            {/* Сетка достижений */}
            <div className="flex flex-wrap justify-center gap-6 mb-6">
            {studentData.achievements.map((ach) => (
                <div key={ach.id} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-custom-accent flex items-center justify-center text-white text-2xl font-bold mb-2">
                    Д
                </div>
                <span className="text-custom-main text-sm text-center">
                    {ach.name}
                </span>
                </div>
            ))}
            </div>

            {/* Кнопка "Все достижения..." */}
            <button className="btn btn-secondary w-3/4 md:w-1/2 rounded-button">
            Все достижения...
            </button>
        </div>
        </div>
    );
}