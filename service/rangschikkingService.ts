import { VolleyAdminKlassement, VolleyAdminRangschikking } from '../utils/types';

const DEFAULT_CLUB_ID = 'L-0759';

/**
 * Parses XML string using Regex as a fallback or for non-browser environments
 */
const parseXMLWithRegex = (xmlString: string): VolleyAdminKlassement => {
  const rangschikking: VolleyAdminRangschikking[] = [];
  const parts = xmlString.split('<rangschikking>');

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const endIndex = part.indexOf('</rangschikking>');
    if (endIndex === -1) continue;

    const rangschikkingBlock = part.substring(0, endIndex);

    const extractValue = (tagName: string): string => {
      const startTag = `<${tagName}>`;
      const endTag = `</${tagName}>`;
      const startIndex = rangschikkingBlock.indexOf(startTag);
      const endIndex = rangschikkingBlock.indexOf(endTag);
      return (startIndex === -1 || endIndex === -1) 
        ? '' 
        : rangschikkingBlock.substring(startIndex + startTag.length, endIndex).trim();
    };

    rangschikking.push({
      reeks: extractValue('reeks'),
      reeksid: extractValue('reeksid'),
      wedstrijdtype: extractValue('wedstrijdtype'),
      volgorde: extractValue('volgorde'),
      ploegid: extractValue('ploegid'),
      ploegnaam: extractValue('ploegnaam'),
      aantalGespeeldeWedstrijden: extractValue('aantalGespeeldeWedstrijden'),
      aantalGewonnen30_31: extractValue('aantalGewonnen30_31'),
      aantalGewonnen32: extractValue('aantalGewonnen32'),
      aantalVerloren32: extractValue('aantalVerloren32'),
      aantalVerloren30_31: extractValue('aantalVerloren30_31'),
      aantalGewonnenSets: extractValue('aantalGewonnenSets'),
      aantalVerlorenSets: extractValue('aantalVerlorenSets'),
      puntentotaal: extractValue('puntentotaal'),
      forfait: extractValue('forfait')
    });
  }

  return { rangschikking };
};

/**
 * Parses XML string to Object using DOMParser with Regex fallback
 */
const parseXMLToObject = (xmlString: string): VolleyAdminKlassement => {
  try {
    if (typeof window === 'undefined' || !window.DOMParser) {
      return parseXMLWithRegex(xmlString);
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    if (xmlDoc.querySelector('parsererror') || xmlDoc.querySelectorAll('rangschikking').length === 0) {
      return parseXMLWithRegex(xmlString);
    }

    const rangschikkingElements = xmlDoc.querySelectorAll('rangschikking');
    const rangschikking: VolleyAdminRangschikking[] = Array.from(rangschikkingElements).map((element) => {
      const getVal = (tag: string) => element.querySelector(tag)?.textContent || '';
      return {
        reeks: getVal('reeks'),
        reeksid: getVal('reeksid'),
        wedstrijdtype: getVal('wedstrijdtype'),
        volgorde: getVal('volgorde'),
        ploegid: getVal('ploegid'),
        ploegnaam: getVal('ploegnaam'),
        aantalGespeeldeWedstrijden: getVal('aantalGespeeldeWedstrijden'),
        aantalGewonnen30_31: getVal('aantalGewonnen30_31'),
        aantalGewonnen32: getVal('aantalGewonnen32'),
        aantalVerloren32: getVal('aantalVerloren32'),
        aantalVerloren30_31: getVal('aantalVerloren30_31'),
        aantalGewonnenSets: getVal('aantalGewonnenSets'),
        aantalVerlorenSets: getVal('aantalVerlorenSets'),
        puntentotaal: getVal('puntentotaal'),
        forfait: getVal('forfait')
      };
    });

    return { rangschikking };
  } catch (error) {
    console.warn('XML parsing error, using fallback:', error);
    return parseXMLWithRegex(xmlString);
  }
};

/**
 * Fetches rankings for a given series using the internal API proxy.
 */
const getRangschikkingByReeks = async (reeks: string, stamnummer: string = DEFAULT_CLUB_ID): Promise<VolleyAdminKlassement | null> => {
  if (!reeks) return null;

  try {
    // Prefer internal proxy
    const proxyUrl = `/api/proxy-rangschikking?stamnummer=${encodeURIComponent(stamnummer)}&reeks=${encodeURIComponent(reeks)}&timestamp=${Date.now()}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) throw new Error(`Status ${response.status}`);
    
    const xmlString = await response.text();
    return parseXMLToObject(xmlString);
  } catch (err) {
    console.error(`Failed to fetch rangschikking for ${reeks}:`, err);
    
    // Fallback: try direct fetch via allorigins if internal proxy fails (e.g. static export)
    try {
       const target = `https://www.volleyadmin2.be/services/rangschikking_xml.php?stamnummer=${stamnummer}&reeks=${reeks}`;
       const fallbackUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}&timestamp=${Date.now()}`;
       const res = await fetch(fallbackUrl);
       if (res.ok) {
         return parseXMLToObject(await res.text());
       }
    } catch (e) {
       console.error("Fallback fetch also failed", e);
    }
    return null;
  }
};

/**
 * English alias for `getRangschikkingByReeks`.
 */
const getRankingBySeries = getRangschikkingByReeks;


const rangschikkingService = {
  getRangschikkingByReeks,
  getRangschikkingFromVolleyAdmin: getRangschikkingByReeks,
  getRankingBySeries,
  getRankingFromVolleyAdmin: getRankingBySeries,
};

export default rangschikkingService;