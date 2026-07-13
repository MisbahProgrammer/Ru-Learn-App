import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm transition-all outline-none placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 dark:focus:border-orange-500 dark:focus:ring-orange-500/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
