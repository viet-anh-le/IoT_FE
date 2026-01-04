import Background from "../components/pages/login/Background";
import ForgotPasswordForm from "../components/pages/login/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="relative min-h-screen font-sans text-slate-100">
      <Background />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
