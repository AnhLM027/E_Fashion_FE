import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { authApi } from "../api/auth.api";
import type {
  AuthContextType,
  User,
  RegisterRequest,
} from "../types/auth.type";

import {
  loginSuccess,
  logout as reduxLogout,
} from "@/features/auth/slices/authSlice";

import { Button } from "@/components/ui/Button";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = useCallback(async () => {
    if (!localStorage.getItem("hasLoggedIn")) return;

    try {
      const userData = await authApi.profile();

      setUser(userData);
      setIsAuthenticated(true);
      setSessionExpired(false);

      dispatch(
        loginSuccess({
          user: userData,
          token: "cookie-based",
        }),
      );
    } catch (err) {
      // axiosClient đã tự xử lý refresh
      // nếu refresh fail → SESSION_EXPIRED event sẽ được bắn ra
      console.error("Fetch profile failed:", err);
    }
  }, [dispatch]);

  /* ================= INIT APP ================= */

  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem("hasLoggedIn")) {
        setIsLoading(false);
        setIsAuthInitialized(true);
        return;
      }

      try {
        // 🔥 refresh trước
        await authApi.refreshToken();

        // 🔥 sau đó lấy profile
        const userData = await authApi.profile();

        setUser(userData);
        setIsAuthenticated(true);

        dispatch(
          loginSuccess({
            user: userData,
            token: "cookie-based",
          }),
        );
      } catch (err) {
        console.log("Initial auth failed");
        localStorage.removeItem("hasLoggedIn");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setIsAuthInitialized(true); // 🔥 QUAN TRỌNG NHẤT
      }
    };

    init();
  }, [dispatch]);

  /* ================= SESSION EXPIRED LISTENER ================= */

  useEffect(() => {
    const handler = () => {
      if (!localStorage.getItem("hasLoggedIn")) return;

      setSessionExpired(true);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("hasLoggedIn");
      dispatch(reduxLogout());
    };

    window.addEventListener("SESSION_EXPIRED", handler);
    return () => window.removeEventListener("SESSION_EXPIRED", handler);
  }, [dispatch]);

  /* ================= LOGIN ================= */

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        await authApi.login({ email, password });

        // Đánh dấu đã login để cho phép auto refresh
        localStorage.setItem("hasLoggedIn", "true");

        await fetchProfile();
        setSessionExpired(false);
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || "Login failed";

        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfile],
  );

  /* ================= REGISTER ================= */

  const register = useCallback(async (data: RegisterRequest) => {
    setError(null);
    setIsLoading(true);

    try {
      await authApi.register(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Registration failed";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ================= LOGOUT ================= */

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch (err) {
      // ignore lỗi logout server
    } finally {
      localStorage.removeItem("hasLoggedIn");

      setUser(null);
      setIsAuthenticated(false);
      setSessionExpired(false);

      dispatch(reduxLogout());

      setIsLoading(false);
      navigate("/");
    }
  }, [dispatch, navigate]);

  /* ================= CONTEXT VALUE ================= */

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAuthInitialized,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
    updateUser: (u: User) => {
      setUser(u);
      dispatch(loginSuccess({ user: u, token: "cookie-based" }));
    },
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

      {/* SESSION EXPIRED MODAL */}
      {sessionExpired && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-[420px] text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-2">
              Phiên đăng nhập đã hết hạn
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Vui lòng đăng nhập lại để tiếp tục.
            </p>

            <Button
              className="w-full bg-black text-white"
              onClick={() => {
                setSessionExpired(false);
                navigate("/login");
              }}
            >
              Đăng nhập lại
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
