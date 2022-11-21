import { CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { LoginFlow } from "../loginFlow";

export const ProductDetails = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    <div className="lg:max-w-lg lg:self-end">
      <div className="mt-4">
        {isLoggingIn ? (
          <div className="p-2 mb-2 bg-gray-900 rounded-lg">
            <LoginFlow cancelFunc={() => setIsLoggingIn(false)} />
          </div>
        ) : (
          <button
            className="text-slate-400 bg-gray-900 p-2 rounded-lg"
            onClick={() => setIsLoggingIn(true)}
          >
            Returning customer? Sign in
          </button>
        )}
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
};
