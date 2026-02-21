/** Supported match categories. */
export type WedstrijdType = 'competitie' | 'recreatief';

/** Internal match model used throughout the app. */
export interface Wedstrijd {
  type: WedstrijdType;
  datum: string;
  aanvangsuur: string;
  reeks: string;
  reeksnaam?: string;
  thuisploeg: string;
  bezoekersploeg: string;
  uitslag: string;
  stamnummer_thuisclub: string;
  stamnummer_bezoekersclub: string;
  week: number;
  timestamp: number;
}

/** Internal ranking row model used by the UI. */
export interface Rangschikking {
  volgorde: string;
  ploegnaam: string;
  puntentotaal: string;
  isVCM: boolean;
}

/** Raw VolleyAdmin ranking row. */
export interface VolleyAdminRangschikking {
  reeks: string;
  reeksid: string;
  wedstrijdtype: string;
  volgorde: string;
  ploegid: string;
  ploegnaam: string;
  aantalGespeeldeWedstrijden: string;
  aantalGewonnen30_31: string;
  aantalGewonnen32: string;
  aantalVerloren32: string;
  aantalVerloren30_31: string;
  aantalGewonnenSets: string;
  aantalVerlorenSets: string;
  puntentotaal: string;
  forfait: string;
}

/** VolleyAdmin ranking response model. */
export interface VolleyAdminKlassement {
  rangschikking: VolleyAdminRangschikking[];
}

// English aliases for readability in newer code.
export type MatchType = WedstrijdType;
export type Match = Wedstrijd;
export type Ranking = Rangschikking;
export type VolleyAdminRanking = VolleyAdminRangschikking;
export type VolleyAdminRankingResponse = VolleyAdminKlassement;
