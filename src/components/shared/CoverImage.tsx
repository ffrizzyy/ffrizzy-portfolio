import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Renders a piece of the generated artwork, or a real screenshot once one is
 * dropped over the same path.
 *
 * Uses `fill`, so the caller owns the aspect ratio through a positioned parent.
 * That keeps the layout stable no matter what aspect ratio a replacement image
 * arrives in, and it avoids the cumulative layout shift that width and height
 * without a container would allow.
 */
export function CoverImage({
  src,
  alt,
  className,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Only for the hero image, which is above the fold. */
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
