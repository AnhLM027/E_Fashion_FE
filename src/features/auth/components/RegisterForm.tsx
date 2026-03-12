import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/config/routes";
import { validators } from "@/utils/validators";

export const RegisterForm: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      clearError();
    };

  const validateForm = useCallback(() => {
    const errors: typeof validationErrors = {};

    if (!validators.required(form.email)) {
      errors.email = "Vui lòng nhập email";
    } else if (!validators.email(form.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!validators.required(form.password)) {
      errors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      errors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await register({
        email: form.email,
        password: form.password,
      });

      navigate(ROUTES.LOGIN, { replace: true });
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="text"
          value={form.email}
          disabled={isLoading}
          onChange={handleChange("email")}
          placeholder="example@email.com"
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm transition
          focus:outline-none focus:ring-2
          ${
            validationErrors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-black"
          }`}
        />
        {validationErrors.email && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-600">Mật khẩu</label>
        <input
          type="password"
          value={form.password}
          disabled={isLoading}
          onChange={handleChange("password")}
          placeholder="••••••••"
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm transition
          focus:outline-none focus:ring-2
          ${
            validationErrors.password
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-black"
          }`}
        />
        {validationErrors.password && (
          <p className="mt-1 text-xs text-red-500">
            {validationErrors.password}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-600">Xác nhận mật khẩu</label>
        <input
          type="password"
          value={form.confirmPassword}
          disabled={isLoading}
          onChange={handleChange("confirmPassword")}
          placeholder="••••••••"
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm transition
          focus:outline-none focus:ring-2
          ${
            validationErrors.confirmPassword
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-black"
          }`}
        />
        {validationErrors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            {validationErrors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-black py-3 text-white font-medium
                   hover:bg-gray-900 transition
                   disabled:opacity-60"
      >
        {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>
    </form>
  );
};
