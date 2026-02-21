
import React from "react";
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