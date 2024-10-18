import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024)); // Determine the size category

  // Format the size with 2 decimal points
  return `${(sizeInBytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
