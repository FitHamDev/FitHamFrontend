// Team names mapping
const reeksNamen: { [key: string]: string } = {
  "VDP2-B": "Dames A",
  "LDM1": "Dames A",
  "VDP4-B": "Dames B",
  "LDM2": "Dames B",
  "LJU15N1R1": "U15J",
  "VJU19N2R1": "U19J",
  "VJU15N2R1-A": "U15J",
  "VJU11-3-3-N1R1": "U11J",
  "VMU17N1R1-A": "U17MB",
  "VMU17N2R1-A": "U17MA",
  "VMU17N2R1-C": "U17MC",
  "VMU15N2R1-A": "U15M",
  "VMU13N2R1-A": "U13MA",
  "VMU13N2R1-B": "U13MB",
  "VMU11-2-2-N1R1": "U11M",
  "VXU11-2-2-N3R1-B": "U11X"
};

// Helper functions
const cleanTeamName = (teamName: string): string => teamName.replace(/[+-]/g, '').trim();

const getWeekNumber = (date: Date): number => {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const findReeksNaam = (reeks: string): string | undefined => {
  if (reeksNamen[reeks]) return reeksNamen[reeks];
  const found = Object.entries(reeksNamen).find(([key]) => reeks.includes(key));
  return found ? found[1] : undefined;
};

// Fallback regex parsing for matches
const parseWedstrijdenRegex = (xmlString: string): any[] => {
  const wedstrijden: any[] = [];
  const parts = xmlString.split('<wedstrijd>'); 

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const endIndex = part.indexOf('</wedstrijd>');
    if (endIndex === -1) continue;

    const block = part.substring(0, endIndex);
    const getValue = (tag: string) => {
       const startTag = `<${tag}>`;
       const endTag = `</${tag}>`;
       const s = block.indexOf(startTag);
       const e = block.indexOf(endTag);
       return (s !== -1 && e !== -1) ? block.substring(s + startTag.length, e).trim() : '';
    };

    const datum = getValue('datum');
    const aanvangsuur = getValue('aanvangsuur');
    const reeks = getValue('reeks');

    let timestamp = 0, week = 0;
    if (datum && aanvangsuur) {
      try {
        const [day, month, year] = datum.split('/');
        const matchDate = new Date(`${year}-${month}-${day}T${aanvangsuur}`);
        if (!isNaN(matchDate.getTime())) {
          timestamp = Math.floor(matchDate.getTime() / 1000);
          week = getWeekNumber(matchDate);
        }
      } catch (e) { /* ignore */ }
    }

    wedstrijden.push({
      type: 'competitie',
      datum,
      aanvangsuur,
      reeks,
      reeksnaam: findReeksNaam(reeks),
      thuisploeg: cleanTeamName(getValue('thuisploeg')),
      bezoekersploeg: cleanTeamName(getValue('bezoekersploeg')),
      uitslag: getValue('uitslag'),
      stamnummer_thuisclub: getValue('stamnummer_thuisclub'),
      stamnummer_bezoekersclub: getValue('stamnummer_bezoekersclub'),
      week,
      timestamp
    });
  }
  return wedstrijden;
};

const parseWedstrijdenXML = (xmlString: string): any[] => {
  try {
    if (typeof window === 'undefined' || !window.DOMParser) {
       return parseWedstrijdenRegex(xmlString);
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // If DOMParser fails or returns error document
    if (xmlDoc.querySelector('parsererror') || xmlDoc.querySelectorAll('wedstrijd').length === 0) {
       return parseWedstrijdenRegex(xmlString);
    }
    
    const wedstrijdElements = xmlDoc.querySelectorAll('wedstrijd');
    const wedstrijden: any[] = [];
    
    wedstrijdElements.forEach((element) => {
      const getValue = (tag: string) => element.querySelector(tag)?.textContent || '';
      
      const datum = getValue('datum');
      const aanvangsuur = getValue('aanvangsuur');
      const reeks = getValue('reeks');
      
      // Calculate timestamp and week
      let timestamp = 0, week = 0;
      if (datum && aanvangsuur) {
        try {
          const [day, month, year] = datum.split('/');
          const matchDate = new Date(`${year}-${month}-${day}T${aanvangsuur}`);
          if (!isNaN(matchDate.getTime())) {
            timestamp = Math.floor(matchDate.getTime() / 1000);
            week = getWeekNumber(matchDate);
          }
        } catch (e) { /* ignore parse errors */ }
      }
      
      wedstrijden.push({
        type: 'competitie',
        datum,
        aanvangsuur,
        reeks,
        reeksnaam: findReeksNaam(reeks),
        thuisploeg: cleanTeamName(getValue('thuisploeg')),
        bezoekersploeg: cleanTeamName(getValue('bezoekersploeg')),
        uitslag: getValue('uitslag'),
        stamnummer_thuisclub: getValue('stamnummer_thuisclub'),
        stamnummer_bezoekersclub: getValue('stamnummer_bezoekersclub'),
        week,
        timestamp
      });
    });
    
    return wedstrijden;
  } catch (error) {
    console.error('XML parsing failed, using fallback:', error);
    return parseWedstrijdenRegex(xmlString);
  }
};

const getWedstrijdenByStamnummer = async (stamnummer: string = 'L-0759') => {
  console.log('🏐 Retrieving match data for stamnummer:', stamnummer);
  let xmlString = '';
  
  try {
    const proxyUrl = `/api/proxy-matches?stamnummer=${stamnummer}&timestamp=${Date.now()}`;
    const response = await fetch(proxyUrl, {
      method: "GET",
      headers: { "Accept": "text/xml, application/xml, */*" }
    });
    
    if (response.ok) {
        xmlString = await response.text();
    } else {
        throw new Error(`Proxy status: ${response.status}`);
    }
  } catch (err) {
    console.warn('Internal proxy failed, trying fallback:', err);
    try {
        const target = `https://www.volleyadmin2.be/services/wedstrijden_xml.php?stamnummer=${stamnummer}`;
        const fallbackUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}&timestamp=${Date.now()}`;
        const res = await fetch(fallbackUrl);
        if (res.ok) {
            xmlString = await res.text();
        }
    } catch (e) {
        console.error('Fallback fetch failed:', e);
    }
  }

  if (!xmlString) {
      return {
          ok: false,
          status: 500,
          json: async () => ({ success: false, data: [], error: 'Failed to fetch matches' })
      };
  }
  
  try {
    let wedstrijden = parseWedstrijdenXML(xmlString);
    
    // Filter by stamnummer to ensure relevance, or if team name implies it's us (for combined teams)
    wedstrijden = wedstrijden.filter(w => 
      w.stamnummer_thuisclub === stamnummer || 
      w.stamnummer_bezoekersclub === stamnummer ||
      w.thuisploeg.toLowerCase().includes('ham') ||
      w.bezoekersploeg.toLowerCase().includes('ham')
    );
    
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: wedstrijden })
    };
  } catch (error) {
    console.error('Error processing wedstrijden:', error);
    return {
      ok: false,
      status: 500,
      json: async () => ({ 
        success: false, 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    };
  }
}

const matchService = {
    getWedstrijdenByStamnummer,
};

export default matchService;