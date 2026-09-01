import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { BrokerHeader } from "@/components/brokers/broker-header"
import { BrokerDescription } from "@/components/brokers/broker-description"
import { PropertyCard } from "@/components/properties/property-card"
import { getBrokerBySlug } from "@/lib/brokers"
import { getBrokerActiveProperties } from "@/lib/properties"
import { createClient } from "@/lib/supabase/server"
import { Link } from "@/i18n/navigation"

export default async function BrokerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const t = await getTranslations("broker_detail")
  const broker = await getBrokerBySlug(slug)

  if (!broker) notFound()

  const supabase = await createClient()

  const [countResult, properties] = await Promise.all([
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("listed_by_id", broker.userProfileId)
      .eq("listed_by_type", "broker")
      .eq("is_active", true),
    getBrokerActiveProperties(
      broker.userProfileId,
      broker.name,
      broker.slug,
    ),
  ])

  const activePropertiesCount = countResult.count ?? 0

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-2 py-2 md:px-6 md:py-6">
        <BrokerHeader
          profileImage={broker.profileImage}
          name={broker.name}
          personalUrl={broker.personalUrl}
          activePropertiesCount={activePropertiesCount}
          closedTransactions={broker.closedTransactions}
          email={broker.emailPublic}
          whatsapp={broker.whatsapp}
        />

        {broker.description && (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-h3 font-bold text-[--text-primary]">
              {t("about_broker", { name: broker.name })}
            </h2>
            <BrokerDescription text={broker.description} />
          </section>
        )}

        <hr className="w-full border-[--grey-50]" />

        {properties.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-h3 font-bold text-[--text-primary]">
                {t("active_properties")}
              </h2>
              <Link
                href="/properties"
                className="font-body text-sm font-medium text-[--primary-main] no-underline hover:underline"
              >
                {t("view_all")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
