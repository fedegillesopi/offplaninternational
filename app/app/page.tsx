import { redirect } from "next/navigation";
import { Building2, CheckCircle, Clock, Landmark } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSellerDashboardData } from "@/lib/properties";
import { getMyDevelopments } from "@/lib/developments";
import { DashboardGreeting } from "@/components/platform/dashboard/dashboard-greeting";
import { ProfileCompletionBanner } from "@/components/platform/dashboard/profile-completion-banner";
import { StatCard } from "@/components/platform/dashboard/stat-card";
import { RecentProperties } from "@/components/platform/dashboard/recent-properties";
import { RecentDevelopments } from "@/components/platform/dashboard/recent-developments";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, role, profile_completed")
    .eq("id", user.id)
    .single();

  const isDeveloper = profile?.role === "developer";
  const { total, byStatus, recent } = await getSellerDashboardData(user.id, 5);

  const developments = isDeveloper
    ? [...(await getMyDevelopments(user.id))].sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
      )
    : [];
  const recentDevelopments = developments.slice(0, 5);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <DashboardGreeting fullName={profile?.full_name || ""} showDevelopments={isDeveloper} />

      <ProfileCompletionBanner profileCompleted={profile?.profile_completed ?? false} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total properties"
          value={total}
          icon={Building2}
          href="/app/properties"
        />
        {isDeveloper && (
          <StatCard
            label="Total developments"
            value={developments.length}
            icon={Landmark}
            href="/app/developments"
          />
        )}
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

      {isDeveloper && <RecentDevelopments developments={recentDevelopments} />}

      <RecentProperties properties={recent} />
    </div>
  );
}