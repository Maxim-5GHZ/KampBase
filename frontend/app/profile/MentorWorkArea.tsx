'use client';

import TaskCard from './MentorTaskCard';
import { Task } from '@/app/utils/types';

interface WorkAreaProps {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

export default function WorkArea({ tasks, loading, error }: WorkAreaProps) {
    if (loading) {
        return (
        <div className="p-4 flex justify-center items-center">
            <span className="loading loading-spinner loading-lg text-custom-accent"></span>
        </div>
        );
    }

    if (error) {
        return (
        <div className="p-4 text-center text-red-500">
            {error}
        </div>
        );
    }

    return (
        <div className="p-4">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
            Ваши задания
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-x-16 lg:gap-y-6">
            {tasks.map((task) => (
            <TaskCard
                key={task.id}
                title={task.title}
                studentsCount={0}
                description={task.about}
            />
            ))}
        </div>
        </div>
    );
}