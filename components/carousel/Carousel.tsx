
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import MatchSlide from "./MatchSlide";
import SponsorSlide from "./SponsorSlide";
import {
  useRankingsCache,
  useSortedMatches,
  useSponsorImages,
} from "./hooks/useCarouselData";
import { useAutoAdvanceCarousel, useCarouselItems, FADE_DURATION_MS } from "./hooks/useCarouselBehavior";
import theme from "../../utils/themeConfig";

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

  // Cross-fade: keep visible=true most of the time, briefly fade out before index change
  const [visible, setVisible] = useState(true);
  const [displayedIndex, setDisplayedIndex] = useState(carouselIndex);

  useEffect(() => {
    if (carouselIndex === displayedIndex) return;
    // Start fade-out
    setVisible(false);
    const timer = setTimeout(() => {
      // After fade-out completes, swap content and fade back in
      setDisplayedIndex(carouselIndex);
      setVisible(true);
    }, FADE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [carouselIndex, displayedIndex]);

  const displayedItem = carouselItems[displayedIndex];
  const fadeDurationSec = FADE_DURATION_MS / 1000;
  const { gradient: g, colors: c } = theme;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Persistent gradient background — always visible during fades */}
      <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(to bottom, ${g.top}, ${g.bottom})` }} />
      <div
        className="absolute inset-0 bg-cover bg-center z-[1]"
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')`, opacity: c.patternOpacity }}
      />

      {/* Fading content layer */}
      {displayedItem && (
        <div
          className="relative z-10 w-full h-full"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity ${fadeDurationSec}s ease-in-out`,
          }}
        >
          {displayedItem.type === 'match' ? (
            <MatchSlide match={displayedItem.data} rankingsCache={rankingsCache} />
          ) : (
            <SponsorSlide image={displayedItem.data} />
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel;