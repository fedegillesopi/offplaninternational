import Image from "next/image"
import { Link } from "@/i18n/navigation"

interface CommunityCardProps {
  name: string
  shortDescription: string
  image: string
  slug: string
}

export function CommunityCard({ name, shortDescription, image, slug }: CommunityCardProps) {
  return (
    <Link
      href={`/community/${slug}`}
      className="group block rounded-2 bg-white p-4 no-underline shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative mb-3 h-[200px] overflow-hidden rounded-xl bg-[--grey-100]">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={600}
            height={400}
            className="h-[200px] w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center font-heading text-xl font-bold text-[--grey-300]">
            {name}
          </div>
        )}
      </div>
      <div className="px-1 pb-2">
        <h3 className="font-heading text-2xl font-regular text-[--text-primary] mb-1">
          {name}
        </h3>
        <p className="font-body text-sm text-[--grey-200] leading-relaxed line-clamp-2">
          {shortDescription}
        </p>
      </div>
    </Link>
  )
}
