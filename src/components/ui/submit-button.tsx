"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function SubmitButton({ idleLabel, pendingLabel, className, variant = "primary" }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      className={className}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
