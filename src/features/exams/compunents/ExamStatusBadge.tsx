import clsx from "clsx";

import { STATUS_CONFIG, type StatusKey } from "../constants/examStatusConfig";

interface Props {
  status: StatusKey;
}

export function ExamStatusBadge({ status }: Props) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.soon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-light tracking-wide uppercase",
        cfg.classes,
      )}
    >
      {/* animated dot */}
      <span
        className={clsx(
          "w-1 h-1 rounded-full",
          cfg.dot,
          status !== "done" && "animate-pulse",
        )}
      />

      {cfg.label}
    </span>
  );
}
