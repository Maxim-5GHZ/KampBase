import { Star } from "lucide-react";

const TaskCardSkeleton = () => {
    return (
        <div className="p-4 sm:p-6 bg-custom-bg-secondary rounded-card shadow-2xs animate-pulse">
            {/* Title */}
            <div className="h-[2lh] bg-custom-secondary rounded mb-6 mx-auto w-3/4"></div>

            {/* Difficulty */}
            <div className="flex justify-center items-center gap-2 mb-3">
                <div className="h-4 bg-custom-secondary rounded w-16"></div>
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-custom-secondary" />
                    ))}
                </div>
            </div>

            {/* Description (3 lines) */}
            <div className="space-y-2 mb-6">
                <div className="h-4 bg-custom-secondary rounded w-full"></div>
                <div className="h-4 bg-custom-secondary rounded w-5/6"></div>
                <div className="h-4 bg-custom-secondary rounded w-4/6"></div>
            </div>

            {/* Attached files placeholder */}
            <div className="border border-dashed border-custom-main rounded-2xl p-4 sm:p-6 mb-6">
                <div className="h-4 bg-custom-secondary rounded w-32 mx-auto mb-4"></div>
                <div className="h-4 bg-custom-secondary rounded w-40 mx-auto"></div>
            </div>

            {/* Button + reward */}
            <div className="flex justify-between items-center gap-4">
                <div className="h-10 bg-custom-secondary rounded-button w-24"></div>
                <div className="flex items-center gap-1">
                    <div className="h-4 bg-custom-secondary rounded w-12"></div>
                    <div className="h-4 bg-custom-secondary rounded w-8"></div>
                    <Star size={16} className="text-custom-accent" />
                </div>
            </div>
        </div>
    );
};

export default TaskCardSkeleton;