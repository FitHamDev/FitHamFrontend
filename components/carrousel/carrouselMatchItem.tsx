import React from "react";
import { Wedstrijd, Rangschikking } from "../../utils/types";
import { useRouter } from 'next/router';
import RangschikkingTable from "./rangschikking";

const parseDDMMYYYY = (dateStr = "") => {
  const [d, m, y] = dateStr.split("/");
  return new Date(`${y}-${m}-${d}`);
};

const sanitize = (s?: string) => (s ?? "").replaceAll('+', '').replaceAll('-', '').trim();

type Props = {
  wedstrijd: Wedstrijd;
  rangschikking?: Rangschikking[];
};

const CarrouselMatchItem: React.FC<Props> = ({ wedstrijd, rangschikking }) => { 
  const parsedDate = parseDDMMYYYY(wedstrijd.datum);
  const { basePath } = useRouter();
  const home = sanitize(wedstrijd.thuisploeg);
  const away = sanitize(wedstrijd.bezoekersploeg);
  const hasRang = Array.isArray(rangschikking) && rangschikking.length > 0;

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

  return (
    <div className="relative min-h-screen w-full flex bg-white/70">
      {/* Centered series title (big, white) */}
      <div className="absolute inset-x-0 mt-12 z-50 flex justify-center pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">{formatReeks(wedstrijd.reeksnaam, wedstrijd.reeks)}</h1>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-blue-500/60 to-blue-900/80 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[8%] z-10"
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')` }}
      />
      
      {/* Left side - Match info: full width when no rangschikking */}
      <div className={`relative z-50 ${hasRang ? 'w-2/5' : 'w-full'} flex flex-col items-center justify-center text-center p-8`}>
        <h2 className="text-[1.5rem] font-bold text-white drop-shadow-lg mb-4">{home} - {away}</h2>
        <p className="text-[2.5rem] text-white font-bold drop-shadow-lg mb-4">{wedstrijd.uitslag?.trim() || "0 - 0"}</p>
        <p className="text-[1.2rem] text-white drop-shadow-lg mb-2">{formatReeks(wedstrijd.reeksnaam, wedstrijd.reeks)}</p>
        <p className="text-[1.2rem] text-white drop-shadow-lg">{parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {wedstrijd.aanvangsuur}</p>
      </div>
      
      {/* Right side - Rangschikking table (60%) */}
      {hasRang && (
        <div className="relative z-50 w-3/5 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
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

export default CarrouselMatchItem;