import { useState } from "react";
import Overview from "../components/overview";
import { createJob } from "../services/lib/createJob";
import { logout } from "../services/lib/logout";
import { ComponentSession } from "../services/lib/useSession";
import { Session } from "@supabase/supabase-js";
import Login, { LoginModule } from "./login";
const MAX_FILE_SIZE = 1024 * 1024 * 1024 * 5; // 5gb

function LoggedInModule({ session }: { session: Session }) {
  const [jsonlFile, setJsonlFile] = useState<File | null>(null);
  return (
    <>
      "Logged in!"{" "}
      <button
        onClick={logout}
        className="bg-blue-200 text-black px-2 rounded-md"
      >
        Logout
      </button>
      <div className="border-2 m-5">
        <div>Step 1 - upload JSON-L</div>
        <div className="flex flex-row gap-3 ">
          <div>JSON-L URL = </div>
          <input
            type="file"
            accept=".jsonl"
            onChange={(e) => {
              const files = e.target.files;
              if (files !== null) {
                if (files.length === 1) {
                  const file = files.item(0);
                  if (file!.size > MAX_FILE_SIZE) {
                    alert("File size too large! Contact us for help");
                  } else {
                    setJsonlFile(file);
                  }
                }
              }
            }}
          />
        </div>
        <button>Request a new job in my queue</button>
      </div>
      <div className="border-2 m-5 ">
        <div className="max-w-md mx-10 px-10 flex flex-col gap-5">
          <div>Step 2 - request a new job</div>
          <div className="flex flex-row justify-between items-center">
            <div>JSON-L UUID </div>
            <input type="text" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div>model-id</div>
            <input type="text" />
          </div>
          <button
            className="p-3 bg-indigo-500 rounded-lg"
            onClick={() => {
              if (jsonlFile !== null) {
                createJob(
                  {
                    session,
                    file: jsonlFile,
                    job: "gptj_finetune",
                  },
                  () => {},
                  () => {}
                );
              }
            }}
          >
            Request a new job in my queue
          </button>
        </div>
      </div>
    </>
  );
}

function TempLoadTester({ session }: { session: ComponentSession }) {
  return (
    <div className="bg-slate-700">
      {"THIS SECTION IS TEMPORARY :) "}
      <div>
        session:{" "}
        {session === "invalid" ? (
          <>
            "invalid"
            <LoginModule />
          </>
        ) : session === "fetching" ? (
          "loading..."
        ) : (
          <LoggedInModule session={session} />
        )}
      </div>
    </div>
  );
}

export default function Home({ session }: { session: ComponentSession }) {
  return (
    <div>
      <TempLoadTester session={session} />
      <Overview session={session} />
    </div>
  );
}
