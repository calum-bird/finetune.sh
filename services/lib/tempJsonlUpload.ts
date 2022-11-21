import { v4 } from "uuid";
import { supabase } from "../clients/supabaseClient";

export function tempJsonlUpload(
  file: File,
  onSuccess: (path: string) => void,
  onError: (error: any) => void
): void {
  fetch("/api/ensureBucket").then(() => {
    const id = v4();
    supabase.storage
      .from("jsonl")
      .upload(`${id}.jsonl`, file)
      .then(({ data, error }) => {
        if (error === null) {
          onSuccess(data.path);
        } else {
          onError(error);
        }
      });
  });
}
