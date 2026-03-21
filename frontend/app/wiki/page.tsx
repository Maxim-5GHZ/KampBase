import ArticleCard from './card';
import { articleService } from '@/app/utils/article-service';
import { Article as ApiArticle } from '@/app/utils/types';

interface CardArticle {
    title: string;
    author: string;
    description: string;
    imageUrl: string;
    readTime: number;
    link: string;
    starCount: number;
    isStarred: boolean;
}

export default async function Wiki() {
    // Artificial delay for loading.tsx demonstration
    await new Promise(resolve => setTimeout(resolve, 300));

    let articles: CardArticle[] = [];
    let error = null;

    try {
        const data = await articleService.getAll();
        articles = data.map((article: ApiArticle) => ({
        title: article.title,
        author: article.author,
        description: article.about,
        imageUrl: article.previewPhotoLink || '/placeholder-image.jpg',
        readTime: 5,
        link: article.link,
        starCount: article.starCount,
        isStarred: false,
        }));
    } catch (err) {
        console.log()
        console.error('Failed to load articles:', err);
        error = 'Не удалось загрузить статьи';
    }

    if (error) {
        return (
        <div className="container mx-auto py-8 px-4 text-center text-red-500">
            {error}
        </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
            ))}
        </div>
        </div>
    );
}