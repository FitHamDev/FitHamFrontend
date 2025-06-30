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
