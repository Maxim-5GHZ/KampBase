import { useEffect, useState } from 'react';
import HRUserCard from './HRUserCard';
import { hrService } from '../utils/hr-service';
import { UserShortInfo } from '../utils/types';

export default function HRWorkArea() {
    const [users, setUsers] = useState<UserShortInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const favorites = await hrService.getFavorites();
                setUsers(favorites);
                setError(null);
            } catch (err) {
                console.error('Failed to load favorites:', err);
                setError('Не удалось загрузить список сотрудников');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemove = async (userId: number) => {
        try {
            await hrService.removeFavorite(userId);
            setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
        } catch (err) {
            console.error('Failed to remove favorite:', err);
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
                Студенты
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-x-16 lg:gap-y-8">
                {users.map((user) => (
                    <HRUserCard key={user.userId} user={user} onRemove={handleRemove} />
                ))}
            </div>
        </div>
    );
}