import React from "react";
import CarouselMatchItem from "./CarouselMatchItem";
import { Rangschikking, Wedstrijd } from "../../utils/types";

type Props = {
  match: Wedstrijd;
  rankingsCache: Record<string, Rangschikking[]>;
};

/**
 * Thin presentational wrapper for rendering a match slide.
 */
const MatchSlide: React.FC<Props> = ({ match, rankingsCache }) => {
  return (
    <CarouselMatchItem
      match={match}
      ranking={rankingsCache[match.reeks]}
    />
  );
};

export default MatchSlide;
