"use server";

import AWS from "aws-sdk";
import { getServerSession } from "next-auth";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { authOptions } from "~/server/auth";
import { env } from "~/env";

const RecentThumbnails = async () => {
  const serverSession = await getServerSession(authOptions);

  const s3 = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
    region: env.AWS_REGION,
  });

  const prefix = `${serverSession?.user.id}/`;
  const params = {
    Bucket: env.AWS_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: 10,
  };

  const data = await s3.listObjectsV2(params).promise();

  const recentThumbnails = data?.Contents?.sort((a, b) => {
    const aTime = new Date(a.LastModified ?? 0).getTime();
    const bTime = new Date(b.LastModified ?? 0).getTime();
    return bTime - aTime;
  }).map((item) => ({
    url: `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${item.Key}`,
    createdAt: item.LastModified,
  }));

  return (
    <div className="flex flex-col">
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Recent thumbnails
      </h3>
      <p className="text-sm text-muted-foreground">
        Download your most recent thumbnails
      </p>
      <Separator className="my-2" />

      <div className="scrollbar-thumb-rounded-full flex h-fit max-w-full gap-2 overflow-x-scroll rounded-xl p-2 scrollbar-thin scrollbar-track-secondary scrollbar-thumb-gray-400">
        {recentThumbnails?.map((thumbnail) => (
          <div key={thumbnail.url} className="flex min-w-fit flex-col gap-1">
            <img
              src={thumbnail.url}
              alt="recent-thumbnail"
              className="h-56 w-auto rounded-lg object-contain"
            />
            <p className="text-sm">
              From
              {new Date(thumbnail.createdAt ?? "").toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <Button className="w-full" variant="outline">
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentThumbnails;
