import Link from "next/link";
import { Building2, CheckCircle, Clock, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSellerDashboardData } from "@/lib/properties";
import { getMyDevelopments } from "@/lib/developments";
import { DashboardGreeting } from "@/components/platform/dashboard/dashboard-greeting";
import { ProfileCompletionBanner } from "@/components/platform/dashboard/profile-completion-banner";
import { StatCard } from "@/components/platform/dashboard/stat-card";
import { RecentProperties } from "@/components/platform/dashboard/recent-properties";
import { RecentDevelopments } from "@/components/platform/dashboard/recent-developments";

interface DeveloperDashboardProps {
  userId: string;
  fullName: string;
  profileCompleted: boolean;
}

export async function DeveloperDashboard({
  userId,
  fullName,
  profileCompleted,
}: DeveloperDashboardProps) {
  const { total, byStatus, recent } = await getSellerDashboardData(userId, 5);

  const developments = [...(await getMyDevelopments(userId))].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
  const recentDevelopments = developments.slice(0, 5);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <DashboardGreeting fullName={fullName}>
        <Button asChild>
          <Link href="/app/properties/new">New property</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/app/developments/new">New development</Link>
        </Button>
      </DashboardGreeting>

      <ProfileCompletionBanner profileCompleted={profileCompleted} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total properties"
          value={total}
          icon={Building2}
          href="/app/properties"
        />
        <StatCard
          label="Total developments"
          value={developments.length}
          icon={Landmark}
          href="/app/developments"
        />
        <StatCard
          label="Properties available"
          value={byStatus.available}
          icon={CheckCircle}
        />
        <StatCard
          label="Properties reserved"
          value={byStatus.reserved}
          icon={Clock}
        />
      </div>

      <RecentDevelopments developments={recentDevelopments} />

      <RecentProperties properties={recent} />
    </div>
  );
}