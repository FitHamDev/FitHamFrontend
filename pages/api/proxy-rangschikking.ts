import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stamnummer, reeks } = req.query;
  
  if (!reeks) {
    return res.status(400).json({ error: 'Missing required parameter: reeks' });
  }

  // Default to L-0759 if not provided
  const stam = Array.isArray(stamnummer) ? stamnummer[0] : stamnummer || 'L-0759';
  const r = Array.isArray(reeks) ? reeks[0] : reeks;

  try {
    const targetUrl = `https://www.volleyadmin2.be/services/rangschikking_xml.php?stamnummer=${stam}&reeks=${r}`;
    console.log(`[Proxy] Fetching rangschikking from ${targetUrl}`);
    
    // Server-side fetch (no CORS limitations)
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "FitHam/1.0",
      },
    });

    if (!response.ok) {
      console.error(`[Proxy] Upstream error: ${response.status}`);
      return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
    }

    const xmlData = await response.text();
    
    // Return the XML directly
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xmlData);
  } catch (error) {
    console.error('[Proxy] Internal error:', error);
    res.status(500).json({ error: 'Internal Server Error fetching rangschikking data' });
  }
}
