import Background from "../components/pages/Login/Background";
import SignupForm from "../components/pages/Login/SignupForm";

export default function Signup() {
  return (
    <div className="relative min-h-screen font-sans text-slate-100">
      <Background />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <SignupForm />
      </main>
    </div>
  );
}
