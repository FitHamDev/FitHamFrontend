export type WedstrijdType = 'competitie' | 'recreatief';

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

export interface Rangschikking {
  volgorde: string;
  ploegnaam: string;
  puntentotaal: string;
  isVCM: boolean;
}

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

export interface VolleyAdminKlassement {
  rangschikking: VolleyAdminRangschikking[];
}
