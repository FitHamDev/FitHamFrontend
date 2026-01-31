import { VolleyAdminKlassement, VolleyAdminRangschikking } from '../utils/types';

const getRangschikkingByReeks = async (reeksNr: string, stamnummer: string = 'L-0759') => {
    console.log('🏆 Retrieving rangschikking data for reeks:', reeksNr, 'stamnummer:', stamnummer);
    
    // Direct fetch via CORS proxy because we are in static export mode
    try {
        const targetUrl = `https://www.volleyadmin2.be/services/rangschikking_xml.php?stamnummer=${encodeURIComponent(stamnummer)}&reeks=${encodeURIComponent(reeksNr)}`;
        // Switch to allorigins.win which tends to mask the origin better than corsproxy.io
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}&timestamp=${new Date().getTime()}`;
        
        const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
                "Accept": "text/xml, application/xml, */*",
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlString = await response.text();
        return parseXMLToObject(xmlString);
    } catch (error) {
        console.error('Error fetching rangschikking:', error);
        throw error;
    }
}

// Fallback regex parsing function
const parseXMLWithRegex = (xmlString: string): VolleyAdminKlassement => {
    const rangschikking: VolleyAdminRangschikking[] = [];
    
    // Extract all rangschikking blocks using split instead of regex with 's' flag
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
            
            if (startIndex === -1 || endIndex === -1) return '';
            
            return rangschikkingBlock.substring(startIndex + startTag.length, endIndex).trim();
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

// Function to parse XML string to JavaScript object
const parseXMLToObject = (xmlString: string): VolleyAdminKlassement => {
    console.log('Parsing XML response, length:', xmlString.length);
    
    try {
        // Try DOM parsing first
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        
        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            console.warn('DOM parser error, falling back to regex parsing');
            return parseXMLWithRegex(xmlString);
        }
        
        const rangschikkingElements = xmlDoc.querySelectorAll('rangschikking');
        console.log('Found', rangschikkingElements.length, 'rangschikking elements');
        
        if (rangschikkingElements.length === 0) {
            console.warn('No rangschikking elements found with DOM parser, trying regex');
            return parseXMLWithRegex(xmlString);
        }
        
        const rangschikking: VolleyAdminRangschikking[] = [];
        
        rangschikkingElements.forEach((element) => {
            const getRangschikkingData = (tagName: string): string => {
                const elem = element.querySelector(tagName);
                return elem ? elem.textContent || '' : '';
            };
            
            const teamData = {
                reeks: getRangschikkingData('reeks'),
                reeksid: getRangschikkingData('reeksid'),
                wedstrijdtype: getRangschikkingData('wedstrijdtype'),
                volgorde: getRangschikkingData('volgorde'),
                ploegid: getRangschikkingData('ploegid'),
                ploegnaam: getRangschikkingData('ploegnaam'),
                aantalGespeeldeWedstrijden: getRangschikkingData('aantalGespeeldeWedstrijden'),
                aantalGewonnen30_31: getRangschikkingData('aantalGewonnen30_31'),
                aantalGewonnen32: getRangschikkingData('aantalGewonnen32'),
                aantalVerloren32: getRangschikkingData('aantalVerloren32'),
                aantalVerloren30_31: getRangschikkingData('aantalVerloren30_31'),
                aantalGewonnenSets: getRangschikkingData('aantalGewonnenSets'),
                aantalVerlorenSets: getRangschikkingData('aantalVerlorenSets'),
                puntentotaal: getRangschikkingData('puntentotaal'),
                forfait: getRangschikkingData('forfait')
            };
            
            rangschikking.push(teamData);
        });
        
        console.log('Successfully parsed', rangschikking.length, 'teams');
        return { rangschikking };
    } catch (error) {
        console.error('DOM parsing failed, using regex fallback:', error);
        return parseXMLWithRegex(xmlString);
    }
};

// Function to fetch ranking data from VolleyAdmin API with CORS proxy
const getRangschikkingFromVolleyAdmin = async (reeks: string, stamnummer: string = 'L-0759'): Promise<VolleyAdminKlassement> => {
    console.log('🏆 Retrieving rangschikking data from VolleyAdmin API for reeks:', reeks, 'stamnummer:', stamnummer);
    
    // Use our own internal API proxy to avoid CORS issues
    // This calls pages/api/proxy-rangschikking.ts which performs the server-side fetch
    const proxyUrl = `/api/proxy-rangschikking?stamnummer=${encodeURIComponent(stamnummer)}&reeks=${encodeURIComponent(reeks)}&timestamp=${new Date().getTime()}`;
    
    console.log('Fetching volleyball ranking for', reeks, 'from', stamnummer);
    
    try {
        const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
                "Accept": "text/xml, application/xml, */*",
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('CORS proxy error:', errorText);
            throw new Error(`CORS proxy error! status: ${response.status}`);
        }
        
        const xmlString = await response.text();
        console.log('Received XML data, length:', xmlString.length);
        
        return parseXMLToObject(xmlString);
    } catch (error) {
        console.error('CORS proxy failed, trying direct fetch:', error);
        
        // Fallback to direct fetch (will likely fail due to CORS but worth trying)
        try {
            const response = await fetch(targetUrl, {
                method: "GET",
                headers: {
                    "Accept": "text/xml, application/xml, */*",
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const xmlString = await response.text();
            return parseXMLToObject(xmlString);
        } catch (directError) {
            console.error('Direct fetch also failed:', directError);
            throw new Error(`Failed to fetch volleyball data. CORS proxy error: ${error instanceof Error ? error.message : 'Unknown error'}. Direct fetch error: ${directError instanceof Error ? directError.message : 'Unknown error'}`);
        }
    }
};

export default {
    getRangschikkingByReeks,
    getRangschikkingFromVolleyAdmin,
};