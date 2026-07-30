import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToHome } from "@/components/site/back-to-home";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { CommunityHeader } from "@/components/communities/community-header";
import { CommunityInfoCard } from "@/components/communities/community-info-card";
import { CommunityGallery } from "@/components/communities/community-gallery";
import { mockCommunities } from "@/lib/mock-communities";
import type { CommunityData } from "@/lib/types";

function getCommunityBySlug(slug: string): CommunityData | undefined {
  return mockCommunities.find((c) => c.slug === slug);
}

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("community_detail");
  const community = getCommunityBySlug(slug);

  if (!community) notFound();

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-2 py-2 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BackToHome
              href="/communities"
              label={t("back_to_list")}
            />
            <Breadcrumb
              items={[
                { label: "Off Plan International", href: "/" },
                { label: t("all_communities"), href: "/communities" },
                { label: community.name },
              ]}
            />
          </div>
          <div className="h-px w-full bg-[--grey-50]" />
        </div>

        <CommunityHeader
          name={community.name}
          image={community.image}
          mapQuery={community.mapQuery}
        />

        <div className="flex flex-col gap-8 md:flex-row mt-6">
          <div className="flex w-full flex-col gap-8 md:w-[65%] lg:w-[70%]">
            <div className="whitespace-pre-line font-body text-base font-light leading-relaxed text-[--text-primary]">
              {community.description}
            </div>
          </div>

          <aside className="w-full md:w-[35%] lg:w-[30%]">
            <CommunityInfoCard
              averagePriceRange={community.averagePriceRange}
              developerName={community.developerName}
              developerSlug={community.developerSlug}
              communitySlug={community.slug}
            />
          </aside>
        </div>

        <div className="h-px w-full bg-[--grey-50]" />

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-h3 font-bold text-[--text-primary]">
            {t("gallery")}
          </h2>
          <CommunityGallery images={community.images} name={community.name} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
