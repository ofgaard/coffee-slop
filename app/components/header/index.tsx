import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/darkmode-toggle";

export default function Header() {
    return (
        <header className="w-full flex items-center justify-between">
            <Link href="/">
            <div className="flex items-center justify-center">
              <Image src="/logo.png" alt="Coffee Slop Logo" width={100} height={100} className="scale-75 md:scale-100" />
              </div>
            </Link>
            <ModeToggle />
        </header>
    );

}   