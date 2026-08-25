import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyForm } from "@/components/platform/property-form";
import { getMyProperty } from "@/lib/properties";
import { getCitiesByCountry } from "@/lib/cities";
import { getPropertyAmenities } from "@/lib/property-amenities";
import { getPropertySubcategories } from "@/lib/property-subcategories";
import { getCountryCode, getCountryLabel } from "@/lib/countries";
import type { PaymentPlanMilestone } from "@/lib/types";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.role) redirect("/login");

  const property = await getMyProperty(user.id, id);

  if (!property) redirect("/app/properties");

  const countryCode = getCountryCode(profile.operating_country);
  const countryLabel = getCountryLabel(profile.operating_country);
  const cities = await getCitiesByCountry(countryCode);
  const amenities = await getPropertyAmenities();
  const subcategories = await getPropertySubcategories();

  let developments: { id: string; name: string }[] = [];
  if (profile.role === "developer") {
    const { data: dev } = await supabase
      .from("developers")
      .select("id, name")
      .eq("user_profile_id", user.id)
      .maybeSingle();

    if (dev) {
      const { data: devts } = await supabase
        .from("developments")
        .select("id, name")
        .eq("developer_id", dev.id)
        .eq("is_active", true)
        .order("name");

      developments = devts ?? [];
    }
  }

  const { data: rawMilestones } = await supabase
    .from("payment_plan_milestones")
    .select("*")
    .eq("property_id", id)
    .order("sort_order");

  const milestones = (rawMilestones ?? []).map(
    (m: PaymentPlanMilestone) => ({
      id: m.id,
      milestone_name: m.milestone_name,
      percentage: m.percentage,
      amount: m.amount,
      due_date: m.due_date,
      description: m.description,
      sort_order: m.sort_order,
    }),
  );

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold">Edit Property</h1>
      <div className="mt-6">
        <PropertyForm
          property={property}
          milestones={milestones}
          userId={user.id}
          userRole={profile.role}
          cities={cities}
          countryLabel={countryLabel}
          amenities={amenities}
          subcategories={subcategories}
          developments={developments}
        />
      </div>
    </div>
  );
}
