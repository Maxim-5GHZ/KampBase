'use client';

import { useEffect, useState } from 'react';
import HRProfileCard from './HRProfileCard';
import HRWorkArea from './HRWorkArea';
import { articleService } from '../utils/article-service';
import { Article } from '../utils/types';
import MyArticles from './MyArticles';

export default function HRProfile() {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await articleService.getAll();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await articleService.delete(id);
      fetchArticles();
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
        <HRProfileCard />
      </div>
      <div className="flex-1">
        <HRWorkArea />
        <MyArticles articles={articles} onDelete={handleDeleteArticle} />
      </div>
    </div>
  );
}