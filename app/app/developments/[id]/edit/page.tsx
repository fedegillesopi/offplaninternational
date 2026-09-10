import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { DevelopmentForm } from "@/components/platform/development-form";
import { getMyDevelopment } from "@/lib/developments";
import { getMyDeveloper } from "@/lib/developers";
import { getCitiesByCountry } from "@/lib/cities";
import { getPropertyAmenities } from "@/lib/property-amenities";
import { getPropertySubcategories } from "@/lib/property-subcategories";
import { getCountryCode, getCountryLabel } from "@/lib/countries";
import { getCommunitiesByCountry } from "@/lib/communities";

interface EditDevelopmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDevelopmentPage({
  params,
}: EditDevelopmentPageProps) {
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
  if (profile.role !== "developer") redirect("/app");

  const developer = await getMyDeveloper(user.id);
  if (!developer) redirect("/app/developer");

  const development = await getMyDevelopment(user.id, id);
  if (!development) redirect("/app/developments");

  const locale = "en";
  const countryCode = getCountryCode(profile.operating_country);
  const countryLabel = getCountryLabel(profile.operating_country);
  const cities = await getCitiesByCountry(countryCode);
  const communities = await getCommunitiesByCountry(countryCode, locale);
  const amenities = await getPropertyAmenities();
  const subcategories = await getPropertySubcategories();

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Edit Development" backHref="/app/developments" />
      <div className="mt-6">
        <DevelopmentForm
          development={development}
          profile={profile}
          cities={cities}
          countryCode={countryCode}
          countryLabel={countryLabel}
          communities={communities}
          amenities={amenities}
          subcategories={subcategories}
        />
      </div>
    </div>
  );
}