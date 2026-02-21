import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import theme from "../../utils/themeConfig";

type Props = {
  images: string[];
};

/**
 * Renders one sponsor slide with fade-in transition and GPU-accelerated compositing.
 */
const CarouselSponsorItem: React.FC<Props> = ({ images }) => {
  const image = images[0];
  const { basePath } = useRouter();
  const { colors: c, gradient: g, layout: l } = theme;
  const [loaded, setLoaded] = useState(false);

  // Reset fade state when the image source changes
  useEffect(() => {
    setLoaded(false);
  }, [image]);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center"
      style={{ backgroundColor: g.top, willChange: 'contents' }}
    >
      <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(to bottom, ${g.top}, ${g.bottom})` }}></div>
      <div 
        className="absolute inset-0 bg-cover bg-center z-10"
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')`, opacity: c.sponsorPatternOpacity }}
      ></div>
      <div className="absolute flex flex-col items-center justify-center h-full w-full z-50 text-center">
        <img
          src={image}
          alt="Sponsor"
          className={`object-contain ${l.sponsorImageHeight} ${l.sponsorImageWidth} ${l.sponsorImageMinHeight} ${l.sponsorImageMinWidth} drop-shadow-lg`}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease-in',
            willChange: 'opacity',
          }}
          onLoad={() => setLoaded(true)}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}

export default CarouselSponsorItem;