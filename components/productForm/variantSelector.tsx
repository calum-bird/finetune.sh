import { Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, RadioGroup, Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function VariantSelector({
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
