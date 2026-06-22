import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { STATUS_CONFIG, type StatusKey } from "../constants/examStatusConfig";

interface Props {
  status: StatusKey;
}

export function ExamStatusBadge({ status }: Props) {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.soon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-light tracking-wide uppercase",
        cfg.classes,
      )}
    >
      <span
        className={clsx(
          "w-1 h-1 rounded-full",
          cfg.dot,
          status !== "done" && "animate-pulse",
        )}
      />
      {t(`exams.status_${status}`)}
    </span>
  );
}
