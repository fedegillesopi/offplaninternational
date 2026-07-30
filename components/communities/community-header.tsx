import Image from "next/image";

interface CommunityHeaderProps {
  name: string;
  image: string;
  mapQuery: string;
}

export function CommunityHeader({ name, image, mapQuery }: CommunityHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2 md:w-1/2">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="w-full overflow-hidden rounded-2 md:w-1/2">
        <iframe
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: "300px" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${name} location`}
          className="rounded-2"
        />
      </div>
    </div>
  );
}
