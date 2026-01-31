import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stamnummer } = req.query;
  // Default to L-0759 if not provided
  const stam = Array.isArray(stamnummer) ? stamnummer[0] : stamnummer || 'L-0759';

  try {
    const targetUrl = `https://www.volleyadmin2.be/services/wedstrijden_xml.php?stamnummer=${stam}`;
    console.log(`[Proxy] Fetching from ${targetUrl}`);
    
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
    res.status(500).json({ error: 'Internal Server Error fetching match data' });
  }
}
