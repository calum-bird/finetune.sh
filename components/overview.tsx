import { useEffect, useState } from "react";
import { ComponentSession } from "../services/lib/useSession";
import { Model } from "../util/util";
import ProductForm from "./productForm";
import JobQueue from "./jobQueue";
import ModelVisualization from "./modelVisualization";
import Header from "./header";

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
  /*
  {
    name: "GPT-J",
    description: "Whoa this is a big boy!",
    variants: [{ name: "6B", params: 6000 }],
  },
  {
    name: "Bloom",
    description: "Holy shit!",
    variants: [{ name: "175B", params: 175000 }],
  },*/
];

export default function Overview({ session }: { session: ComponentSession }) {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | "loading">(
    "loading"
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>(
    undefined
  );
  const loggedOut = session === "fetching" || session === "invalid";

  const customSetSelectedModel = (model: Model) => {
    localStorage.setItem("selectedModel", model.name);
    setSelectedModel(model);
    if (model.variants.length <= selectedVariant) {
      customSetSelectedVariant(model.variants.length - 1);
    }
  };

  const customSetSelectedVariant = (variant: number) => {
    localStorage.setItem("selectedVariant", variant.toString());
    setSelectedVariant(variant);
  };

  const customSetUploadedFilePath = (path: string | "loading") => {
    localStorage.setItem("uploadedFilePath", path);
    setUploadedFilePath(path);
  };

  const customSetUploadedFileName = (name: string | undefined) => {
    localStorage.setItem("uploadedFileName", name ?? "");
    setUploadedFileName(name);
  };

  useEffect(() => {
    // Pull selectedModel and selectedVariant from localStorage
    const storedModelName = localStorage.getItem("selectedModel");
    const storedVariant = localStorage.getItem("selectedVariant");
    if (storedModelName && storedVariant) {
      const model = models.find((model) => model.name === storedModelName);
      if (model) {
        setSelectedModel(model);
        setSelectedVariant(parseInt(storedVariant));
      }
    }
    // Pull uploadedFilePath and uploadedFileName from localStorage
    const storedFilePath = localStorage.getItem("uploadedFilePath");
    const storedFileName = localStorage.getItem("uploadedFileName");
    if (storedFilePath && storedFileName) {
      setUploadedFilePath(storedFilePath);
      setUploadedFileName(storedFileName);
    }

    console.log("Uploaded @ overview:", uploadedFileName);
  }, [session]);

  return (
    <div className="bg-black" style={{ minHeight: "100vh" }}>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <Header loggedOut={loggedOut} />
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
          models={models}
          selectedModel={selectedModel}
          setSelectedModel={customSetSelectedModel}
          selectedVariant={selectedVariant}
          setSelectedVariant={customSetSelectedVariant}
          uploadedFilePath={uploadedFilePath}
          setUploadedFilePath={customSetUploadedFilePath}
          uploadedFileName={uploadedFileName}
          setUploadedFileName={customSetUploadedFileName}
          session={session}
        />
      </div>
    </div>
  );
}
