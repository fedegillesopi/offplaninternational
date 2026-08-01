import Image from "next/image";

interface CommunityHeaderProps {
  name: string;
  image: string | null;
  mapUrl: string | null;
}

export function CommunityHeader({ name, image, mapUrl }: CommunityHeaderProps) {
  const map = mapUrl ? (
    <div className="w-full overflow-hidden rounded-2 md:w-1/2">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "300px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups"
        title={name}
        className="rounded-2"
      />
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div
        className={
          map
            ? "relative aspect-[16/9] w-full overflow-hidden rounded-2 md:w-1/2"
            : "relative aspect-[16/9] w-full overflow-hidden rounded-2"
        }
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[--grey-100] font-heading text-h3 font-bold text-[--grey-300]">
            {name}
          </div>
        )}
      </div>
      {map}
    </div>
  );
}
