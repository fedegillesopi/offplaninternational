import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyDevelopments } from "@/lib/developments";
import { DevelopmentList } from "@/components/platform/development-list";
import { Button } from "@/components/ui/button";

export default async function DevelopmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const developments = await getMyDevelopments(user.id);

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Developments</h1>
        <Link href="/app/developments/new">
          <Button>Create Development</Button>
        </Link>
      </div>
      <div className="mt-6">
        <DevelopmentList developments={developments} />
      </div>
    </div>
  );
}