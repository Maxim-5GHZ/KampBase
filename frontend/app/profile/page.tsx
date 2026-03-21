"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";
import { articleService } from "@/app/utils/article-service";
import MentorProfile from "./MentorProfile";
import StudentProfile from "./StudentProfile";
import HRProfile from "./HRProfile";
import { Article } from "../utils/types";

export default function ProfilePage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await articleService.getAll();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Ошибка при загрузке статей:", error);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await articleService.delete(id);
      fetchArticles();
    } catch (error) {
      console.error("Ошибка при удалении статьи:", error);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = authService.getCurrentUser();
    if (user && user.roles.length > 0) {
      setUserRole(user.roles[0]);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  switch (userRole) {
    case "ROLE_MENTOR":
      return <MentorProfile />;
    case "ROLE_STUDENT":
      return (
        <StudentProfile
        />
      );
    case "ROLE_HR":
      return <HRProfile />;
    default:
      return <div>Unknown user role</div>;
  }
}