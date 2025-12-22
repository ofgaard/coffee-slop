import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full flex items-center justify-between">
            <Link href="/">
            <div className="flex items-center justify-center">
              <Image src="/logo.png" alt="Coffee Slop Logo" width={150} height={150} className="scale-75 md:scale-100" />
              <h1>Coffee Slop</h1>
              </div>
            </Link>
        </header>
    );

}   