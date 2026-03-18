import type { PropsWithChildren, ReactNode } from "react";
import { mergeClasses } from "../../utils/mergeClasses";

interface PanelProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function Panel({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
}: PropsWithChildren<PanelProps>) {
  return (
    <section
      className={mergeClasses(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
