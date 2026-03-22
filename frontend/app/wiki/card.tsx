"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import Image from "next/image";

interface ArticleCardProps {
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  readTime: number;
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
  // Изначально ошибки нет (false)
  const [error, setError] = useState(false);

  // Путь к дефолтной картинке в папке public
  const fallbackImage = "/placeholder-image.jpg";

  // Если ссылка пустая или произошла ошибка загрузки - используем заглушку
  const finalImageSrc =
    error || !imageUrl || imageUrl.trim() === "" ? fallbackImage : imageUrl;

  return (
    <div className="bg-custom-bg-secondary rounded-card p-6 flex flex-col shadow-2xs h-full">
      <h3 className="text-custom-main text-center font-bold text-lg line-clamp-1">
        {title}
      </h3>
      <p className="text-custom-main text-center mt-1">{author}</p>
      <p className="text-custom-secondary text-start mt-2 line-clamp-3 flex-grow">
        {description}
      </p>

      <div className="relative w-full h-40 mt-3 rounded-2xl overflow-hidden">
        <Image
          src={finalImageSrc}
          alt={title}
          fill
          className="object-cover"
          onError={() => setError(true)}
          unoptimized // Полезно, если imageUrl ведет на внешние ресурсы типа GitHub
        />
      </div>

      <div className="flex justify-between items-center mt-4 px-2">
        <span className="text-custom-secondary text-sm">~{readTime} мин</span>

        <Link
          href={link}
          className="btn btn-primary font-normal px-6 py-1 rounded-button text-sm"
        >
          Читать
        </Link>

        <div className="flex items-center gap-1">
          <Star
            size={20}
            className={
              isStarred
                ? "text-custom-accent fill-current"
                : "text-custom-accent"
            }
          />
          <span className="text-custom-main text-sm">{starCount}</span>
        </div>
      </div>
    </div>
  );
}
