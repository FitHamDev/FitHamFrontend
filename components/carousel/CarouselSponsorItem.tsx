import React from "react";
import { useRouter } from "next/router";
import theme from "../../utils/themeConfig";

type Props = {
  images: string[];
};

/**
 * Renders one sponsor slide and applies theme-based image sizing.
 */
const CarouselSponsorItem: React.FC<Props> = ({ images }) => {
  const image = images[0];
  const { basePath } = useRouter();
  const { colors: c, gradient: g, layout: l } = theme;
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center" style={{ backgroundColor: g.top }}>
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
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}

export default CarouselSponsorItem;