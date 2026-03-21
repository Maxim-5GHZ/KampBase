"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/utils/auth-service";
import MentorProfile from "./MentorProfile";
import StudentProfile from "./StudentProfile";
import HRProfile from "./HRProfile";

export default function ProfilePage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        if (!authService.isAuthenticated()) {
        router.push("/login");
        return;
        }

        // Get user info
        const user = authService.getCurrentUser();
        if (user && user.roles.length > 0) {
        // Assuming the user has exactly one role, take the first one
        setUserRole(user.roles[0]);
        } else {
        // If no user info (maybe token expired or not stored), redirect to login
        router.push("/login");
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(userRole);
    // Render appropriate profile component based on role
    switch (userRole) {
        case "ROLE_MENTOR":
        return <MentorProfile />;
        case "ROLE_STUDENT":
        return <StudentProfile />;
        case "ROLE_HR":
        return <HRProfile />;
        default:
        // Fallback: maybe show error or redirect
        return <div>Unknown user role</div>;
    }
}