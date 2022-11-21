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
}
