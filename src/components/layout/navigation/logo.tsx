import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 w-full">
      <Image alt="_favicon_osc_" width={32} height={32} src="/favicon.png" />
      <span className="font-bold sm:text-[14px] md:text-xl text-xl">
        OpenSourceCodes
      </span>
    </Link>
  );
}
