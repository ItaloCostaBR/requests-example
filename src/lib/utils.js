import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Junta classes do Tailwind sem conflito (padrão do shadcn/ui)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
