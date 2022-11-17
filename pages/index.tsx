import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Steps from "../components/steps";
import Overview from "../components/overview";

export default function Home() {
  return (
    <div>
      <Overview />
    </div>
  );
}
