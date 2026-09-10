import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeveloperDashboard } from "@/components/platform/dashboard/developer-dashboard";
import { BrokerDashboard } from "@/components/platform/dashboard/broker-dashboard";

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

  const params = {
    userId: user.id,
    fullName: profile?.full_name || "",
    profileCompleted: profile?.profile_completed ?? false,
  };

  if (profile?.role === "broker") {
    return <BrokerDashboard {...params} />;
  }

  if (profile?.role === "private_seller") {
    redirect("/app/properties");
  }

  return <DeveloperDashboard {...params} />;
}