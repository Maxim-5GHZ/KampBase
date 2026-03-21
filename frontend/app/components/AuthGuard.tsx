// frontend/app/components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/app/utils/auth-service";

// Список маршрутов, доступных без авторизации
const publicRoutes = ["/login", "/registration", "/forgot-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Проверяем, авторизован ли юзер (есть ли токен в localStorage)
    const isAuth = authService.isAuthenticated();
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuth && !isPublicRoute) {
      // Если не авторизован и лезет на закрытую страницу -> на логин
      router.replace("/login");
    } else if (isAuth && isPublicRoute) {
      // Если авторизован и лезет на логин/регистрацию -> кидаем в профиль
      router.replace("/profile");
    } else {
      // Всё ок, разрешаем рендер
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Пока идет проверка (доли секунды), показываем лоадер,
  // чтобы юзер не увидел "моргание" закрытой страницы
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg-main">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  return <>{children}</>;
}
