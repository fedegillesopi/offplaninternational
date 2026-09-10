import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardGreeting({
  fullName,
  showDevelopments,
}: {
  fullName: string;
  showDevelopments?: boolean;
}) {
  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const firstName = fullName.split(" ")[0] || "there";
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {firstName}</h1>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/app/properties/new">New property</Link>
        </Button>
        {showDevelopments && (
          <Button asChild variant="outline">
            <Link href="/app/developments/new">New development</Link>
          </Button>
        )}
      </div>
    </div>
  );
}