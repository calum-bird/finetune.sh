import { Fragment, useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, RadioGroup, Transition } from "@headlessui/react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import Graph from "./network";
import { ComponentSession } from "../services/lib/useSession";
import { logout } from "../services/lib/logout";
import { FinetuneJob, getJobs } from "../services/lib/getJobs";
import FileUploader from "./fileUploader";
import { createJob } from "../services/lib/createJob";
import { LoginFlow } from "./loginFlow";

interface Variant {
  name: string;
  params: number;
}
interface Model {
  name: string;
  description: string;
  variants: Variant[];
}

const models: Model[] = [
  {
    name: "GPT-2",
    description: "Okay, I see you!",
    variants: [
      { name: "Medium", params: 355 },
      { name: "Large", params: 774 },
      { name: "Extra Large", params: 1500 },
    ],
  },
  {
    name: "GPT-J",
    description: "Whoa this is a big boy!",
    variants: [{ name: "6B", params: 6000 }],
  },
  {
    name: "Bloom",
    description: "Holy shit!",
    variants: [{ name: "175B", params: 175000 }],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ProductDetails = (
  <div className="lg:max-w-lg lg:self-end">
    <div className="mt-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl">
        Fine-tune a language model.
      </h1>
    </div>

    <section aria-labelledby="information-heading" className="mt-4">
      <h2 id="information-heading" className="sr-only">
        Product information
      </h2>

      <div className="mt-4 space-y-6">
        <p className="text-base text-gray-500"></p>
      </div>

      <div className="mt-6 flex items-center">
        <CheckIcon
          className="h-5 w-5 flex-shrink-0 text-green-500"
          aria-hidden="true"
        />
        <p className="ml-2 text-sm text-gray-500">
          Run your model anywhere - you own the checkpoints!
        </p>
      </div>
    </section>
  </div>
);
const WelcomeBack = (
  <div className="lg:max-w-lg lg:self-end">
    <button className="text-slate-600" onClick={logout}>
      sign out
    </button>
    <div className="mt-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl">
        Welcome back 👋
      </h1>
    </div>
  </div>
);

function JobQueue(): JSX.Element {
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
export default function Overview({ session }: { session: ComponentSession }) {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const loggedOut = session === "fetching" || session === "invalid";

  return (
    <div className="bg-black" style={{ minHeight: "100vh" }}>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {loggedOut ? ProductDetails : WelcomeBack}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          {loggedOut ? (
            <ModelVisualization
              selectedVariant={selectedVariant}
              selectedModel={selectedModel}
            />
          ) : (
            <JobQueue />
          )}
        </div>
        <ProductForm
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          session={session}
        />
      </div>
    </div>
  );
}
function JobCard({ job }: { job: FinetuneJob }): JSX.Element {
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

function ModelVisualization({
  selectedVariant,
  selectedModel,
}: {
  selectedVariant: number;
  selectedModel: Model;
}) {
  return (
    <>
      <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg relative">
        <div className="absolute w-full h-full to-black via-transparent from-transparent bg-gradient-radial z-10 pointer-events-none" />
        <Graph
          modelSize={
            selectedVariant >= selectedModel.variants.length
              ? selectedModel.variants[selectedModel.variants.length - 1].params
              : selectedModel.variants[selectedVariant].params
          }
        />
      </div>
      <h4 className="text-center text-gray-400 text-sm">
        1&nbsp;:&nbsp;1,000,000 scale
      </h4>
    </>
  );
}

function ProductForm({
  selectedModel,
  setSelectedModel,
  selectedVariant,
  setSelectedVariant,
  session,
}: {
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  selectedVariant: number;
  setSelectedVariant: (variant: number) => void;
  session: ComponentSession;
}) {
  const [jsonlFile, setJsonlFile] = useState<File | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const startJob = () => {
    if (session === "fetching" || session === "invalid") {
      setLoggingIn(true);
      return;
    } else if (jsonlFile !== null) {
      createJob(
        {
          session,
          file: jsonlFile,
          job: "gptj_finetune",
        },
        () => {
          alert("successfully queued finetuning job");
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

          <FileUploader jsonlFile={jsonlFile} setJsonlFile={setJsonlFile} />

          {loggingIn ? (
            <LoginFlow />
          ) : (
            <div className="mt-10">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                disabled={jsonlFile === null}
                onClick={(e) => {
                  e.preventDefault();
                  startJob();
                }}
              >
                {jsonlFile === null
                  ? "Select your dataset first."
                  : "Start finetuning 🚀"}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <a href="#" className="group inline-flex text-base font-medium">
              <ShieldCheckIcon
                className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span className="text-gray-500 hover:text-gray-300">
                Payment secured through Stripe.
              </span>
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}

function SizeSelector({
  selectedModel,
  setSelectedModel,
}: {
  selectedModel: {
    name: string;
    description: string;
    variants: { name: string; params: number }[];
  };
  setSelectedModel: (model: Model) => void;
}) {
  return (
    <RadioGroup value={selectedModel} onChange={setSelectedModel}>
      <RadioGroup.Label className="block text-sm font-medium text-gray-300">
        Size
      </RadioGroup.Label>
      <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {models.map((size) => (
          <RadioGroup.Option
            as="div"
            key={size.name}
            value={size}
            className={({ active }) =>
              classNames(
                active ? "ring-2 ring-indigo-500" : "",
                "relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none"
              )
            }
          >
            {({ active, checked }) => (
              <>
                <RadioGroup.Label
                  as="p"
                  className="text-base font-medium text-gray-200"
                >
                  {size.name}
                </RadioGroup.Label>
                <RadioGroup.Description
                  as="p"
                  className="mt-1 text-sm text-gray-500"
                >
                  {size.description}
                </RadioGroup.Description>
                <div
                  className={classNames(
                    active ? "border" : "border-2",
                    checked ? "border-indigo-500" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

function VariantSelector({
  selectedVariant,
  setSelectedVariant,
  selectedModel,
}: {
  selectedVariant: number;
  setSelectedVariant: (variant: number) => void;
  selectedModel: {
    name: string;
    description: string;
    variants: { name: string; params: number }[];
  };
}) {
  return (
    <Listbox value={selectedVariant} onChange={setSelectedVariant}>
      <Listbox.Label className="block text-sm font-medium text-gray-300">
        Variant
      </Listbox.Label>
      <div className="mt-1 relative">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300">
          <span className="block truncate text-black">
            {selectedVariant >= selectedModel.variants.length
              ? selectedModel.variants[selectedModel.variants.length - 1].name
              : selectedModel.variants[selectedVariant].name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {selectedModel.variants.map((variant, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  classNames(
                    active ? "text-white bg-indigo-600" : "text-gray-800",
                    "cursor-default select-none relative py-2 pl-10 pr-4"
                  )
                }
                value={index}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={classNames(
                        selected ? "font-semibold" : "font-normal",
                        "block truncate"
                      )}
                    >
                      {variant.name}
                    </span>
                    {selected ? (
                      <span
                        className={classNames(
                          active ? "text-white" : "text-indigo-600",
                          "absolute inset-y-0 left-0 flex items-center pl-3"
                        )}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
