import { Button } from "./Button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl border border-pink-200 dark:border-gray-700">
        <div className="space-y-3 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={onCancel} fullWidth>
            {cancelText}
          </Button>

          <Button variant="danger" onClick={onConfirm} fullWidth>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
