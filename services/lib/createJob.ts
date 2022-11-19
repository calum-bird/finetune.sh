import { v4 } from "uuid";
import { useRef } from "react";
import { supabase } from "../clients/supabaseClient";
import { Session } from "@supabase/supabase-js";

export type JobType =
  | "gptj_finetune"
  | "gpt2md_finetune"
  | "gpt2lg_finetune"
  | "gpt2xl_finetune";

interface JobParams {
  session: Session;
  file: File;
  job: JobType;
}

async function _createJob({
  session,
  file,
  job: jobType,
}: JobParams): Promise<
  { data: null; error: string } | { data: string; error: null }
> {
  await fetch("/api/ensureBucket");
  const fileName = `${session.user.id}/${v4()}.jsonl`;
  const { error: storageError } = await supabase.storage
    .from("jsonl")
    .upload(fileName, file);
  if (storageError !== null) {
    return { error: storageError.message, data: null };
  }
  const { data, error } = await supabase.rpc("create_job", {
    this_jsonl_path: fileName,
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
