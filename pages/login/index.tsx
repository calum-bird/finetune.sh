import { LoginFlow } from "../../components/loginFlow";

export default function Login(): JSX.Element {
  return (
    <div className="h-screen">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="#"
              className="font-medium text-theme-primary-dark hover:text-theme-primary-dark"
            >
              register a new account
            </a>
          </p>
        </div>
        <LoginFlow />
      </div>
    </div>
  );
}
