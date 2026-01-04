import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Mail, ArrowLeft, Sync } from "@mui/icons-material";
import GlowingIconWrapper from "./GlowingIconWrapper";

import { authSchema, ForgotPasswordSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";

const ForgotPasswordForm: React.FC<any> = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(authSchema.forgotPassword),
    defaultValues: {
      gmail: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(data);
      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      const errorMessage =
        error.message || "Không thể gửi email. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg animate-fadeIn">
      <Toaster position="top-right" />
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center">
          <GlowingIconWrapper variant="secondary">
            <Mail fontSize="large" className="text-slate-700" />
          </GlowingIconWrapper>

          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Quên mật khẩu?
          </h1>
          <p className="text-slate-500 text-base mb-8 text-center px-4">
            Nhập email đã đăng ký để nhận token đặt lại mật khẩu.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`h-6 w-6 transition-colors ${
                      errors.gmail
                        ? "text-red-400"
                        : "text-slate-400 group-focus-within:text-slate-600"
                    }`}
                  />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  autoFocus
                  placeholder="Địa chỉ Email"
                  className={`w-full bg-gray-50 border text-slate-900 text-base rounded-lg focus:ring-1 block pl-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white
                    ${
                      errors.gmail
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-slate-400 focus:border-slate-400"
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
                  <span>Đang gửi...</span>
                </div>
              ) : (
                "Gửi email khôi phục"
              )}
            </button>
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-colors py-2 text-base font-medium"
            >
              <ArrowLeft />
              Quay lại đăng nhập
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
