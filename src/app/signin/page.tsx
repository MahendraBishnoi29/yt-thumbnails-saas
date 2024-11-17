"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignIn from "~/components/auth/sign-in";
import { authOptions } from "~/server/auth";

const Page = async () => {
  const serverSession = await getServerSession(authOptions);
  if (serverSession?.user) {
    redirect("/dashboard");
  }
  return <SignIn />;
};

export default Page;
