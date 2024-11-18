"use client";

import { downloadS3File } from "~/app/actions/aws";
import { Button } from "./ui/button";

interface DownloadRecentThumbnailProps {
  url: string;
}

const DownloadRecentThumbnail: React.FC<DownloadRecentThumbnailProps> = ({
  url,
}) => {
  return (
    <Button
      onClick={async () => await downloadS3File(url)}
      className="w-full"
      variant="outline"
    >
      Download
    </Button>
  );
};

export default DownloadRecentThumbnail;
