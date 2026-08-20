import Image from "next/image"
import { Mail, MessageCircle, ExternalLink } from "lucide-react"

interface BrokerHeaderProps {
  profileImage: string
  name: string
  personalUrl: string
  activePropertiesCount: number
  closedTransactions: number
  email: string
  whatsapp: string
}

function safeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) return ""
  try {
    return new URL(url).hostname ? url : ""
  } catch {
    return ""
  }
}

export function BrokerHeader({
  profileImage,
  name,
  personalUrl,
  activePropertiesCount,
  closedTransactions,
  email,
  whatsapp,
}: BrokerHeaderProps) {
  const safePersonalUrl = safeUrl(personalUrl)

  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-full bg-[--grey-50]">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-heading text-h3 font-bold text-[--grey-300]">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h1 className="font-heading text-h4 font-bold text-[--text-primary]">
          {name}
        </h1>
        {safePersonalUrl && (
          <a
            href={safePersonalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 font-body text-sm font-medium text-[--primary-main] no-underline hover:underline"
          >
            Visit personal page
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <div className="flex gap-4 font-body text-sm text-[--grey-300] mb-8">
          <span>
            {activePropertiesCount} active{" "}
            {activePropertiesCount === 1 ? "property" : "properties"}
          </span>
          <span>
            {closedTransactions} closed{" "}
            {closedTransactions === 1 ? "transaction" : "transactions"}
          </span>
        </div>

        <div className="flex gap-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 rounded-1 border border-transparent bg-[--primary-light] px-3 py-2 font-body text-sm font-medium text-[--primary-main] transition-colors hover:bg-[--primary-main] hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-1 border border-transparent bg-[--primary-light] px-3 py-2 font-body text-sm font-medium text-[--primary-main] transition-colors hover:bg-[--primary-main] hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
