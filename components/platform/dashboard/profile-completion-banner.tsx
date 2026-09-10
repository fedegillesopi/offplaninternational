import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProfileCompletionBanner({
  profileCompleted,
}: {
  profileCompleted: boolean;
}) {
  if (profileCompleted) return null;

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
      <p className="text-sm font-medium text-amber-800">
        Complete your profile to get the most out of OffPlan International
      </p>
      <Link href="/app/settings">
        <Button
          variant="outline"
          className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
        >
          Complete profile
        </Button>
      </Link>
    </div>
  );
}