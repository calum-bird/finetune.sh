import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useSession } from "../services/lib/useSession";

export default function App({ Component, pageProps }: AppProps) {
  const session = useSession();

  return <Component session={session} {...pageProps} />;
}
