// frontend/app/components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/app/utils/auth-service";

const publicRoutes = ["/", "/login", "/registration", "/forgot-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Сообщаем, что клиентская часть готова

    const isAuth = authService.isAuthenticated();
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuth && !isPublicRoute) {
      router.replace("/login");
    } else if (
      isAuth &&
      (pathname === "/login" || pathname === "/registration")
    ) {
      router.replace("/profile");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Пока компонент не смонтирован или идет проверка - показываем один и тот же спиннер
  // Это предотвращает Hydration Error
  if (!mounted || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg-main">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  return <>{children}</>;
}
