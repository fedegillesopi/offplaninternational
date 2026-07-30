import Image from "next/image";

export function DeveloperHeader({ name, image, logo }: { name: string; image: string; logo: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2">
      <div className="relative aspect-[21/9] w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute bottom-4 right-4 flex size-20 items-center justify-center rounded-2 bg-white shadow-lg md:size-24">
        <Image
          src={logo}
          alt={`${name} logo`}
          width={64}
          height={64}
          className="size-14 object-contain md:size-16"
        />
      </div>
    </div>
  );
}
