export default function Loading() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-custom-bg-secondary rounded-card p-6 flex flex-col shadow-2xs animate-pulse">
            {/* Заголовок (имитация одной строки) */}
            <div className="h-6 bg-custom-main/20 rounded w-3/4 mx-auto"></div>

            {/* Автор */}
            <div className="h-4 bg-custom-main/20 rounded w-1/2 mx-auto mt-1"></div>

            {/* Описание — три строки с правильным отступом сверху */}
            <div className="mt-4 space-y-2">
                <div className="h-3 bg-custom-secondary/20 rounded w-full"></div>
                <div className="h-3 bg-custom-secondary/20 rounded w-5/6"></div>
                <div className="h-3 bg-custom-secondary/20 rounded w-4/6"></div>
            </div>

            {/* Изображение */}
            <div className="w-auto h-40 bg-custom-secondary/10 rounded-2xl mt-3 mx-8"></div>

            {/* Нижняя строка: время, кнопка, звёзды */}
            <div className="flex justify-between items-center mt-4 mx-4">
                {/* Время чтения */}
                <div className="h-4 bg-custom-secondary/20 rounded w-16"></div>

                {/* Кнопка "Читать" */}
                <div className="h-10 bg-custom-accent/20 rounded-button w-28"></div>

                {/* Звезда и счётчик */}
                <div className="flex items-center gap-1">
                    {/* Иконка звезды (размер 24px → h-6 w-6) */}
                    <div className="h-6 w-6 bg-custom-accent/20 rounded-full"></div>
                    {/* Число (с mt-1 как в оригинале) */}
                    <div className="h-4 w-6 bg-custom-main/20 rounded mt-1"></div>
                </div>
            </div>
        </div>
    );
}