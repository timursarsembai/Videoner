import { type ClassValue, clsx } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadFile = (downloadUrl: string) => {
  if (!downloadUrl) {
    toast.error("Download URL not found");
    return;
  }

  try {
    // Check if it's a full URL or just a filename
    const fileName = downloadUrl.includes("http")
      ? downloadUrl.split("/").pop()
      : downloadUrl;

    if (!fileName) {
      toast.error("Invalid download URL");
      return;
    }

    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/download/${fileName}`;

    window.open(fullUrl);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to start download");
  }
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  const axiosError = error as any;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "An unexpected error occurred"
  );
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
