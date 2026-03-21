import { User } from "lucide-react";
import { useState } from "react";

export interface UserShortInfo {
    userId: number;
    username: string;
    name: string;
    lastName: string;
}

interface HRUserCardProps {
    user: UserShortInfo;
    onRemove: (userId: number) => Promise<void>;
}

export default function HRUserCard({ user, onRemove }: HRUserCardProps) {
    const email = user.username;
    const [isRemoving, setIsRemoving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRemove = async () => {
        setIsRemoving(true);
        setError(null);
        try {
            await onRemove(user.userId);
        } catch (err) {
            setError('Не удалось удалить из избранного');
            console.error(err);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-custom-bg-secondary rounded-card shadow-2xs text-center">
            <div className="flex justify-center mb-4">
                <User size={48} className="text-custom-accent" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-custom-main mb-1">
                {user.name} {user.lastName}
            </h2>
            <p className="text-sm sm:text-base text-custom-secondary mb-4">
                {email}
            </p>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button 
                className="btn btn-primary rounded-button"
                onClick={handleRemove}
                disabled={isRemoving}
            >
                {isRemoving ? 'Удаление...' : 'Убрать из избранного'}
            </button>
        </div>
    );
}