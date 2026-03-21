import { User, Users, ClipboardList } from "lucide-react"

type MentorData = {
    firstName: string;
    lastName: string;
    tasksCount: number;
    studentsCount: number;
    tasks: {
        id: string;
        title: string;
        completionPercent: number;
        participatingStudents: number;
    }[];
};

export default function MentorProfileCard() {
    // Заглушка
    const mentorData: MentorData = {
        firstName: 'Павел',
        lastName: 'Павлович',
        tasksCount: 5,
        studentsCount: 65,
        tasks: [
            {
                id: '1',
                title: 'Задание 1',
                completionPercent: 54,
                participatingStudents: 35,
            },
            {
                id: '2',
                title: 'Задание 2',
                completionPercent: 72,
                participatingStudents: 28,
            },
        ],
    };

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
                    {mentorData.firstName} {mentorData.lastName}
                </h2>

                {/* Статус "Ментор" */}
                <p className="text-center text-custom-secondary mb-4">Ментор</p>
            </div>

            {/* Статистика */}
            <div>
                {/* Количество заданий */}
                <div className="flex items-center gap-2 mb-2">
                    <ClipboardList size={20} className="text-custom-accent" />
                    <span className="text-custom-main">
                        Количество заданий: {mentorData.tasksCount}
                    </span>
                </div>

                {/* Количество студентов */}
                <div className="flex items-center gap-2 mb-6">
                    <Users size={20} className="text-custom-accent" />
                    <span className="text-custom-main">
                        Количество студентов: {mentorData.studentsCount}
                    </span>
                </div>
            </div>

            {/* Блок заданий */}
            <div className="flex flex-col gap-y-2 mb-8 md:mb-16">
                <h3 className="text-2xl font-semibold text-custom-main mb-2">Задания</h3>

                {/* Задания */}
                {mentorData.tasks.map((task) => (
                    <div key={task.id} className="mb-3">
                        <p className="text-custom-main font-medium">{task.title}</p>
                        <p className="text-custom-secondary text-sm">
                            Процент выполнения {task.completionPercent}%
                        </p>
                        <p className="text-custom-secondary text-sm">
                            Количество участвующих студентов {task.participatingStudents}
                        </p>
                    </div>
                ))}

                {/* Кнопка "Все задания..." */}
                <button className="self-center btn btn-secondary w-3/4 md:w-1/2 rounded-button">
                    Все задания...
                </button>
            </div>
        </div>
    );
}