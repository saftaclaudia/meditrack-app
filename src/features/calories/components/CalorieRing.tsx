interface CalorieRingProps {
  consumed: number;
  goal: number;
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isOver = consumed > goal;
  const color = isOver ? "#ef4444" : percentage >= 75 ? "#F5B800" : "#00AEBB";
  const diff = Math.abs(goal - consumed);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 rounded-full bg-accent-rose/30 dark:bg-accent-rose/20" />
        <svg width="140" height="140" viewBox="0 0 120 120" className="relative z-10">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-border-light dark:text-border-dark"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
          <text
            x="60"
            y="55"
            textAnchor="middle"
            className="fill-text-primary dark:fill-text-darkPrimary"
            fontSize="16"
            fontWeight="300"
          >
            {consumed}
          </text>
          <text
            x="60"
            y="72"
            textAnchor="middle"
            className="fill-text-muted dark:fill-text-darkMuted"
            fontSize="9"
            fontWeight="300"
          >
            kcal
          </text>
        </svg>
      </div>

      <div className="flex gap-6 text-center">
        <div>
          <p className="text-lg font-light text-primary">{goal}</p>
          <p className="text-[10px] uppercase tracking-widest text-text-muted dark:text-text-darkMuted">
            Goal
          </p>
        </div>
        <div className="w-px bg-border-light dark:bg-border-dark" />
        <div>
          <p className={`text-lg font-light ${isOver ? "text-danger" : "text-primary"}`}>
            {diff}
          </p>
          <p className={`text-[10px] uppercase tracking-widest ${isOver ? "text-danger" : "text-text-muted dark:text-text-darkMuted"}`}>
            {isOver ? "Over" : "Remaining"}
          </p>
        </div>
      </div>
    </div>
  );
}
