'use client';

import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import StudentProfileCard from './StudentProfileCard';
import WorkArea from './StudentWorkArea';
import { nodes } from './_tree/data';
import { articleService } from '@/app/utils/article-service';
import { Article, ArticleRequest, ArticleFormat } from '@/app/utils/types';
import MyArticles from "./MyArticles";

export default function StudentProfile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<ArticleRequest, 'link'>>({
        title: '',
        about: '',
        format: ArticleFormat.MD,
        previewPhotoLink: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Пожалуйста, выберите файл для загрузки');
            return;
        }

        setIsSubmitting(true);
        try {
            await articleService.createWithFile(formData, selectedFile);
            setIsModalOpen(false);
            setFormData({
                title: '',
                about: '',
                format: ArticleFormat.MD,
                previewPhotoLink: '',
            });
            setSelectedFile(null);
            fetchArticles();
        } catch (error) {
            console.error('Ошибка при создании статьи:', error);
            alert('Не удалось создать статью');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
                <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
                    <StudentProfileCard />
                </div>
                <div className="flex-1">
                    <WorkArea nodes={nodes} skillPoints={3} />
                    <MyArticles articles={articles} onDelete={handleDeleteArticle} />
                </div>
            </div>

            {!isModalOpen && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-8 right-8 btn btn-primary rounded-button shadow-lg flex items-center gap-2 z-50"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Добавить статью</span>
                </button>
            )}

            {isModalOpen && (
                <div className="backdrop-blur-sm fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8">
                    <div className="bg-custom-bg-main rounded-4xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b border-custom-secondary">
                            <h2 className="text-xl font-semibold text-custom-main">Добавить статью</h2>
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
                                    Заголовок
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
                                <label htmlFor="format" className="block text-custom-main mb-1">
                                    Формат
                                </label>
                                <select
                                    id="format"
                                    name="format"
                                    value={formData.format}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full select select-bordered bg-custom-bg-main text-custom-main cursor-pointer"
                                >
                                    <option value={ArticleFormat.MD}>.md</option>
                                    <option value={ArticleFormat.PDF}>.pdf</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="file" className="block text-custom-main mb-1">
                                    Файл статьи
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={handleFileChange}
                                    required
                                    className="w-full file-input file-input-primary file-input-bordered bg-custom-bg-secondary text-custom-main"
                                />
                                <p className="text-xs text-custom-secondary mt-1">
                                    Поддерживаемые форматы: .md, .pdf (в зависимости от выбранного формата)
                                </p>
                            </div>

                            <div>
                                <label htmlFor="previewPhotoLink" className="block text-custom-main mb-1">
                                    Ссылка на превью (опционально)
                                </label>
                                <input
                                    type="url"
                                    id="previewPhotoLink"
                                    name="previewPhotoLink"
                                    value={formData.previewPhotoLink}
                                    onChange={handleInputChange}
                                    className="w-full input input-bordered bg-custom-bg-secondary text-custom-main"
                                />
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
                                    {isSubmitting ? 'Загрузка...' : 'Добавить статью'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}