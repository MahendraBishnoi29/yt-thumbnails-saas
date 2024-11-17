"use server";

import Link from "next/link";
import SignOut from "~/components/auth/sign-out";
import Credits from "~/components/credits";
import { Button } from "~/components/ui/button";
import "~/styles/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-screen w-full flex-col items-center overflow-y-scroll px-6 py-6">
      <nav className="flex w-full items-center justify-end pb-4">
        <div className="flex items-center gap-4">
          <Credits />
          <Link href="/dashboard/pricing">
            <Button>Buy More</Button>
          </Link>
          <SignOut />
        </div>
      </nav>
      {children}
    </main>
  );
}
