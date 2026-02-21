import { Rangschikking, VolleyAdminRangschikking, Wedstrijd } from "../../../utils/types";

/**
 * Removes league symbols and surrounding whitespace from team names.
 */
export const sanitizeTeamName = (name?: string): string =>
  (name ?? "").replaceAll(/[+-]/g, "").trim();

/**
 * Parses a date string in `dd/mm/yyyy` format.
 */
export const parseDDMMYYYY = (dateStr = ""): Date => {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
};

/**
 * Sorts matches chronologically by date and kickoff time.
 */
export const sortWedstrijdenByDateTime = (wedstrijden: Wedstrijd[]): Wedstrijd[] =>
  [...wedstrijden].sort((a, b) => {
    const [dayA, monthA, yearA] = a.datum.split("/");
    const [dayB, monthB, yearB] = b.datum.split("/");
    const dateA = new Date(`${yearA}-${monthA}-${dayA}T${a.aanvangsuur}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}T${b.aanvangsuur}`);
    return dateA.getTime() - dateB.getTime();
  });

/**
 * Maps internal series codes to their VolleyAdmin equivalents.
 */
export const mapSeriesToVolleyAdmin = (seriesCode: string): string => {
  const mapping: Record<string, string> = {
    "VDP2-B": "LDM1",
    "VDP4-B": "LDM2",
  };

  return mapping[seriesCode] || seriesCode;
};

/**
 * Converts VolleyAdmin ranking entries to internal ranking rows.
 */
export const convertVolleyAdminToRanking = (entries: VolleyAdminRangschikking[]): Rangschikking[] =>
  entries.map((team) => ({
    volgorde: team.volgorde,
    ploegnaam: sanitizeTeamName(team.ploegnaam),
    puntentotaal: team.puntentotaal,
    isVCM:
      team.ploegnaam.toLowerCase().includes("ham") ||
      team.ploegnaam.toLowerCase().includes("fit"),
  }));

/**
 * Formats raw series names/codes to more readable display labels.
 */
export const formatReeksDisplayName = (reeksnaam?: string | null, reeks?: string | null): string => {
  const raw = reeksnaam && reeksnaam.trim() !== "" ? reeksnaam.trim() : reeks || "";
  if (!raw) return "";

  const normalized = raw.trim();

  const isBekerVanLimburg = /\bBVL\b|Beker\s*van\s*Limburg/i.test(normalized);
  if (isBekerVanLimburg) {
    const youthAge = /U\s*-?\s*(\d{1,2})/i.exec(normalized)?.[1];

    const isJongens =
      /\bJU\b|\bJONGENS\b|\bJ\b/i.test(normalized) ||
      /VJU/i.test(normalized);
    const isMeisjes =
      /\bMU\b|\bMEISJES\b|\bM\b/i.test(normalized) ||
      /VMU/i.test(normalized);

    const promoMatch =
      /\bHP\s*-?\s*(\d+)\b/i.exec(normalized) ||
      /\bDP\s*-?\s*(\d+)\b/i.exec(normalized) ||
      /\b(HEREN|DAMES)\s*PROMO\s*(\d+)\b/i.exec(normalized);

    if (promoMatch) {
      const promoNumber = promoMatch[promoMatch.length - 1];
      const isHeren = /HP|HEREN/i.test(promoMatch[0]);
      return `Beker van Limburg ${isHeren ? "Heren" : "Dames"} Promo ${promoNumber}`;
    }

    if (youthAge) {
      if (isJongens && !isMeisjes) return `Beker van Limburg: U${youthAge} Jongens`;
      if (isMeisjes && !isJongens) return `Beker van Limburg: U${youthAge} Meisjes`;
      return `Beker van Limburg: U${youthAge}`;
    }

    if (/\bHP\b|\bHEREN\b/i.test(normalized)) return "Beker van Limburg Heren";
    if (/\bDP\b|\bDAMES\b/i.test(normalized)) return "Beker van Limburg Dames";

    return "Beker van Limburg";
  }

  const meisjes = /MU\s*-?\s*(\d{1,2})/i.exec(normalized) || /MU(\d{1,2})/i.exec(normalized);
  if (meisjes?.[1]) return `Meisjes U${meisjes[1]}`;

  const jongens = /JU\s*-?\s*(\d{1,2})/i.exec(normalized) || /JU(\d{1,2})/i.exec(normalized);
  if (jongens?.[1]) return `Jongens U${jongens[1]}`;

  const uShort = /U\s*-?\s*(\d{1,2})(?:\s*([jm]|jongens|meisjes))?/i.exec(normalized);
  if (uShort?.[1]) {
    const num = uShort[1];
    const tag = (uShort[2] || "").toString().toLowerCase();
    if (tag.startsWith("j") || /\bjongens\b/i.test(normalized) || /U\s*-?\s*\d+\s*J\b/i.test(normalized)) {
      return `U${num} Jongens`;
    }
    if (tag.startsWith("m") || /\bmeisjes\b/i.test(normalized) || /U\s*-?\s*\d+\s*M\b/i.test(normalized)) {
      return `U${num} Meisjes`;
    }
    return `U${num}`;
  }

  const herenPromo = /HP\s*-?\s*(\d+)/i.exec(normalized) || /HP(\d+)/i.exec(normalized);
  if (herenPromo?.[1]) return `Heren Promo ${herenPromo[1]}`;

  const damesPromo = /DP\s*-?\s*(\d+)/i.exec(normalized) || /DP(\d+)/i.exec(normalized);
  if (damesPromo?.[1]) return `Dames Promo ${damesPromo[1]}`;

  const bekerLimburg = /BVL\s*-?\s*(\d+)/i.exec(normalized) || /BVL(\d+)/i.exec(normalized);
  if (bekerLimburg?.[1]) return "Beker van Limburg";

  return normalized;
};

/**
 * Checks whether a ranking team is one of the teams in the current match.
 */
export const isPlayingTeam = (teamName: string, home?: string, away?: string): boolean => {
  if (!home || !away) return false;

  const normalizedName = sanitizeTeamName(teamName).toLowerCase();
  const normalizedHome = sanitizeTeamName(home).toLowerCase();
  const normalizedAway = sanitizeTeamName(away).toLowerCase();

  return normalizedName === normalizedHome || normalizedName === normalizedAway;
};

/**
 * Estimates wins from points using a simple 3-points-per-win model.
 */
export const calculateEstimatedWins = (points: number): number => Math.floor(points / 3);
