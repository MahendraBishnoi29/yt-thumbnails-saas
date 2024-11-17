"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

const Credits = async () => {
  const serverSession = await getServerSession(authOptions);
  const user = await db.user.findUnique({
    where: {
      id: serverSession?.user.id,
    },
    select: {
      credits: true,
    },
  });

  return <span>{user?.credits} credits left</span>;
};

export default Credits;
