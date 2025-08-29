import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q || '').toString().trim();
  res.status(200).json([{ name: Demo Drug for , icd: ['E11'] }]);
}
