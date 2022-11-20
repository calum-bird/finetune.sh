import { RadioGroup } from "@headlessui/react";
import { Model, models } from "../../util/util";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SizeSelector({
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
    <RadioGroup
      value={selectedModel}
      onChange={setSelectedModel}
      className="w-full"
    >
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
