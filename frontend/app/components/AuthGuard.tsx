"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/app/utils/auth-service";

// ДОБАВЛЕН "/": теперь главная страница доступна всем
const publicRoutes = ["/", "/login", "/registration", "/forgot-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuth && !isPublicRoute) {
      router.replace("/login");
    } else if (
      isAuth &&
      (pathname === "/login" || pathname === "/registration")
    ) {
      // Если авторизован, не пускаем только на логин/регу (на главную можно)
      router.replace("/profile");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg-main">
        <span className="loading loading-spinner loading-lg text-custom-accent"></span>
      </div>
    );
  }

  return <>{children}</>;
}
