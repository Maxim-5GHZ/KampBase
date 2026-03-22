"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";

import StudentProfile from "./StudentProfile";
import MentorProfile from "./MentorProfile";
import HRProfile from "./HRProfile";

export default function ProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    // Извлекаем первую роль пользователя (например, "ROLE_MENTOR" или "MENTOR")
    const userRole = user.roles?.[0] || "";
    setRole(userRole);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg-main">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  // Рендерим нужный профиль в зависимости от роли
  if (role?.includes("MENTOR")) return <MentorProfile />;
  if (role?.includes("HR")) return <HRProfile />;

  // По умолчанию показываем профиль студента
  return <StudentProfile />;
}
