import { BookOpenIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/ui/fonts";

export default function JingleLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center space-x-3 leading-none text-white`}
    >
      <BookOpenIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[24px]">OSRS Jingle!</p>
    </div>
  );
}
