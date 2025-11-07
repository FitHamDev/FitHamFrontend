import React from "react";
import { Wedstrijd, Rangschikking } from "../../utils/types";
import { useRouter } from 'next/router';
import RangschikkingTable from "./rangschikking";

// Helper to parse dd/mm/yyyy to Date
function parseDDMMYYYY(dateStr: string) {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

type Props = {
  wedstrijd: Wedstrijd;
  rangschikking: Rangschikking[];
};

const CarrouselMatchItem: React.FC<Props> = ({ wedstrijd, rangschikking }) => { 
  const parsedDate = parseDDMMYYYY(wedstrijd.datum);
  const { basePath } = useRouter();

  // Map reeks codes (reeksnaam or reeks) to friendly display names
  const formatReeks = (reeksnaam?: string | null, reeks?: string | null): string => {
    const raw = reeksnaam && reeksnaam.trim() !== "" ? reeksnaam.trim() : (reeks || "");
    if (!raw) return "";
    const r = raw.trim();

    // MU -> Meisjes U<number>
    const mu = /MU\s*-?\s*(\d{1,2})/i.exec(r) || /MU(\d{1,2})/i.exec(r);
    if (mu?.[1]) {
      return `Meisjes U${mu[1]}`;
    }

    // JU -> Jongens U<number>
    const ju = /JU\s*-?\s*(\d{1,2})/i.exec(r) || /JU(\d{1,2})/i.exec(r);
    if (ju?.[1]) {
      return `Jongens U${ju[1]}`;
    }

    // HP -> Heren Promo <number>
    const hp = /HP\s*-?\s*(\d+)/i.exec(r) || /HP(\d+)/i.exec(r);
    if (hp?.[1]) {
      return `Heren Promo ${hp[1]}`;
    }

    const dp = /DP\s*-?\s*(\d+)/i.exec(r) || /DP(\d+)/i.exec(r);
    if (dp?.[1]) {
      return `Dames Promo ${dp[1]}`;
    }

    const bvl = /BVL\s*-?\s*(\d+)/i.exec(r) || /BVL(\d+)/i.exec(r);
    if (bvl?.[1]) {
      return `Beker van Limburg`;
    }

    // Fallback: return original value
    return r;
  };

  return (
    <div className="relative min-h-screen w-full flex bg-white/70">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-blue-500/60 to-blue-900/80 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[8%] z-10"
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')` }}
      ></div>
      
  {/* Left side - Match info (40%) */}
  <div className="relative z-50 w-2/5 flex flex-col items-center justify-center text-center p-8">
  <h2 className="text-[1.5rem] font-bold text-white drop-shadow-lg mb-4">{wedstrijd.thuisploeg.replaceAll('+', '').replaceAll('-', '')} - {wedstrijd.bezoekersploeg.replaceAll('+', '').replaceAll('-', '')}</h2>
        <p className="text-[2.5rem] text-white font-bold drop-shadow-lg mb-4">{wedstrijd.uitslag && wedstrijd.uitslag.trim() !== "" ? wedstrijd.uitslag : "0 - 0"}</p>
  <p className="text-[1.2rem] text-white drop-shadow-lg mb-2">{formatReeks(wedstrijd.reeksnaam, wedstrijd.reeks)}</p>
        <p className="text-[1.2rem] text-white drop-shadow-lg">{parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {wedstrijd.aanvangsuur}</p>
      </div>
      
  {/* Right side - Rangschikking table (60%) */}
  <div className="relative z-50 w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <RangschikkingTable 
            rankschikking={rangschikking} 
            thuisploeg={wedstrijd.thuisploeg.replaceAll('+', '').replaceAll('-', '')}
            bezoekersploeg={wedstrijd.bezoekersploeg.replaceAll('+', '').replaceAll('-', '')}
          />
        </div>
      </div>
    </div>
  );
};

export default CarrouselMatchItem;