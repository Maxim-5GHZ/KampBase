"use client"

import { useState } from 'react';
import { Users } from 'lucide-react';

type TaskCardProps = {
    title: string;
    studentsCount: number;
    description: string;
};

const TaskCard = ({ title, studentsCount, description }: TaskCardProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="p-4 sm:p-6 bg-custom-bg-secondary rounded-card shadow-2xs">
            {/* Заголовок задания */}
            <h2 className="xl:h-[2lh] text-lg sm:text-xl font-bold text-custom-main mb-2 text-center">
                {title}
            </h2>

            {/* Информация о выполнении */}
            <div className="flex items-center justify-center gap-2 mb-3">
                <Users size={20} className="w-5 h-5 text-custom-accent" />
                <span className="text-sm sm:text-base text-custom-main">
                    Выполнение: {studentsCount} студентов
                </span>
            </div>

            {/* Описание задания */}
            <p className="xl:h-[3lh] text-custom-secondary mb-4 line-clamp-3 text-sm sm:text-base">
                {description}
            </p>

            {/* Drag & drop область */}
            <label
                className="block border border-dashed border-custom-main rounded-2xl p-4 sm:p-6 mb-4 cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="text-center text-custom-main font-medium mb-2 text-sm sm:text-base">
                    Прикреплённые файлы
                </div>
                {files.length > 0 ? (
                    <ul className="text-custom-main text-xs sm:text-sm">
                        {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-custom-secondary text-xs sm:text-sm">
                        Перетащите файлы или кликните, чтобы выбрать
                    </p>
                )}
            </label>

            {/* Контейнер для кнопок: вертикально на мобильных, горизонтально на больших */}
            <div className="flex flex-col 2xl:flex-row gap-2">
                {/* НЕ РЕАЛИЗОВАННОЕ РЕДАКТИРОВАНИЕ <button className="flex-1 btn btn-secondary rounded-button shadow-none px-4 py-2 text-sm sm:text-base">
                    Редактировать
                </button>
                */}
                <button className="flex-1 btn btn-primary rounded-button shadow-none px-4 py-2 text-sm sm:text-base">
                    Наградить
                </button>
            </div>
        </div>
    );
};

export default TaskCard;