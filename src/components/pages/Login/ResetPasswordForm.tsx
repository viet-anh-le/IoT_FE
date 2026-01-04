import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import {
  LockReset,
  ArrowLeft,
  Sync,
  VpnKey,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import GlowingIconWrapper from "./GlowingIconWrapper";

import { authSchema, ResetPasswordSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";

const ResetPasswordForm: React.FC<any> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const urlToken = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(authSchema.resetPassword),
    defaultValues: {
      token: urlToken,
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (urlToken) {
      setValue("token", urlToken);
    }
  }, [urlToken, setValue]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data);
      toast.success("Đổi mật khẩu thành công!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
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
            <LockReset fontSize="large" className="text-slate-700" />
          </GlowingIconWrapper>

          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Đặt lại mật khẩu
          </h1>
          <p className="text-slate-500 text-base mb-8 text-center px-4">
            Nhập mã token và thiết lập mật khẩu mới để bảo vệ tài khoản.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <VpnKey
                    className={`h-6 w-6 transition-colors ${
                      errors.token
                        ? "text-red-400"
                        : "text-slate-400 group-focus-within:text-slate-600"
                    }`}
                  />
                </div>
                <input
                  id="token"
                  type="text"
                  placeholder="Mã Token"
                  className={`w-full bg-gray-50 border text-slate-900 text-base rounded-lg focus:ring-1 block pl-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white
                    ${
                      errors.token
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-slate-400 focus:border-slate-400"
                    }`}
                  {...register("token")}
                />
              </div>
              {errors.token && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.token.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`h-6 w-6 transition-colors ${
                      errors.newPassword
                        ? "text-red-400"
                        : "text-slate-400 group-focus-within:text-slate-600"
                    }`}
                  />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu mới"
                  className={`w-full bg-gray-50 border text-slate-900 text-base rounded-lg focus:ring-1 block pl-12 pr-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white
                    ${
                      errors.newPassword
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-slate-400 focus:border-slate-400"
                    }`}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`h-6 w-6 transition-colors ${
                      errors.confirmPassword
                        ? "text-red-400"
                        : "text-slate-400 group-focus-within:text-slate-600"
                    }`}
                  />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  className={`w-full bg-gray-50 border text-slate-900 text-base rounded-lg focus:ring-1 block pl-12 pr-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white
                    ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-slate-400 focus:border-slate-400"
                    }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.confirmPassword.message}
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
                  <Sync className="animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Đổi mật khẩu"
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

export default ResetPasswordForm;
