import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validators } from "../../../utils/validators";
import { ROUTES } from "../../../config/routes";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = useCallback(() => {
    const errors: typeof validationErrors = {};

    if (!validators.required(email)) {
      errors.email = "Vui lòng nhập email";
    }

    if (!validators.required(password)) {
      errors.password = "Vui lòng nhập mật khẩu";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearError();
      if (!validateForm()) return;

      try {
        await login(email, password);
        onSuccess?.();
      } catch {}
    },
    [email, password, login, validateForm, clearError, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="text"
          value={email}
          disabled={isLoading}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationErrors.email) clearError();
          }}
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
        <div className="flex justify-between text-sm text-gray-600">
          <span>Mật khẩu</span>
          <Link to={ROUTES.FORGOT_PASSWORD} className="hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <input
          type="password"
          value={password}
          disabled={isLoading}
          onChange={(e) => {
            setPassword(e.target.value);
            if (validationErrors.password) clearError();
          }}
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-black py-3 text-white font-medium
                   hover:bg-gray-900 transition
                   disabled:opacity-60"
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
};
