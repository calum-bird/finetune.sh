import { supabase } from "../clients/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { JobType } from "./createJob";

export interface FinetuneJob {
  created_at: string;
  id: string;
  job_type: JobType;
  jsonl: string;
  status: number;
  status_change_at: string;
  user: string;
}

export function getJobs(
  onSuccess: (jobs: FinetuneJob[]) => void,
  onError: (error: PostgrestError) => void
): void {
  /*
  supabase
    .from("queue")
    .select("*")
    .then(({ data, error }) => {
      if (error === null) {
        onSuccess(data);
      } else {
        onError(error);
      }
    });
    */
  onSuccess([
    {
      created_at: "2021-08-01T00:00:00.000000Z",
      id: "1",
      job_type: "gpt2md_finetune",
      jsonl: "1",
      status: 2,
      status_change_at: "2021-08-01T00:00:00.000000Z",
      user: "some_user",
    },
  ]);
}
