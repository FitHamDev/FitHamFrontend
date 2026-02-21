import { useEffect, useMemo, useState } from "react";
import { Wedstrijd } from "../../../utils/types";

/** Duration of the cross-fade transition in ms — keep in sync with Carousel.tsx */
export const FADE_DURATION_MS = 600;

export type CarouselItem =
  | { type: "match"; data: Wedstrijd }
  | { type: "sponsor"; data: string };

/**
 * Builds alternating carousel items from matches and sponsor images.
 */
export function useCarouselItems(matches: Wedstrijd[], sponsorImages: string[]): CarouselItem[] {
  return useMemo(() => {
    const total = Math.max(matches.length, sponsorImages.length) * 2;

    return Array.from({ length: total }, (_, index) => {
      if (index % 2 === 0 && matches.length > 0) {
        const match = matches[(index / 2) % matches.length];
        return match ? ({ type: "match", data: match } as CarouselItem) : null;
      }

      if (sponsorImages.length > 0) {
        const sponsor = sponsorImages[Math.floor(index / 2) % sponsorImages.length];
        return sponsor ? ({ type: "sponsor", data: sponsor } as CarouselItem) : null;
      }

      return null;
    }).filter((item): item is CarouselItem => item !== null);
  }, [matches, sponsorImages]);
}

/**
 * Advances the active slide index using per-item timing rules.
 */
export function useAutoAdvanceCarousel(carouselItems: CarouselItem[]): number {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (carouselItems.length === 0) return;

    const currentItem = carouselItems[carouselIndex];
    const delay = currentItem?.type === "sponsor" ? 7000 : 10000;

    const timeout = setTimeout(() => {
      setCarouselIndex((previous) => (previous + 1) % carouselItems.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [carouselIndex, carouselItems]);

  return carouselIndex;
}
