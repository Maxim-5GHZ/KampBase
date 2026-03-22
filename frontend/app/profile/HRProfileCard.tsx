"use client";

import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";

export default function HRProfileCard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setName(user.name || "Без имени");
      setLastName(user.lastName || "");
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-4xl bg-custom-bg-secondary gap-y-4 md:gap-y-8 min-h-[90vh]">
      <div className="mt-8 md:mt-16">
        <div className="flex justify-center mb-4">
          <User size={120} className="text-custom-accent" />
        </div>
        <h2 className="text-2xl font-bold text-center text-custom-main mb-1">
          {name} {lastName}
        </h2>
        <p className="text-center text-custom-secondary mb-4">HR</p>
      </div>

      <div className="mt-auto w-full pb-4 flex flex-col items-center">
        <button
          onClick={handleLogout}
          className="btn btn-secondary bg-transparent w-3/4 md:w-1/2 rounded-button flex items-center justify-center gap-2 text-custom-main"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </div>
    </div>
  );
}
