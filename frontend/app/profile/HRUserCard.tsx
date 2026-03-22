import { User, Mail } from "lucide-react";
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
      setError("Не удалось удалить из избранного");
      console.error(err);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-custom-bg-secondary rounded-card shadow-2xs text-center flex flex-col">
      <div className="flex justify-center mb-4 mt-2">
        <User size={56} className="text-custom-accent" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-custom-main mb-2">
        {user.name} {user.lastName}
      </h2>
      <div className="flex items-center justify-center gap-2 text-sm text-custom-secondary mb-6">
        <Mail size={16} />
        <a
          href={`mailto:${email}`}
          className="hover:text-custom-main transition"
        >
          {email}
        </a>
      </div>

      <div className="mt-auto">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          className="btn btn-secondary rounded-button w-full"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? "Удаление..." : "Убрать из избранного"}
        </button>
      </div>
    </div>
  );
}
