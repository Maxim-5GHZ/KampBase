import TaskCard from './TaskCard';

// Данные-заглушки
const mockTasks = [
    {
        id: 1,
        title: 'Задание 1: Основы React',
        studentsCount: 18,
        description: 'Создать простое приложение на React с использованием компонентов и состояния.',
    },
    {
        id: 2,
        title: 'Задание 2: Хуки',
        studentsCount: 12,
        description: 'Разработать компонент, использующий useState и useEffect для загрузки данных.',
    },
    {
        id: 3,
        title: 'Задание 3: Маршрутизация',
        studentsCount: 9,
        description: 'Реализовать навигацию между страницами с помощью React Router.',
    },
    {
        id: 4,
        title: 'Задание 4: Работа с формами',
        studentsCount: 21,
        description: 'Создать форму с валидацией и отправкой данных.',
    },
    {
        id: 5,
        title: 'Задание 5: Redux Toolkit',
        studentsCount: 15,
        description: 'Подключить Redux Toolkit и управлять глобальным состоянием.',
    },
    {
        id: 6,
        title: 'Задание 6: Стилизация',
        studentsCount: 24,
        description: 'Оформить приложение с использованием Tailwind CSS и daisyUI.',
    },
];

export default function WorkArea() {
    return (
        <div className="p-4">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
                Ваши задания
            </h2>
            {/* Сетка: 1 колонка на мобильных, 3 колонки на md и выше; отступы адаптивны */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-x-16 lg:gap-y-6">
                {mockTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        title={task.title}
                        studentsCount={task.studentsCount}
                        description={task.description}
                    />
                ))}
            </div>
        </div>
    );
}