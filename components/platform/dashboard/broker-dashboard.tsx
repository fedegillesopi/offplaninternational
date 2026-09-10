import Link from "next/link";
import { Building2, LayoutGrid, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSellerDashboardData } from "@/lib/properties";
import { DashboardGreeting } from "@/components/platform/dashboard/dashboard-greeting";
import { ProfileCompletionBanner } from "@/components/platform/dashboard/profile-completion-banner";
import { StatCard } from "@/components/platform/dashboard/stat-card";
import { RecentProperties } from "@/components/platform/dashboard/recent-properties";

interface BrokerDashboardProps {
  userId: string;
  fullName: string;
  profileCompleted: boolean;
}

export async function BrokerDashboard({
  userId,
  fullName,
  profileCompleted,
}: BrokerDashboardProps) {
  const { total, byStatus, recent } = await getSellerDashboardData(userId, 3);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <DashboardGreeting fullName={fullName}>
        <Button asChild>
          <Link href="/app/properties/new">New property</Link>
        </Button>
      </DashboardGreeting>

      <ProfileCompletionBanner profileCompleted={profileCompleted} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total properties"
          value={total}
          icon={Building2}
          href="/app/properties"
        />
        <StatCard
          label="Properties available"
          value={byStatus.available}
          icon={LayoutGrid}
        />
        <StatCard
          label="Inquiries"
          value="—"
          icon={MessageSquare}
          footnote="Coming soon"
          disabled
        />
      </div>

      <RecentProperties properties={recent} title="Recent properties uploaded" />
    </div>
  );
}