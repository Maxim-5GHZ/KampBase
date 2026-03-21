"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ArticleCardProps {
    title: string;
    author: string;
    description: string;
    imageUrl: string;
    readTime: number; // минуты
    link: string;
    starCount: number;
    isStarred: boolean;
}

export default function ArticleCard({
    title,
    author,
    description,
    imageUrl,
    readTime,
    link,
    starCount,
    isStarred,
}: ArticleCardProps) {
    const [error, setError] = useState(true);
    console.log("Drawing card");

    return (
        <div className="bg-custom-bg-secondary rounded-card p-6 flex flex-col shadow-2xs">
        {/* Название по центру */}
        <h3 className="text-custom-main text-center font-bold text-lg">{title}</h3>

        {/* Автор по центру */}
        <p className="text-custom-main text-center mt-1">{author}</p>

        {/* Короткое описание (слева) */}
        <p className="text-custom-secondary text-start mt-2">{description}</p>

        {/* Картинка */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {error ? (
            <div className="bg-custom-bg-secondary w-auto h-40 mt-3 mx-8 rounded-2xl flex items-center justify-center">
                <span>Нет фото</span>
            </div>
            ) : (
            <Image
                src={imageUrl}
                alt={""}
                width={400}
                height={160}
                className="w-full h-40 object-cover mt-3 rounded"
                onError={() => setError(true)}
            />
        )}

        {/* Нижняя строка: время, кнопка, звёзды */}
        <div className="flex justify-between items-center mt-4 mx-4">
            {/* Время чтения */}
            <span className="text-custom-secondary">~{readTime} мин</span>

            {/* Кнопка "Читать" */}
            <Link
            href={link}
            className="btn btn-primary font-normal px-8 py-1 rounded-button"
            >
            Читать
            </Link>

            {/* Звезда и количество */}
            <div className="flex items-center gap-1">
            <Star
                size={24}
                className={isStarred ? 'text-custom-accent fill-current' : 'text-custom-accent'}
                fill={isStarred ? 'currentColor' : 'none'}
            />
            <span className="text-custom-main mt-1">{starCount}</span>
            </div>
        </div>
        </div>
    );
}