import { supabase } from "../clients/supabaseClient";

export type JobType =
  | "gptj_finetune"
  | "gpt2md_finetune"
  | "gpt2lg_finetune"
  | "gpt2xl_finetune";

interface JobParams {
  file: string;
  job: JobType;
}

async function _createJob({
  file,
  job: jobType,
}: JobParams): Promise<
  { data: null; error: string } | { data: string; error: null }
> {
  await fetch("/api/ensureBucket");
  const res = await fetch("/api/getJsonlId", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jsonlPath: file }),
  });
  if (res.status !== 200) {
    return { error: "Cannot find json file", data: null };
  }
  const jsonId = (await res.text()).replaceAll('"', "");

  const { data, error } = await supabase.rpc("create_job", {
    this_jsonl_id: jsonId,
    this_job_type: jobType,
  });
  if (error !== null) {
    return { error: error.message, data: null };
  }
  console.log("FUncTION RESPONSE", data);

  return { error: null, data: "success" };
}

export function createJob(
  job: JobParams,
  onSuccess: () => void,
  onError: (error: string) => void
): void {
  _createJob(job).then(({ data, error }) => {
    if (data) {
      console.log("YAY!", data);
      // onSuccess(data);
    } else {
      console.error("BAD ERROR", error);
    }
  });
}
