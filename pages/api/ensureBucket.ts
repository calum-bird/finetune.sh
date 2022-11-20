// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../services/clients/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<null>
) {
  await supabaseServer.storage.createBucket("jsonl");
  res.status(200).json(null);
}
