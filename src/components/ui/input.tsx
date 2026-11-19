import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input">;

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-[#e6d9cd] bg-[#fffdfa] px-4 text-sm text-[#38251e] outline-none transition placeholder:text-[#ad9c90] focus-visible:border-[#9b6a4e] focus-visible:ring-4 focus-visible:ring-[#9b6a4e]/10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
