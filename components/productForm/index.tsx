import FileUploader from "../fileUploader";
import SizeSelector from "./sizeSelector";
import VariantSelector from "./variantSelector";
import { createJob } from "../../services/lib/createJob";
import { LoginFlow } from "../loginFlow";
import { ComponentSession } from "../../services/lib/useSession";
import { useState } from "react";
import { Model } from "../../util/util";

export default function ProductForm({
  models,
  selectedModel,
  setSelectedModel,
  selectedVariant,
  setSelectedVariant,
  session,
  uploadedFilePath,
  setUploadedFilePath,
  uploadedFileName,
  setUploadedFileName,
}: {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  selectedVariant: number;
  setSelectedVariant: (variant: number) => void;
  session: ComponentSession;
  uploadedFilePath: string | "loading";
  setUploadedFilePath: (path: string | "loading") => void;
  uploadedFileName: string | undefined;
  setUploadedFileName: (name: string | undefined) => void;
}) {
  const [loggingIn, setLoggingIn] = useState(false);

  const startJob = () => {
    if (session === "fetching" || session === "invalid") {
      setLoggingIn(true);
      return;
    } else if (uploadedFilePath !== "") {
      createJob(
        {
          file: uploadedFilePath,
          job: "gptj_finetune",
        },
        () => {
          setUploadedFileName(undefined);
          setUploadedFilePath("loading");
          window.location.reload();
        },
        (error) => {
          alert("failed to queue finetuning job: " + error);
        }
      );
    }
  };

  return (
    <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
      <section aria-labelledby="options-heading">
        <h2 id="options-heading" className="sr-only">
          Product options
        </h2>

        <form>
          <div className="sm:flex sm:justify-between">
            <SizeSelector
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>
          <div className="mt-3">
            <VariantSelector
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              selectedModel={selectedModel}
            />
          </div>
          <FileUploader
            setUploadedFilePath={setUploadedFilePath}
            setUploadedFileName={setUploadedFileName}
            uploadedFileName={uploadedFileName}
          />
          {loggingIn ? (
            <LoginFlow />
          ) : (
            <div className="mt-5">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                disabled={uploadedFilePath === "loading"}
                onClick={(e) => {
                  e.preventDefault();
                  startJob();
                }}
              >
                {uploadedFilePath === "loading"
                  ? "Upload your dataset to continue."
                  : "Start finetuning 🚀"}
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
