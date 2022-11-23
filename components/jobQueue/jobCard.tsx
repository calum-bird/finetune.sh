import { FinetuneJob } from "../../services/lib/getJobs";
import { supabase } from "../../services/clients/supabaseClient";
import { useEffect, useState } from "react";

export default function JobCard({ job }: { job: FinetuneJob }): JSX.Element {
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [curlCommand, setCurlCommand] = useState<string>("");

  const statusMap = [
    <>In queue</>,
    <>Processing... time elapsed 2 hours</>,
    <>Done!</>,
  ];

  useEffect(() => {
    if (job.status == 2) {
      setCurlCommand(
        `curl -O ${job.job_type.toString()}_model.zip https://finetune.sh/test.zip`
      );
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
            setCurlCommand(
              `curl -O ${job.job_type.toString()}_model.zip ${
                result.data.signedUrl
              }`
            );
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
          {job.status == 2 && (
            <>
              <a className="bg-slate-800 p-3 rounded my-auto" href={signedUrl}>
                Download zip
              </a>
              <button
                className="bg-slate-800 p-2 rounded flex flex-row"
                onClick={() => {
                  // Add string to clipboard
                  navigator.clipboard.writeText(curlCommand);
                }}
              >
                <code className="bg-slate-700 p-1">curl</code>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 my-auto pl-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
