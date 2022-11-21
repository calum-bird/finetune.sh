import { useEffect, useState } from "react";
import { ComponentSession } from "../services/lib/useSession";
import { Model, models } from "../util/util";
import ProductForm from "./productForm";
import JobQueue from "./jobQueue";
import ModelVisualization from "./modelVisualization";
import Header from "./header";

export default function Overview({ session }: { session: ComponentSession }) {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [selectedVariant, setSelectedVariant] = useState(0);
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
          selectedModel={selectedModel}
          setSelectedModel={customSetSelectedModel}
          selectedVariant={selectedVariant}
          setSelectedVariant={customSetSelectedVariant}
          session={session}
        />
      </div>
    </div>
  );
}
