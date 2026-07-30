import Image from "next/image"
import { Link } from "@/i18n/navigation"

interface DeveloperCardProps {
  name: string
  description: string
  image: string
  logo: string
  slug: string
}

export function DeveloperCard({ name, description, image, logo, slug }: DeveloperCardProps) {
  return (
    <Link
      href={`/developer/${slug}`}
      className="group block rounded-2 bg-white p-4 no-underline shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={name}
          width={600}
          height={400}
          className="h-[200px] w-full object-cover"
        />
        <div className="absolute bottom-3 right-3 flex size-16 items-center justify-center rounded-lg bg-white shadow-md">
          <Image
            src={logo}
            alt={`${name} logo`}
            width={48}
            height={48}
            className="size-10 object-contain"
          />
        </div>
      </div>
      <div className="px-1 pb-2">
        <h3 className="font-heading text-2xl font-regular text-[--text-primary] mb-1">
          {name}
        </h3>
        <p className="font-body text-sm text-[--grey-200] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  )
}
