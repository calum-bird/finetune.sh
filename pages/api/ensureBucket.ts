// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../services/clients/supabaseServer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<null>
) {
  supabaseServer.storage.createBucket("jsonl");
  res.status(200).json(null);
}
