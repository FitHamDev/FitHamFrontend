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
    <div className="relative min-h-screen w-full flex bg-white/70 overflow-hidden">
      {/* Centered series title (big, white) */}
      <div className="absolute inset-x-0 top-6 z-50 flex justify-center pointer-events-none">
        <h1 className="text-[12rem] md:text-[16rem] font-black text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] tracking-wide uppercase text-center px-4 leading-[0.80]">
          {formatReeks(wedstrijd.reeksnaam, wedstrijd.reeks)}
        </h1>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 via-blue-600/70 to-blue-900/90 z-0" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[15%] z-10"
        style={{ backgroundImage: `url('/carrousel_item_pattern.png')` }}
      />

      <div className="absolute top-10 left-10 z-60 bg-red-600 text-white text-8xl px-10 py-6 rounded-2xl font-bold shadow-2xl">MATCH</div>

      {/* Match info: full width when no rangschikking, otherwise 48% to give more space */}
      <div className={`relative z-50 ${hasRang ? 'w-[48%]' : 'w-full'} flex flex-col items-center justify-center text-center p-6 pt-40`}>
        <div className="bg-blue-900/40 backdrop-blur-md p-14 rounded-[4rem] border-4 border-white/20 shadow-2xl w-full max-w-full mx-4">
          <h2 className="text-[8rem] lg:text-[10rem] font-black text-white drop-shadow-[0_6px_6px_rgba(0,0,0,0.8)] mb-10 leading-[0.85] flex flex-col gap-6">
            <span className="block">{home}</span>
            <span className="text-[9rem] text-yellow-400 font-bold opacity-90 leading-none">-</span>
            <span className="block">{away}</span>
          </h2>
          
          <div className="bg-black/20 rounded-[3rem] p-10 mb-12 inline-block border-4 border-white/10 shadow-inner">
            <p className="text-[24rem] leading-[0.75] text-white font-black drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] tracking-tighter">
              {wedstrijd.uitslag?.trim() || '0-0'}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-8">
            <p className="text-[7rem] text-white font-bold drop-shadow-md uppercase leading-none">
              {parsedDate.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })}
            </p>
            <p className="text-[9rem] text-yellow-400 font-black drop-shadow-md bg-black/20 px-16 py-6 rounded-3xl border-4 border-white/10 leading-none">
              {wedstrijd.aanvangsuur}
            </p>
          </div>
        </div>
      </div>

      {/* Rangschikking: reduced width slightly */}
      {hasRang && (
        <div className="relative z-50 w-[52%] flex items-center justify-center p-8 pt-40">
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
