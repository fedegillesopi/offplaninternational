import Image from "next/image";

export function DevelopmentHeader({ name, image }: { name: string; image: string }) {
  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </div>
  );
}
