"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { env } from "~/env";
import { signInSchema } from "~/schemas/auth";
import { db } from "~/server/db";

export const signup = async (email: string, password: string) => {
  const isValid = signInSchema.safeParse({ email, password });

  if (isValid.error) {
    return "Error";
  }

  const user = await db.user.findUnique({
    where: {
      email: isValid.data?.email,
    },
  });

  if (user) {
    return "User with this email already exits";
  }

  const hashPassword = await bcrypt.hash(isValid.data.password, 10);

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const customer = await stripe.customers.create({
    email: isValid.data.email.toLowerCase(),
  });

  await db.user.create({
    data: {
      email: isValid.data.email,
      password: hashPassword,
      stripeCustomerId: customer.id,
    },
  });

  redirect("/signin");
};
