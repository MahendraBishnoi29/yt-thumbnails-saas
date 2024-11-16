"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignUp from "~/components/signup";
import { authOptions } from "~/server/auth";

const Page = async () => {
  const serverSession = await getServerSession(authOptions);
  if (serverSession?.user) {
    redirect("/dashboard");
  }
  return <SignUp />;
};

export default Page;
