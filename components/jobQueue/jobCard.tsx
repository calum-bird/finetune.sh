import { FinetuneJob } from "../../services/lib/getJobs";
import { supabase } from "../../services/clients/supabaseClient";
import { useEffect, useState } from "react";

export default function JobCard({ job }: { job: FinetuneJob }): JSX.Element {
  const [signedUrl, setSignedUrl] = useState<string>("");

  const statusMap = [
    <>In queue</>,
    <>Processing... time elapsed 2 hours</>,
    <>Done!</>,
  ];

  useEffect(() => {
    if (job.status == 2) {
      supabase.storage
        .from("results")
        .createSignedUrl(
          `${job.user}/${job.id}.zip`,
          60 * 60 * 24 * 30 // 30 days
        )
        .then((result) => {
          if (result.error) {
            console.error(result.error);
          } else {
            setSignedUrl(result.data.signedUrl);
          }
        });
    }
  }, []);

  return (
    <div className=" border border-slate-500 rounded-md p-2" key={job.id}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div>{statusMap[job.status]}</div>
          <i className="text-sm text-slate-400">{job.job_type}</i>
          <div className="text-sm text-slate-400">{job.created_at}</div>
        </div>
        <div className="flex flex-row gap-5">
          <div>share</div>
          <div>{signedUrl}</div>
        </div>
      </div>
    </div>
  );
}
