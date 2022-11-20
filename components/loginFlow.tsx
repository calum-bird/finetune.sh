import { useState } from "react";
import { login } from "../services/lib/login";

const handleMagicLogin = (
  email: string,
  setDidSend: any,
  setErrorMessage: any
): void => {
  if (email !== "") {
    login(
      email,
      () => setDidSend(true),
      (e) => setErrorMessage(e.message)
    );
  }
};

export function LoginFlow(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [didSend, setDidSend] = useState(false);

  return (
    <div className="mt-8 w-full flex flex-col gap-1">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email address
        </label>
      </div>
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
              handleMagicLogin(email, setDidSend, setErrorMessage);
            }
          }}
          className="text-black bg-slate-300 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-theme-primary-dark sm:text-sm"
        />
      </div>
      <button
        type="button"
        onClick={() => handleMagicLogin(email, setDidSend, setErrorMessage)}
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 hover:bg-indigo-700 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-primary-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        disabled={didSend || email === ""}
      >
        {didSend ? "Check your email for a login link! 🚀" : "Sign in"}
      </button>
      {errorMessage && <div className="my-5">{errorMessage}</div>}
    </div>
  );
}
