import { mergeClasses } from "../../utils/mergeClasses";

interface FeedbackMessageProps {
  status: "success" | "error";
  message: string;
  className?: string;
}

export default function FeedbackMessage({
  status,
  message,
  className,
}: FeedbackMessageProps) {
  return (
    <div
      className={mergeClasses(
        "rounded-2xl border px-4 py-3 text-sm",
        status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700",
        className,
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
