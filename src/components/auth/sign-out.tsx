"use client";

import { signOut } from "next-auth/react";
import { PiSignOutLight } from "react-icons/pi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const SignOut = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <PiSignOutLight
            className="h-6 w-6 cursor-pointer"
            onClick={() => signOut()}
          />
        </TooltipTrigger>
        <TooltipContent sideOffset={10} alignOffset={10} align="center">
          Sign Out
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SignOut;
