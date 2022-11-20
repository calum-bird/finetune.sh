// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../services/clients/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { jsonlPath }: { jsonlPath: string } = req.body;
  if (jsonlPath === "") {
    res.status(405).json("Must provide path!");
  } else {
    const { data, error } = await supabaseServer.rpc("jsonl_id", {
      this_file_name: jsonlPath,
    });
    const response = data as unknown as string;
    if (response === "") {
      res.status(406).json("Response is empty");
    }
    if (error !== null) {
      res.status(406).json(error.message);
    } else {
      console.log("ID:", response);
      res.status(200).json(response);
    }
  }
}
