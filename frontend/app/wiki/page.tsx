import ArticleCard from './card';

interface Article {
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
    //Заглушка
    const articles = await getArticles();
    
    return (
            <div className="container mx-auto py-8 px-4">
                {/* Сетка: 1 колонка на мобильных, 2 на планшетах, 3 на десктопах */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                    <ArticleCard key={index} {...article} />
                    ))}
                </div>
            </div>
    );
};

async function getArticles(): Promise<Article[]> {
    // Искусственная задержка 500 мс
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
        {
        title: 'Как поднять Docker',
        author: 'Иван Петров',
        description: 'Пошаговое руководство по установке и настройке Docker на вашем компьютере.',
        imageUrl: '/images/docker.jpg',
        readTime: 7,
        link: '/wiki/docker',
        starCount: 42,
        isStarred: false,
        },
        {
        title: 'Основы Next.js',
        author: 'Анна Смирнова',
        description: 'Изучите основы Next.js и создайте ваше первое приложение.',
        imageUrl: '/images/nextjs.jpg',
        readTime: 10,
        link: '/wiki/nextjs',
        starCount: 128,
        isStarred: true,
        },
        {
        title: 'TailwindCSS советы',
        author: 'Дмитрий Сидоров',
        description: 'Полезные советы и трюки для эффективной работы с TailwindCSS.',
        imageUrl: '/images/tailwind.jpg',
        readTime: 5,
        link: '/wiki/tailwind',
        starCount: 89,
        isStarred: false,
        },
        {
        title: 'Как поднять Docker',
        author: 'Иван Петров',
        description: 'Пошаговое руководство по установке и настройке Docker на вашем компьютере.',
        imageUrl: '/images/docker.jpg',
        readTime: 7,
        link: '/wiki/docker',
        starCount: 42,
        isStarred: false,
        },
        {
        title: 'Основы Next.js',
        author: 'Анна Смирнова',
        description: 'Изучите основы Next.js и создайте ваше первое приложение.',
        imageUrl: '/images/nextjs.jpg',
        readTime: 10,
        link: '/wiki/nextjs',
        starCount: 128,
        isStarred: true,
        },
        {
        title: 'TailwindCSS советы',
        author: 'Дмитрий Сидоров',
        description: 'Полезные советы и трюки для эффективной работы с TailwindCSS.',
        imageUrl: '/images/tailwind.jpg',
        readTime: 5,
        link: '/wiki/tailwind',
        starCount: 89,
        isStarred: false,
        },
    ];
}