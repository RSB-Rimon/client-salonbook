import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LabelProps = ComponentProps<"label">;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn("mb-2 block text-sm font-medium text-[#493a32]", className)}
      {...props}
    />
  );
}

export { Label };
