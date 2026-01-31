import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const sponsorsDirectory = path.join(process.cwd(), 'public/sponsors');
  try {
    const filenames = fs.readdirSync(sponsorsDirectory);
    const images = filenames.filter(file => /\.(png|jpe?g|svg|webp)$/i.test(file));
    res.status(200).json(images);
  } catch (error) {
    console.error("Error reading sponsors directory:", error);
    res.status(500).json([]);
  }
}
