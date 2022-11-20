import { useEffect, useState } from "react";
import { FinetuneJob, getJobs } from "../../services/lib/getJobs";
import JobCard from "./jobCard";

export default function JobQueue(): JSX.Element {
  const [jobs, setJobs] = useState<FinetuneJob[]>([]);
  useEffect(() => {
    getJobs(
      (jobs) => setJobs(jobs),
      (error) => console.error(error)
    );
  }, []);
  return (
    <div className="max-h-[60vh] overflow-hidden overflow-y-scroll p-2">
      <h2 className="text-xl font-semibold">Jobs</h2>
      <div className="mt-2 flex flex-col gap-3 mx-1">
        {jobs.map((job) => (
          <JobCard job={job} />
        ))}
      </div>
    </div>
  );
}
