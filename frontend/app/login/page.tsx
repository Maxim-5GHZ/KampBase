"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/app/utils/auth-service";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Сбрасываем ошибку при изменении полей
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Заполните все поля");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Вызываем метод login с email в качестве username
            const response = await authService.login({
                username: formData.email,
                password: formData.password,
            });

            // Токен уже сохранён в сервисе через setToken
            // Можно также сохранить информацию о пользователе в localStorage или контекст
            console.log("Успешный вход:", response);

            // Перенаправляем на главную страницу (или дашборд)
            router.push("/profile");
        } catch (err: any) {
            // Обработка ошибок
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Ошибка входа. Проверьте данные или попробуйте позже.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-custom-bg-main p-4">
            <div className="w-full max-w-md">
                <div className="bg-custom-bg-secondary rounded-3xl shadow-xl p-4 sm:p-8">
                    <h1 className="text-2xl font-bold text-custom-main text-center mb-6">
                        Вход в аккаунт
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-custom-main">Email</span>
                            </label>
                            <div className="flex items-center gap-2 input input-bordered border-custom-secondary">
                                <Mail size={18} className="text-custom-main sm:size-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                    className="w-full outline-none bg-transparent text-custom-main placeholder-custom-placeholder"
                                    required
                                />
                            </div>
                        </div>

                        {/* Пароль */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-custom-main">Пароль</span>
                            </label>
                            <div className="flex items-center gap-2 input input-bordered border-custom-secondary">
                                <Lock size={18} className="text-custom-main sm:size-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="w-full outline-none bg-transparent text-custom-main placeholder-custom-placeholder"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-custom-main hover:text-primary transition"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className="sm:size-5" />
                                    ) : (
                                        <Eye size={18} className="sm:size-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Забыли пароль? */}
                        <div className="text-right">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-custom-secondary hover:text-primary transition"
                            >
                                Забыли пароль?
                            </Link>
                        </div>

                        {/* Отображение ошибки */}
                        {error && (
                            <div className="alert alert-error text-sm p-2">
                                {error}
                            </div>
                        )}

                        {/* Кнопки */}
                        <div className="flex flex-col sm:flex-row pt-4 gap-2 sm:gap-0">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full sm:w-1/2 rounded-button sm:rounded-r-none ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Вход..." : "Войти"}
                            </button>
                            <Link
                                href="/registration"
                                className="btn btn-secondary w-full sm:w-1/2 rounded-button sm:rounded-l-none"
                            >
                                Нет аккаунта? Зарегистрироваться
                            </Link>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-custom-secondary">
                        Входя в аккаунт, вы принимаете условия пользовательского соглашения
                    </div>
                </div>
            </div>
        </div>
    );
}