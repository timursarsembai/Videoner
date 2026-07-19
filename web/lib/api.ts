import { ApiError, DownloadResponse } from "@/types/api";
import { VideoInfo } from "@/types/youtube";
import axios, { AxiosInstance, AxiosError } from "axios";
import { detectPlatform } from "./validations/url";

interface ProgressCallbacks {
  onProgress: (progress: ProgressData) => void;
  onComplete: (downloadUrl: string) => void;
  onError: (error: string) => void;
  onInit?: (eventSource: EventSource) => void;
}

interface ProgressData {
  percentage: number;
  isConverting?: boolean;
  status?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          throw {
            message: error.response.data.message || "An error occurred",
            statusCode: error.response.status,
          };
        }
        throw {
          message: "Network error",
          statusCode: 500,
        };
      }
    );
  }

  async getVideoInfo(url: string): Promise<VideoInfo> {
    try {
      // const platform = detectPlatform(url)!;
      const response = await this.client.post<VideoInfo>(`/info`, {
        url,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadVideo(
    url: string,
    quality: string,
    extension: string
  ): Promise<DownloadResponse> {
    try {
      const response = await this.client.post<DownloadResponse>(
        "/download/video",
        {
          url,
          quality,
          extension,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadAudio(
    url: string,
    quality: string,
    extension: string
  ): Promise<DownloadResponse> {
    try {
      const response = await this.client.post<DownloadResponse>(
        "/download/audio",
        {
          url,
          quality,
          extension,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  subscribeToProgress(
    downloadId: string,
    callbacks: ProgressCallbacks
  ): () => void {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/download/${downloadId}/progress`,
      { withCredentials: true }
    );

    if (callbacks.onInit) {
      callbacks.onInit(eventSource);
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "progress") {
        callbacks.onProgress(data.data);
      } else if (data.type === "complete") {
        callbacks.onComplete(data.data);
      } else if (data.type === "error") {
        callbacks.onError(data.message);
      }
    };

    eventSource.onerror = () => {
      callbacks.onError("Connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }

  async getDownloadStatus(downloadId: number) {
    try {
      const response = await this.client.get(`/download/${downloadId}/status`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiError {
    if (error && typeof error === "object" && "statusCode" in error) {
      return error as ApiError;
    }
    return {
      message: "An unexpected error occurred",
      statusCode: 500,
    };
  }
}

export const api = new ApiClient();
export default ApiClient;
