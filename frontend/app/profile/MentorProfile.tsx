'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import MentorProfileCard from './MentorProfileCard';
import WorkArea from './MentorWorkArea';
import { taskService } from '@/app/utils/task-service';
import { articleService } from '@/app/utils/article-service';
import { Article, ArticleRequest, ArticleFormat, TaskRequest, Task } from '@/app/utils/types';
import { authService } from '../utils/auth-service';
import MyArticles from "./MyArticles";

export default function MentorProfile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [errorTasks, setErrorTasks] = useState<string | null>(null);
    const [formData, setFormData] = useState<TaskRequest>({
        title: '',
        about: '',
        githubLink: '',
        skillName: 'Java',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);

    const fetchArticles = async () => {
        try {
            const fetchedArticles = await articleService.getAll();
            setArticles(fetchedArticles);
        } catch (error) {
            console.error("Ошибка при загрузке статей:", error);
        }
    };

    const handleDeleteArticle = async (id: number) => {
        try {
            await articleService.delete(id);
            fetchArticles();
        } catch (error) {
            console.error("Ошибка при удалении статьи:", error);
        }
    };

    const fetchTasks = async () => {
        try {
        setLoadingTasks(true);
        const allTasks = await taskService.getAllTasks();
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            setErrorTasks('Пользователь не авторизован');
            return;
        }
        const mentorTasks = allTasks.filter(
            (task) => task.author.userId === currentUser.id
        );
        setTasks(mentorTasks);
        setErrorTasks(null);
        } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setErrorTasks('Не удалось загрузить задания');
        } finally {
        setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchArticles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
        await taskService.createTask(formData);
        setIsModalOpen(false);
        setFormData({ title: '', about: '', githubLink: '', skillName: 'Java' });
        await fetchTasks();
        } catch (error) {
        console.error('Ошибка при создании задания:', error);
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
        <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
            <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
            <MentorProfileCard />
            </div>
            <div className="flex-1">
            <WorkArea tasks={tasks} loading={loadingTasks} error={errorTasks}/>
            <MyArticles articles={articles} onDelete={handleDeleteArticle} />
            </div>
        </div>

        {!isModalOpen && (
            <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-4 right-4 btn btn-primary rounded-full shadow-lg flex items-center gap-2 z-50"
            >
            <Plus size={20} />
            <span className="hidden sm:inline">Создать задание</span>
            </button>
        )}

        {isModalOpen && (
            <div className="backdrop-blur-sm fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-custom-bg-main rounded-4xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b border-custom-secondary">
                <h2 className="text-xl font-semibold text-custom-main">Создать задание</h2>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-custom-secondary hover:text-custom-main"
                >
                    <X size={24} className='cursor-pointer'/>
                </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-custom-main mb-1">
                    Название задания
                    </label>
                    <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full input input-bordered bg-custom-bg-secondary text-custom-main"
                    />
                </div>

                <div>
                    <label htmlFor="about" className="block text-custom-main mb-1">
                    Описание
                    </label>
                    <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    className="w-full textarea textarea-bordered bg-custom-bg-secondary text-custom-main"
                    />
                </div>

                <div>
                    <label htmlFor="githubLink" className="block text-custom-main mb-1">
                    Ссылка на GitHub
                    </label>
                    <input
                    type="url"
                    id="githubLink"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    required
                    className="w-full input input-bordered bg-custom-bg-secondary text-custom-main"
                    />
                </div>

                <div>
                    <label htmlFor="skillName" className="block text-custom-main mb-1">
                    Навык
                    </label>
                    <select
                    id="skillName"
                    name="skillName"
                    value={formData.skillName}
                    onChange={handleInputChange}
                    required
                    className="w-full select select-bordered bg-custom-bg-main text-custom-main"
                    >
                    <option value="Java">Java</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="SQL">SQL</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary rounded-button"
                    >
                    Отмена
                    </button>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary rounded-button"
                    >
                    {isSubmitting ? 'Создание...' : 'Создать'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </>
    );
}