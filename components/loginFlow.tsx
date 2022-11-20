import { useState } from "react";
import { login } from "../services/lib/login";

export function LoginFlow(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleMagicLogin = (): void => {
    if (email !== "") {
      login(
        email,
        () => setErrorMessage("Check your email for a login link! 🚀"),
        (e) => setErrorMessage(e.message)
      );
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flex flex-col gap-1">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(k) => {
              if (k.key.toLowerCase() === "enter") {
                handleMagicLogin();
              }
            }}
            className="text-black bg-slate-300 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-theme-primary-dark sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleMagicLogin}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-800 py-2 px-4 text-sm font-medium text-black shadow-sm  focus:outline-none focus:ring-2 focus:ring-theme-primary-dark focus:ring-offset-2"
        >
          Sign in
        </button>
      </div>
      {errorMessage && <div className="my-5">{errorMessage}</div>}
    </div>
  );
}
