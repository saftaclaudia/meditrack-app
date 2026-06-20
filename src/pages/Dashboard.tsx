import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSelectors";
import { ClipboardList, Flame, ArrowRight } from "lucide-react";

export default function DashBoard() {
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm text-text-muted dark:text-text-darkMuted">
          {greeting} 👋
        </p>
        <h1 className="font-sans text-3xl font-bold text-text-primary dark:text-text-darkPrimary leading-tight">
          Hey, <span className="text-primary">{firstName}!</span>
        </h1>
        <p className="text-sm text-text-muted dark:text-text-darkMuted">
          Here's what's on your health radar today.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Exams Card — teal */}
        <button
          onClick={() => navigate("/exams")}
          className="group text-left rounded-3xl p-6 flex flex-col gap-4 transition-all duration-200 active:scale-[0.98] bg-primary hover:bg-primary-hover"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <ClipboardList size={22} className="text-white" strokeWidth={2} />
            </div>
            <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/70 mb-1">
              Medical
            </p>
            <h2 className="font-sans text-xl font-bold text-white leading-snug">
              My Exams
            </h2>
            <p className="text-sm text-white/70 mt-1 leading-relaxed">
              Track & schedule your medical check-ups.
            </p>
          </div>
        </button>

        {/* Nutrition Card — yellow */}
        <button
          onClick={() => navigate("/calories")}
          className="group text-left rounded-3xl p-6 flex flex-col gap-4 transition-all duration-200 active:scale-[0.98] bg-accent-rose hover:bg-accent-sand"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center">
              <Flame size={22} className="text-white" strokeWidth={2} />
            </div>
            <ArrowRight size={18} className="text-black/30 group-hover:text-black/50 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-black/50 mb-1">
              Nutrition
            </p>
            <h2 className="font-sans text-xl font-bold text-black/80 leading-snug">
              Calorie Log
            </h2>
            <p className="text-sm text-black/50 mt-1 leading-relaxed">
              Log meals and hit your daily goal.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
