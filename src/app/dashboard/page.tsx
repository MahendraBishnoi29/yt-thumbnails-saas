"use server";

import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import ThumbnailCreator from "~/components/thumbnail-creator";
import { Button } from "~/components/ui/button";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

const Page = async () => {
  const serverSession = await getServerSession(authOptions);
  const user = await db.user.findUnique({
    where: {
      id: serverSession?.user.id,
    },
    select: {
      credits: true,
    },
  });
  return (
    <div className="flex w-full max-w-full items-center justify-center px-4 md:max-w-3xl md:px-0">
      <div className="flex max-w-full flex-col gap-10">
        {user?.credits === 1 ? (
          <div className="flex flex-col px-10 md:mt-10">
            <h1 className="flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Hi There
              <span className="motion-scale-in-[0.5] motion-translate-x-in-[-200%] motion-translate-y-in-[-200%] motion-opacity-in-[60%] motion-rotate-in-[-1080deg] motion-blur-in-[30px] motion-duration-[1.50s]/scale motion-delay-[0.50s]/scale motion-duration-[1.00s]/translate motion-duration-[0.50s]/opacity motion-duration-[1.60s]/rotate motion-duration-[1.06s]/blur motion-delay-[0.14s]/blur motion-ease-spring-bouncier">
                <Image
                  height={200}
                  width={40}
                  alt="waving-hand-png"
                  src="/waving-hand.png"
                />
              </span>
            </h1>
            <h3 className="scroll-m-20 text-4xl font-extrabold capitalize tracking-tight lg:text-5xl">
              want to create a thumbnail?
            </h3>
            <div className="mt-2 flex flex-col gap-3">
              <p className="text-muted-foreground leading-7">
                Buy more credits to continue generating thumbnails
              </p>
              <Link href="/dashboard/pricing">
                <Button>Buy Credits</Button>
              </Link>
            </div>
            <div className="mt-8">Show recent thumbnails here</div>
          </div>
        ) : (
          <ThumbnailCreator />
        )}
      </div>
    </div>
  );
};

export default Page;
