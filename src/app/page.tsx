export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/ui/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrandLockup } from "@/components/brand/brand-lockup";

export default async function HomePage() {
  const athletes = await prisma.athleteProfile.findMany({
    orderBy: { displayName: "asc" },
  });

  return (
    <AppShell className="justify-center gap-4">
      <Card className="space-y-5">
        <BrandLockup />

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Running planner</p>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Base mobile-first para coach y athlete, con plan semanal simple, publicacion por dia y feedback posterior.
          </p>
        </div>

        <Link href="/coach" className="block">
          <Button className="w-full">Entrar como coach demo</Button>
        </Link>
      </Card>

      <Card className="space-y-3">
        <p className="text-sm font-semibold">Entrar como athlete demo</p>
        {athletes.map((athlete) => (
          <Link key={athlete.id} href={`/athlete/${athlete.id}`} className="block">
            <Button className="w-full" variant="secondary">
              {athlete.displayName}
            </Button>
          </Link>
        ))}
      </Card>
    </AppShell>
  );
}