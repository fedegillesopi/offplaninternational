import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToHome } from "@/components/site/back-to-home";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { CommunityHeader } from "@/components/communities/community-header";
import { CommunityInfoCard } from "@/components/communities/community-info-card";
import { CommunityGallery } from "@/components/communities/community-gallery";
import { getCommunityBySlug } from "@/lib/communities";
import { sanitizeHtml } from "@/lib/sanitize-html";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("community_detail");
  const locale = await getLocale();
  const community = await getCommunityBySlug(slug, locale);

  if (!community) notFound();

  const description = community.description
    ? sanitizeHtml(community.description)
    : null;

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
          image={community.highlight_image}
          mapUrl={community.google_map_url}
        />

        <div className="flex flex-col gap-8 md:flex-row mt-6">
          <div className="flex w-full flex-col gap-8 md:w-[65%] lg:w-[70%]">
            {description && (
              <div
                className="community-description font-body text-base font-light leading-relaxed text-[--text-primary]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>

          <aside className="w-full md:w-[35%] lg:w-[30%]">
            <CommunityInfoCard
              averagePriceRange={community.average_price_range}
              communitySlug={community.slug}
            />
          </aside>
        </div>

        <div className="h-px w-full bg-[--grey-50]" />

        {community.images.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-h3 font-bold text-[--text-primary]">
              {t("gallery")}
            </h2>
            <CommunityGallery images={community.images} name={community.name} />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
