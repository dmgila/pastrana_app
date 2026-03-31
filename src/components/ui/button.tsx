import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[color:var(--accent)] text-white",
    secondary: "bg-[color:var(--surface-strong)] text-[color:var(--accent-strong)]",
    ghost: "bg-transparent text-[color:var(--foreground)]",
    danger: "bg-[color:var(--danger)] text-white",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-150 hover:opacity-90 active:scale-[0.98] active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface)] disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
