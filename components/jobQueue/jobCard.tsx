import { FinetuneJob } from "../../services/lib/getJobs";

export default function JobCard({ job }: { job: FinetuneJob }): JSX.Element {
  const statusMap = [
    <>In queue</>,
    <>Processing... time elapsed 2 hours</>,
    <>Done!</>,
  ];
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
          <div>download</div>
        </div>
      </div>
    </div>
  );
}
