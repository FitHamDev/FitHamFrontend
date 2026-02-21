import React from "react";
import CarouselSponsorItem from "./CarouselSponsorItem";

type Props = {
  image: string;
};

/**
 * Thin presentational wrapper for rendering a sponsor slide.
 */
const SponsorSlide: React.FC<Props> = ({ image }) => {
  return <CarouselSponsorItem images={[image]} />;
};

export default SponsorSlide;
