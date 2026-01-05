import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Person,
  Mail,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  ErrorOutline,
} from "@mui/icons-material";
import GlowingIconWrapper from "./GlowingIconWrapper";
import { authService } from "@/services/auth.service";

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setLoading(true);

    try {
      await authService.register({
        username: name,
        gmail: email,
        password: password,
      });

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <div className="flex flex-col items-center">
          <GlowingIconWrapper variant="primary">
            <PersonAdd fontSize="large" className="text-cyan-600" />
          </GlowingIconWrapper>

          <h1 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">
            Tạo tài khoản
          </h1>

          {error && (
            <div className="mb-6 w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <ErrorOutline fontSize="small" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="w-full space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Person className="h-6 w-6 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 text-base rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block pl-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white disabled:opacity-60"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                id="signup-email"
                name="email"
                type="email"
                required
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 text-base rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block pl-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white disabled:opacity-60"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 text-base rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block pl-12 pr-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white disabled:opacity-60"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-300 text-slate-900 text-base rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block pl-12 pr-12 p-4 outline-none transition-all placeholder-slate-400 hover:bg-white disabled:opacity-60"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <VisibilityOff className="h-6 w-6" />
                ) : (
                  <Visibility className="h-6 w-6" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-semibold rounded-lg text-lg px-5 py-3.5 text-center transition-all shadow-lg shadow-cyan-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Đăng ký"
              )}
            </button>

            <div className="text-center mt-6">
              <span className="text-slate-500 text-base">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-cyan-700 hover:text-cyan-600 transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
