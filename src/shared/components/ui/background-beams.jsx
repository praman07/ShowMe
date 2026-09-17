import React from "react";
import { cn } from "@/shared/utils/cn";

export const BackgroundBeams = ({ className }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden",
        className
      )}
    >
      <div className="w-[1080px] h-[1080px] opacity-25 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25)_0%,rgba(9,9,11,0)_60%)] pointer-events-none" />
    </div>
  );
};
