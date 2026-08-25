import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyProperties } from "@/lib/properties";
import { PropertyList } from "@/components/platform/property-list";
import { Button } from "@/components/ui/button";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const properties = await getMyProperties(user.id);

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/app/properties/new">
          <Button>Create Property</Button>
        </Link>
      </div>
      <div className="mt-6">
        <PropertyList properties={properties} />
      </div>
    </div>
  );
}
