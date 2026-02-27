export const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    classes: `
      bg-status-upcoming-bg dark:bg-status-upcoming-bg-dark
      text-status-upcoming-text dark:text-status-upcoming-text-dark
      border border-status-upcoming-border dark:border-status-upcoming-border-dark
    `,
    dot: "bg-status-upcoming-dot",
  },

  soon: {
    label: "Soon",
    classes: `
      bg-status-soon-bg dark:bg-status-soon-bg-dark
      text-status-soon-text dark:text-status-soon-text-dark
      border border-status-soon-border dark:border-status-soon-border-dark
    `,
    dot: "bg-status-soon-dot",
  },

  overdue: {
    label: "Overdue",
    classes: `
      bg-status-overdue-bg dark:bg-status-overdue-bg-dark
      text-status-overdue-text dark:text-status-overdue-text-dark
      border border-status-overdue-border dark:border-status-overdue-border-dark
    `,
    dot: "bg-status-overdue-dot",
  },

  done: {
    label: "Done",
    classes: `
      bg-status-done-bg dark:bg-status-done-bg-dark
      text-status-done-text dark:text-status-done-text-dark
      border border-status-done-border dark:border-status-done-border-dark
    `,
    dot: "bg-status-done-dot",
  },
} as const;

export type StatusKey = keyof typeof STATUS_CONFIG;

export const dateLabelMap: Record<StatusKey, string> = {
  upcoming: "Next:",
  soon: "Next:",
  overdue: "Was on:",
  done: "Completed on:",
};
