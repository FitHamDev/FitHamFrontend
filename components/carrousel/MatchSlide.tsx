import React from "react";
import { Wedstrijd, Rangschikking } from "../../utils/types";
import RangschikkingTable from "./rangschikking";

type Props = {
  wedstrijd: Wedstrijd;
  rangschikking?: Rangschikking[];
};

const parseDDMMYYYY = (dateStr = "") => {
  const [d, m, y] = dateStr.split("/");
  return new Date(`${y}-${m}-${d}`);
};

const sanitize = (s?: string) => (s ?? "").replaceAll('+', '').replaceAll('-', '').trim();

// Map reeks codes (reeksnaam or reeks) to friendly display names
const formatReeks = (reeksnaam?: string | null, reeks?: string | null): string => {
  const raw = reeksnaam && reeksnaam.trim() !== "" ? reeksnaam.trim() : (reeks || "");
  if (!raw) return "";
  const r = raw.trim();

  const mu = /MU\s*-?\s*(\d{1,2})/i.exec(r) || /MU(\d{1,2})/i.exec(r);
  if (mu?.[1]) return `Meisjes U${mu[1]}`;

  const ju = /JU\s*-?\s*(\d{1,2})/i.exec(r) || /JU(\d{1,2})/i.exec(r);
  if (ju?.[1]) return `Jongens U${ju[1]}`;

  const hp = /HP\s*-?\s*(\d+)/i.exec(r) || /HP(\d+)/i.exec(r);
  if (hp?.[1]) return `Heren Promo ${hp[1]}`;

  const dp = /DP\s*-?\s*(\d+)/i.exec(r) || /DP(\d+)/i.exec(r);
  if (dp?.[1]) return `Dames Promo ${dp[1]}`;

  const bvl = /BVL\s*-?\s*(\d+)/i.exec(r) || /BVL(\d+)/i.exec(r);
  if (bvl?.[1]) return `Beker van Limburg`;

  return r;
};

const MatchSlide: React.FC<Props> = ({ wedstrijd, rangschikking }) => {
  const parsedDate = parseDDMMYYYY(wedstrijd.datum);
  const home = sanitize(wedstrijd.thuisploeg);
  const away = sanitize(wedstrijd.bezoekersploeg);
  const hasRang = Array.isArray(rangschikking) && rangschikking.length > 0;

  return (
    <div className="relative min-h-screen w-full flex bg-white/70">
      {/* Centered series title (big, white) */}
      <div className="absolute inset-x-0 top-8 z-50 flex justify-center pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">{formatReeks(wedstrijd.reeksnaam, wedstrijd.reeks)}</h1>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-blue-500/60 to-blue-900/80 z-0" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[8%] z-10"
        style={{ backgroundImage: `url('/carrousel_item_pattern.png')` }}
      />

      <div className="absolute top-4 left-4 z-60 bg-red-600 text-white px-3 py-1 rounded-md font-bold">MATCH</div>

      {/* Match info: full width when no rangschikking, otherwise 40% */}
      <div className={`relative z-50 ${hasRang ? 'w-2/5' : 'w-full'} flex flex-col items-center justify-center text-center p-8`}>
        <h2 className="text-[1.5rem] font-bold text-white drop-shadow-lg mb-4">{home} - {away}</h2>
        <p className="text-[2.5rem] text-white font-bold drop-shadow-lg mb-4">{wedstrijd.uitslag?.trim() || '0 - 0'}</p>
        <p className="text-[1.2rem] text-white drop-shadow-lg mb-2">{(wedstrijd.reeksnaam?.trim() || wedstrijd.reeks)}</p>
        <p className="text-[1.2rem] text-white drop-shadow-lg">{parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {wedstrijd.aanvangsuur}</p>
      </div>

      {/* Rangschikking: only render when data exists */}
      {hasRang && (
        <div className="relative z-50 w-3/5 flex items-center justify-center p-8">
          <div className="w-full">
            <RangschikkingTable
              rankschikking={rangschikking}
              thuisploeg={home}
              bezoekersploeg={away}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchSlide;
