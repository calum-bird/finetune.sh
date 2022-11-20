import { logout } from "../../services/lib/logout";

export const WelcomeBack = (
  <div className="lg:max-w-lg lg:self-end">
    <button
      className="text-slate-400 bg-gray-900 p-2 rounded-lg"
      onClick={logout}
    >
      Sign out
    </button>
    <div className="mt-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl">
        Welcome back 👋
      </h1>
    </div>
  </div>
);
