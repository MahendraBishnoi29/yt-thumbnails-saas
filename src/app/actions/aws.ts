"use server";

import AWS from "aws-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { format } from "date-fns";
import { env } from "~/env";

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
});

export const getPresignedUrl = async () => {
  const serverSession = await getServerSession(authOptions);

  if (!serverSession) {
    throw new Error("Unauthorized");
  }

  const timestamp = format(new Date(), "yyyyMMddHHmmss");
  const key = `${serverSession.user.id}/${timestamp}.png`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60,
    ContentType: "image/png",
  };

  const uploadUrl = s3.getSignedUrl("putObject", params);
  return uploadUrl;
};
