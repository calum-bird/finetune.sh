import { WelcomeBack } from "./welcomeBack";
import { ProductDetails } from "./productDetails";

export default function Header({ loggedOut }: { loggedOut: boolean }) {
  return loggedOut ? <ProductDetails /> : WelcomeBack;
}
