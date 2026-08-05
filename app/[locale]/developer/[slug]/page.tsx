import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToHome } from "@/components/site/back-to-home";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { DeveloperHeader } from "@/components/developers/developer-header";
import { DeveloperInfoCard } from "@/components/developers/developer-info-card";
import { DeveloperDescription } from "@/components/developers/developer-description";
import { getDeveloperBySlug } from "@/lib/developers";

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("developer_detail");
  const developer = await getDeveloperBySlug(slug);

  if (!developer) notFound();

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-2 py-2 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BackToHome
              href="/developers"
              label={t("back_to_list")}
            />
            <Breadcrumb
              items={[
                { label: "Off Plan International", href: "/" },
                { label: t("all_developers"), href: "/developers" },
                { label: developer.name },
              ]}
            />
          </div>
          <div className="h-px w-full bg-[--grey-50]" />
        </div>

        <DeveloperHeader
          name={developer.name}
          image={developer.image}
          logo={developer.logo}
        />

        <div className="flex flex-col gap-8 md:flex-row mt-6">
          <div className="flex w-full flex-col gap-8 md:w-[65%] lg:w-[70%]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-body text-sm font-light text-[--text-primary]">
                <MapPin className="h-4 w-4 text-[--primary-main]" />
                <span>{developer.location}</span>
              </div>

              <h1 className="font-heading text-h2 font-bold text-[--text-primary]">
                {developer.name}
              </h1>

              <DeveloperDescription text={developer.description} />
            </div>
          </div>

          <aside className="w-full md:w-[35%] lg:w-[30%]">
            <DeveloperInfoCard
              onTimeCompletion={developer.onTimeCompletion}
              email={developer.email}
              phone={developer.phone}
              website={developer.website}
              developerSlug={developer.slug}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
