import Overview from "../components/overview";
import { ComponentSession } from "../services/lib/useSession";

export default function Home({ session }: { session: ComponentSession }) {
  return (
    <div>
      <Overview session={session} />
    </div>
  );
}
