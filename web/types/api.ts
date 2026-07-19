export interface ApiError {
  message: string;
  statusCode: number;
}

export interface DownloadResponse {
  message: string;
  downloadId: number;
  fileName: string;
}

export interface DownloadStatus {
  status: "PENDING" | "DOWNLOADING" | "CONVERTING" | "COMPLETED" | "FAILED";
  downloadUrl: string | null;
}

export interface ProgressData {
  percentage: number;
  percentage_str: string;
  downloaded: number;
  downloaded_str: string;
  total: number;
  total_str: string;
  speed: number;
  speed_str: string;
  eta: number;
  eta_str: string;
  isConverting: boolean;
}
