import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSelectors";
import { useTranslation } from "react-i18next";
import { ClipboardList, Flame, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

type IconType = "wave" | "clipboard" | "flame" | "check";

type SlideData = {
  titleKey: string;
  descKey: string;
  iconType: IconType;
  iconColor: "teal" | "amber";
};

const SLIDES: SlideData[] = [
  {
    titleKey: "welcome.slide1_title",
    descKey: "welcome.slide1_desc",
    iconType: "wave",
    iconColor: "teal",
  },
  {
    titleKey: "welcome.slide2_title",
    descKey: "welcome.slide2_desc",
    iconType: "clipboard",
    iconColor: "teal",
  },
  {
    titleKey: "welcome.slide3_title",
    descKey: "welcome.slide3_desc",
    iconType: "flame",
    iconColor: "amber",
  },
  {
    titleKey: "welcome.slide4_title",
    descKey: "welcome.slide4_desc",
    iconType: "check",
    iconColor: "teal",
  },
];

function SlideIcon({
  type,
  color,
}: {
  type: IconType;
  color: "teal" | "amber";
}) {
  const colorClass = color === "amber" ? "text-amber-500" : "text-primary";
  if (type === "wave") return <span className="text-7xl">👋</span>;
  if (type === "clipboard")
    return <ClipboardList size={72} className={colorClass} />;
  if (type === "flame") return <Flame size={72} className={colorClass} />;
  return <CheckCircle size={72} className={colorClass} />;
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.settings.theme);
  const user = useAppSelector(selectAuthUser);

  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const changeStep = (newStep: number) => {
    setVisible(false);
    setTimeout(() => {
      setStep(newStep);
      setVisible(true);
    }, 200);
  };

  const handleSkip = () => {
    if (user) localStorage.setItem(`onboarding_seen_${user.id}`, "true");
    changeStep(SLIDES.length - 1);
  };
  const handleNext = () => changeStep(step + 1);
  const handleGetStarted = () => {
    if (user) localStorage.setItem(`onboarding_seen_${user.id}`, "true");
    navigate("/", { replace: true });
  };

  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Top bar: dots + skip */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-border-light dark:bg-border-dark"
              }`}
            />
          ))}
        </div>
        {!isLast && (
          <button
            onClick={handleSkip}
            className="text-sm text-text-muted dark:text-text-darkMuted hover:text-text-primary dark:hover:text-text-darkPrimary transition-colors"
          >
            {t("welcome.skip")}
          </button>
        )}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className={`transition-all duration-300 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          <div className="mb-10 flex justify-center">
            <SlideIcon type={slide.iconType} color={slide.iconColor} />
          </div>
          <h1 className="font-serif text-4xl font-light text-text-primary dark:text-text-darkPrimary mb-4 leading-tight">
            {t(slide.titleKey)}
          </h1>
          <p className="text-text-secondary dark:text-text-darkSecondary text-base leading-relaxed max-w-xs mx-auto">
            {t(slide.descKey)}
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-8 pb-14 flex flex-col items-center gap-3">
        {isLast && (
          <button
            onClick={() => navigate("/calories?tab=profile")}
            className="text-sm text-primary hover:underline transition-colors"
          >
            {t("welcome.setup_profile")}
          </button>
        )}
        <div className="w-full max-w-xs">
          <Button
            fullWidth
            size="lg"
            onClick={isLast ? handleGetStarted : handleNext}
          >
            {isLast ? t("welcome.get_started") : t("welcome.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
