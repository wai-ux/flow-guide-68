import type { ButtonHTMLAttributes, InputHTMLAttributes, Ref, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "quiet";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-8 px-3 text-[0.8125rem]",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-5 text-[0.9375rem]",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-card hover:brightness-105",
        variant === "outline" &&
          "border border-border-strong bg-transparent text-foreground hover:bg-secondary",
        variant === "ghost" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
        variant === "quiet" && "bg-secondary text-secondary-foreground hover:brightness-105",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-lg border border-input bg-card px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring",
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("gk-card p-5 shadow-card sm:p-6", className)}>{children}</div>;
}

/** One consistent page header: where am I, what is this page for, what can I do. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid gap-4 border-b border-border pb-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="gk-eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-[1.5rem] tracking-tight sm:text-[1.75rem]">{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </header>
  );
}

export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "urgent" | "priority" | "foundation" | "later" | "primary";
  children: ReactNode;
  className?: string;
}) {
  const dot =
    tone === "urgent"
      ? "bg-urgent"
      : tone === "priority"
        ? "bg-priority"
        : tone === "foundation"
          ? "bg-foundation"
          : tone === "later"
            ? "bg-later"
            : tone === "primary"
              ? "bg-primary"
              : "bg-border-strong";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
      {children}
    </span>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `${Math.max(value, 2)}%` }}
      />
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70",
        className,
      )}
    />
  );
}
