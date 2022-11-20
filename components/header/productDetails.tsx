import { CheckIcon } from "@heroicons/react/20/solid";

export const ProductDetails = (
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
