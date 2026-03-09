"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithSkeletonProps extends Omit<ImageProps, "onLoad"> {
  skeletonClassName?: string;
}

/**
 * Next Image wrapper that shows a brand-colored skeleton while loading.
 * Uses the standard shimmer/pulse pattern from the brand palette.
 */
export function ImageWithSkeleton({
  skeletonClassName,
  className,
  alt,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-[#E0C4BC]/20 dark:bg-[#0d2a1f] animate-pulse rounded-inherit ${skeletonClassName || ""}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E0C4BC]/10 dark:via-white/5 to-transparent animate-shimmer" />
        </div>
      )}

      <Image
        {...props}
        alt={alt}
        className={`${className || ""} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
