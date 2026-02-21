
import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import MatchSlide from "./MatchSlide";
import SponsorSlide from "./SponsorSlide";
import {
  useRankingsCache,
  useSortedMatches,
  useSponsorImages,
} from "./hooks/useCarouselData";
import { useAutoAdvanceCarousel, useCarouselItems } from "./hooks/useCarouselBehavior";

/**
 * Preloads the next sponsor image so it's in the browser cache before the slide transitions.
 */
function usePreloadNextImage(carouselItems: ReturnType<typeof useCarouselItems>, currentIndex: number) {
  useEffect(() => {
    if (carouselItems.length === 0) return;
    // Look ahead up to 2 slides to find the next sponsor
    for (let offset = 1; offset <= 2; offset++) {
      const nextIdx = (currentIndex + offset) % carouselItems.length;
      const nextItem = carouselItems[nextIdx];
      if (nextItem?.type === 'sponsor') {
        const img = new Image();
        img.src = nextItem.data;
        if (typeof img.decode === 'function') {
          img.decode().catch(() => undefined);
        }
        break;
      }
    }
  }, [currentIndex, carouselItems]);
}

/**
 * Main carousel container that orchestrates data hooks and slide rendering.
 */
const Carousel: React.FC = () => {
  const { basePath } = useRouter();
  const sponsorImages = useSponsorImages(basePath);
  const matches = useSortedMatches();
  const rankingsCache = useRankingsCache(matches);
  const carouselItems = useCarouselItems(matches, sponsorImages);
  const carouselIndex = useAutoAdvanceCarousel(carouselItems);
  const currentItem = carouselItems[carouselIndex];

  // Preload the next sponsor image before the slide changes
  usePreloadNextImage(carouselItems, carouselIndex);

  return (
    <div className="min-h-screen w-full">
      {currentItem && (
        <div className="w-full h-full">
          {currentItem.type === 'match' ? (
            <MatchSlide match={currentItem.data} rankingsCache={rankingsCache} />
          ) : (
            <SponsorSlide image={currentItem.data} />
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel;