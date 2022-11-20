import { Model } from "../util/util";
import Graph from "./network";

export default function ModelVisualization({
  selectedVariant,
  selectedModel,
}: {
  selectedVariant: number;
  selectedModel: Model;
}) {
  return (
    <div className="hidden lg:block">
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
    </div>
  );
}
