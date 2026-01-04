import Background from "../components/pages/Login/Background";
import LoginForm from "../components/pages/Login/LoginForm";

export default function Login() {
  return (
    <div className="relative min-h-screen font-sans text-slate-100">
      <Background />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}
