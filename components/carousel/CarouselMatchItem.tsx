import React, { useState, useEffect } from "react";
import { Wedstrijd, Rangschikking } from "../../utils/types";
import { useRouter } from 'next/router';
import RankingTable from "./RankingTable";
import theme from "../../utils/themeConfig";
import {
  formatReeksDisplayName,
  parseDDMMYYYY,
  sanitizeTeamName,
} from "./helpers/carouselHelpers";

type Props = {
  match: Wedstrijd;
  ranking?: Rangschikking[];
};

/**
 * Renders one match slide with optional ranking table.
 */
const CarouselMatchItem: React.FC<Props> = ({ match, ranking }) => {
  const parsedDate = parseDDMMYYYY(match.datum);
  const { basePath } = useRouter();
  const homeTeam = sanitizeTeamName(match.thuisploeg);
  const awayTeam = sanitizeTeamName(match.bezoekersploeg);
  const { colors: c, gradient: g, layout: l, text: t } = theme;
  const hasRanking = Array.isArray(ranking) && ranking.length > 0;
  const contentContainerWidthClass = hasRanking ? l.maxContentWidth : l.singlePaneContentWidth;
  const matchCardSizeClass = hasRanking ? l.matchCardSize : l.matchCardSizeSingle;
  const titleText = formatReeksDisplayName(match.reeksnaam, match.reeks);
  const isBekerMatch = /(\bbvl\b|\bbek(?:er)?\b|\bcup\b)/i.test(`${match.reeks ?? ''} ${match.reeksnaam ?? ''}`);
  const showBekerSubtitle = isBekerMatch || !hasRanking;

  // Dynamically calculate how many teams fit based on screen height.
  const [maxTeams, setMaxTeams] = useState(11);
  useEffect(() => {
    const calcMaxTeams = () => {
      const vh = window.innerHeight;
      const available = vh - l.reserveTop - l.reserveBottom - l.reserveHeader - l.reserveFooter;
      const fits = Math.max(l.minTeams, Math.floor(available / l.rowHeight));
      setMaxTeams(fits);
    };
    calcMaxTeams();
    window.addEventListener('resize', calcMaxTeams);
    return () => window.removeEventListener('resize', calcMaxTeams);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden" style={{ backgroundColor: g.top }}>
      {/* Centered series title with yellow accent bars */}
      <div className={`absolute ${l.titleTop} left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full ${contentContainerWidthClass} px-0 flex items-center justify-center gap-4`}>
        <div className={`${l.accentBarHeightMobile} ${l.accentBarHeightDesktop} flex-1 min-w-[clamp(9rem,14vw,14rem)]`} style={{ backgroundColor: c.accent }}></div>
        <div className="flex flex-col items-center justify-center">
          <h1 className={`${t.titleMobile} ${t.titleDesktop} font-black text-white drop-shadow-[0_6px_6px_rgba(0,0,0,0.8)] tracking-wider uppercase text-center leading-none whitespace-nowrap`}>
            {titleText}
          </h1>
          {showBekerSubtitle && (
            <p className="text-[1.7rem] md:text-[3rem] font-black tracking-wide uppercase leading-none mt-1" style={{ color: c.accent }}>
              Beker van Limburg
            </p>
          )}
        </div>
        <div className={`${l.accentBarHeightMobile} ${l.accentBarHeightDesktop} flex-1 min-w-[clamp(9rem,14vw,14rem)]`} style={{ backgroundColor: c.accent }}></div>
      </div>
      {/* Gradient background */}
      <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(to bottom, ${g.top}, ${g.bottom})` }}></div>
      <div
        className={`absolute inset-0 bg-cover bg-center z-10`}
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')`, opacity: c.patternOpacity }}
      />
      
      {/* Content container */}
      <div className="relative z-50 w-full flex justify-center">
        <div className={`w-full ${contentContainerWidthClass} mx-auto px-0 md:px-0 flex items-center justify-center ${l.matchRangGap}`}>

          {/* Match (left) */}
          <div className={`flex-shrink-0 ${hasRanking ? `${l.matchColumnWidth} w-full` : 'w-full'} flex flex-col items-center justify-center text-center p-6 ${l.contentPaddingTop}`}>
            <div
              className={`backdrop-blur-md pt-2 px-16 pb-2 rounded-xl shadow-2xl flex flex-col justify-center overflow-hidden ${matchCardSizeClass}`}
              style={{ backgroundColor: c.matchCardBg, borderWidth: 1, borderColor: c.matchCardBorder }}
            >
              <h2 className={`${t.teamNameMobile} ${t.teamNameDesktop} text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)] mb-3 leading-tight flex flex-col gap-1`}>
                <span className="block leading-none font-extrabold">{homeTeam}</span>
                <span className="text-[1.5rem] text-white font-bold opacity-90 leading-none py-1">-</span>
                <span className="block leading-none font-extrabold">{awayTeam}</span>
              </h2>

              <div
                className="rounded-[1.125rem] p-3 mb-4 inline-block shadow-inner mx-auto"
                style={{ backgroundColor: c.scoreBoxBg, borderWidth: 2, borderColor: c.scoreBoxBorder }}
              >
                <p className={`${t.scoreMobile} ${t.scoreDesktop} leading-[1] text-white font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tighter`}>
                  {match.uitslag?.trim() || "0 - 0"}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className={`${t.date} text-white font-bold drop-shadow-md uppercase leading-none`}>
                  {parsedDate.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })}
                </p>
                <p
                  className={`${t.time} font-black drop-shadow-md px-4 py-2 rounded-xl leading-none`}
                  style={{ color: c.accent, backgroundColor: c.timeBadgeBg, borderWidth: 3, borderColor: c.timeBadgeBorder }}
                >
                  {match.aanvangsuur}
                </p>
              </div>
            </div>
          </div>

          {/* Rangschikking (right) */}
          {hasRanking && (
            <div className={`flex-shrink-0 ${l.rangColumnWidth} w-full flex items-center justify-center p-4 ${l.contentPaddingTop}`}>
              <div className="w-full">
                <RankingTable 
                  ranking={ranking}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  maxTeams={maxTeams}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CarouselMatchItem;