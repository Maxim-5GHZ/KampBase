"use client";

import { useState } from "react";
import Link from "next/link";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    GraduationCap,
    Users,
    Briefcase,
    School,
} from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        patronymic: "",
        userType: "", // "mentor", "student", "hr"
        university: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
        alert("Пароли не совпадают");
        return;
        }
        // Здесь будет отправка данных на сервер
        console.log("Registration data:", formData);
        alert("Регистрация успешна (демо)");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-custom-bg-main p-4">
        <div className="w-full max-w-md">
            <div className="bg-custom-bg-secondary rounded-3xl shadow-xl p-4 sm:p-8">
            <h1 className="text-2xl font-bold text-custom-main text-center mb-6">
                Регистрация
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Имя */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text text-custom-main">Имя</span>
                </label>
                <div className="flex items-center gap-2 input input-bordered border-custom-secondary">
                    <User size={18} className="text-custom-main sm:size-5" />
                    <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Введите имя"
                    className="w-full outline-none bg-transparent text-custom-main placeholder-custom-placeholder"
                    required
                    />
                </div>
                </div>

                {/* Фамилия */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text text-custom-main">Фамилия</span>
                </label>
                <div className="flex items-center gap-2 input input-bordered border-custom-secondary">
                    <User size={18} className="text-custom-main sm:size-5" />
                    <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Введите фамилию"
                    className="w-full outline-none bg-transparent text-custom-main placeholder-custom-placeholder"
                    required
                    />
                </div>
                </div>

                {/* Отчество */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text text-custom-main">Отчество</span>
                </label>
                <div className="flex items-center gap-2 input input-bordered border-custom-secondary">
                    <User size={18} className="text-custom-main sm:size-5" />
                    <input
                    type="text"
                    name="patronymic"
                    value={formData.patronymic}
                    onChange={handleChange}
                    placeholder="Введите отчество"
                    className="w-full outline-none bg-transparent text-custom-main placeholder-custom-placeholder"
                    />
                </div>
                </div>

                {/* Тип пользователя */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text text-custom-main">Тип пользователя</span>
                </label>
                <div className="flex flex-wrap gap-4 gap-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="userType"
                        value="mentor"
                        checked={formData.userType === "mentor"}
                        onChange={handleChange}
                        className="radio radio-primary"
                        required
                    />
                    <Users size={18} className="text-custom-main sm:size-5" />
                    <span className="text-custom-main">Ментор</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="userType"
                        value="student"
                        checked={formData.userType === "student"}
                        onChange={handleChange}
                        className="radio radio-primary"
                        required
                    />
                    <GraduationCap size={18} className="text-custom-main sm:size-5" />
                    <span className="text-custom-main">Студент</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="userType"
                        value="hr"
                        checked={formData.userType === "hr"}
                        onChange={handleChange}
                        className="radio radio-primary"
                        required
                    />
                    <Briefcase size={18} className="text-custom-main sm:size-5" />
                    <span className="text-custom-main">HR</span>
                    </label>
                </div>
                </div>

                {/* Университет (только для студента) */}
                {formData.userType === "student" && (
                <div className="form-control">
                    <label className="label">
                    <span className="label-text text-custom-main">Университет</span>
                    </label>
                    <div className="flex items-center gap-2 input input-bordered border-custom-secondary">
                    <School size={18} className="text-custom-main sm:size-5" />
                    <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        placeholder="Введите название университета"
                        className="w-full outline-none bg-transparent text-custom-main placeholder-custom-placeholder"
                        required={formData.userType === "student"}
                    />
                    </div>
                </div>
                )}

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
                    {showPassword ? <EyeOff size={18} className="sm:size-5" /> : <Eye size={18} className="sm:size-5" />}
                    </button>
                </div>
                </div>

                {/* Пароль ещё раз */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text text-custom-main">Пароль ещё раз</span>
                </label>
                <div className="flex items-center gap-2 input input-bordered">
                    <Lock size={18} className="text-custom-main sm:size-5" />
                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full outline-none bg-transparent text-custom-main placeholder-custom-placeholder"
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-custom-main hover:text-primary transition"
                    >
                    {showConfirmPassword ? <EyeOff size={18} className="sm:size-5" /> : <Eye size={18} className="sm:size-5" />}
                    </button>
                </div>
                </div>

                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row pt-4 gap-2 sm:gap-0">
                <button type="submit" className="btn btn-primary w-full sm:w-1/2 rounded-button sm:rounded-r-none">
                    Зарегистрироваться
                </button>
                <Link href="/login" className="btn btn-secondary w-full sm:w-1/2 rounded-button sm:rounded-l-none">
                    Уже есть аккаунт? Войти
                </Link>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-custom-secondary">
                Нажимая «Зарегистрироваться», вы принимаете условия пользовательского соглашения
            </div>
            </div>
        </div>
        </div>
    );
}