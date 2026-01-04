import React from "react";
import { Link } from "react-router-dom";
import {
  CloudOff,
  ArrowBack,
  WifiTetheringErrorRounded,
  Home,
} from "@mui/icons-material";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* --- Visual Animation Section --- */}
        <div className="relative h-40 w-40 mx-auto mb-8 flex items-center justify-center">
          {/* Vòng tròn hiệu ứng lan tỏa (Radar ping effect) */}
          <div className="absolute inset-0 bg-cyan-100 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-4 bg-cyan-200 rounded-full animate-pulse opacity-50"></div>

          {/* Icon chính */}
          <div className="relative z-10 bg-white p-6 rounded-full shadow-xl border-4 border-slate-50">
            <CloudOff sx={{ fontSize: 60 }} className="text-slate-400" />
          </div>

          {/* Icon phụ trang trí: mô phỏng các thiết bị vệ tinh/sensor xung quanh */}
          <div
            className="absolute top-0 right-0 animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            <WifiTetheringErrorRounded className="text-red-400 opacity-80" />
          </div>
        </div>

        {/* --- Text Content --- */}
        <h1 className="text-8xl font-black text-slate-200 tracking-widest mb-2 select-none">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Mất kết nối tín hiệu!
        </h2>
        <p className="text-slate-500 mb-8 px-4">
          Không tìm thấy trang bạn yêu cầu. Có vẻ như đường truyền đến thiết bị
          này đã bị ngắt hoặc địa chỉ không tồn tại.
        </p>

        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Nút về trang chủ */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Home fontSize="small" />
            Về Dashboard
          </Link>

          {/* Nút quay lại */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-sm transition-all hover:-translate-y-1"
          >
            <ArrowBack fontSize="small" />
            Quay lại
          </button>
        </div>

        {/* --- Footer nhỏ --- */}
        <div className="mt-12 text-xs text-slate-400">
          Error Code:{" "}
          <span className="font-mono bg-slate-200 px-1 rounded text-slate-600">
            PAGE_NOT_FOUND_EXCEPTION
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
