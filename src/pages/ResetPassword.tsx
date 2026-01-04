import Background from "../components/pages/Login/Background";
import ResetPasswordForm from "../components/pages/Login/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <div className="relative min-h-screen font-sans text-slate-100">
      <Background />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <ResetPasswordForm />
      </main>
    </div>
  );
}
