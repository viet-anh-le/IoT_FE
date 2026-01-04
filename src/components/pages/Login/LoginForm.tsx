import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  Lock,
  Visibility,
  VisibilityOff,
  Memory,
  Sync,
} from "@mui/icons-material";
import GlowingIconWrapper from "./GlowingIconWrapper";

import { authSchema, LoginSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";

const LoginForm: React.FC<any> = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(authSchema.login),
    defaultValues: {
      gmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    try {
      console.log("Submitting:", data);
      const result = await authService.login(data);
      console.log(result);
      toast.success(`Xin chào, ${result?.user?.username}!`);

      Cookies.set("accessToken", result?.token.access_token, {
        expires: new Date(result?.token?.expiry_at),
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: result?.user?.username,
          role: result?.user?.role,
        })
      );

      setTimeout(() => {
        navigate("/device-management");
      }, 1000);
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage =
        error.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg animate-fadeIn">
      <Toaster position="top-right" />
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <div className="flex flex-col items-center">
          <GlowingIconWrapper variant="primary">
            <Memory fontSize="large" className="text-cyan-600" />
          </GlowingIconWrapper>

          <h1 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight">
            Đăng nhập
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`h-6 w-6 transition-colors ${
                      errors.gmail
                        ? "text-red-400"
                        : "text-slate-400 group-focus-within:text-cyan-600"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  autoFocus
                  placeholder="Địa chỉ Email"
                  className={`w-full bg-gray-50 border text-slate-900 text-base rounded-lg focus:ring-1 block pl-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white
                    ${
                      errors.gmail
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                    }`}
                  {...register("gmail")}
                />
              </div>
              {errors.gmail && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.gmail.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`h-6 w-6 transition-colors ${
                      errors.password
                        ? "text-red-400"
                        : "text-slate-400 group-focus-within:text-cyan-600"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className={`w-full bg-gray-50 border text-slate-900 text-base rounded-lg focus:ring-1 block pl-12 pr-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityOff className="h-6 w-6" />
                  ) : (
                    <Visibility className="h-6 w-6" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-base">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 bg-gray-50 text-cyan-600 focus:ring-offset-0 focus:ring-1 focus:ring-cyan-500 accent-cyan-600"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="text-slate-500 group-hover:text-slate-700 transition-colors">
                  Ghi nhớ mật khẩu
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-cyan-700 hover:text-cyan-600 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold rounded-lg text-lg px-5 py-3.5 text-center transition-all shadow-lg 
                ${
                  isLoading
                    ? "bg-cyan-400 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/30 hover:-translate-y-0.5"
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Sync />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>

            <div className="text-center mt-6">
              <span className="text-slate-500 text-base">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-cyan-700 hover:text-cyan-600 transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
