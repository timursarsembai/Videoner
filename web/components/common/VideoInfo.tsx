"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { downloadFile, extractErrorMessage, formatDuration } from "@/lib/utils";
import { VideoInfo } from "@/types/youtube";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  FileVideo,
  Info,
  Loader2,
  Music,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface VideoInfoSectionProps {
  videoInfo: VideoInfo;
  url: string;
}

type FormatType = "video" | "audio";

interface DownloadState {
  id?: number;
  status: "idle" | "downloading" | "complete" | "error";
  progress: number;
  downloadUrl?: string;
  error?: string;
  isConverting: boolean;
  isDownloading: boolean;
}

export const VideoInfoSection = ({ videoInfo, url }: VideoInfoSectionProps) => {
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [lastDownloadedQuality, setLastDownloadedQuality] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState<FormatType>("video");
  const [selectedExtension, setSelectedExtension] = useState<string>("mp4");
  const [downloadState, setDownloadState] = useState<DownloadState>({
    status: "idle",
    progress: 0,
    isConverting: false,
    isDownloading: false,
  });

  // Function to trigger file download

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let eventSource: EventSource | undefined;

    if (downloadState.id && downloadState.status === "downloading") {
      cleanup = api.subscribeToProgress(downloadState.id.toString(), {
        onProgress: (progress) => {
          setDownloadState((prev) => ({
            ...prev,
            progress: progress.percentage,
            isConverting: progress.isConverting || false,
          }));
        },
        onComplete: (downloadUrl) => {
          console.log("Download completed with URL:", downloadUrl); // Add logging
          // Close the connection before updating state
          if (eventSource) {
            eventSource.close();
          }
          setDownloadState((prev) => ({
            ...prev,
            status: "complete",
            downloadUrl,
            isConverting: false,
            isDownloading: true,
          }));
          toast.success("Download completed!");
          // Start the file download automatically
          if (downloadUrl) {
            downloadFile(downloadUrl);
          } else {
            toast.error("Download URL not received");
          }
        },
        onError: (error) => {
          // Only show error if it's not a connection close after completion
          if (downloadState.status !== "complete") {
            setDownloadState((prev) => ({
              ...prev,
              status: "error",
              error,
              isConverting: false,
              isDownloading: false,
            }));
            toast.error(error);
          }
        },
        onInit: (es) => {
          eventSource = es;
        },
      });
    }

    return () => {
      if (cleanup) cleanup();
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [downloadState.id, downloadState.status]);

  const handleDownload = async () => {
    if (!selectedQuality) {
      toast.error("Please select a quality");
      return;
    }

    setDownloadState({
      status: "downloading",
      progress: 0,
      isConverting: false,
      isDownloading: false,
    });

    try {
      const response =
        activeTab === "video"
          ? await api.downloadVideo(url, selectedQuality, selectedExtension)
          : await api.downloadAudio(url, selectedQuality, selectedExtension);

      setDownloadState((prev) => ({
        ...prev,
        id: response.downloadId,
      }));
      setLastDownloadedQuality(selectedQuality);

      toast.success("Download started!");
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = extractErrorMessage(error);

      setDownloadState({
        status: "error",
        progress: 0,
        error: errorMessage,
        isConverting: false,
        isDownloading: false,
      });
      toast.error(errorMessage);
    }
  };

  const handleDownloadAgain = () => {
    if (downloadState.downloadUrl) {
      downloadFile(downloadState.downloadUrl);
    }
  };

  const handleActiveTab = (tab: FormatType) => {
    setActiveTab(tab);
    setSelectedQuality(null);
    setLastDownloadedQuality(null);
    setSelectedExtension(
      tab === "video" ? "mp4" : videoInfo.extensions.audio[0]
    );
  };

  const isNewDownload =
    selectedQuality !== lastDownloadedQuality ||
    (downloadState.status === "complete" && !lastDownloadedQuality);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background py-8 items-center flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-4xl px-4 w-full"
      >
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Video Preview Section */}
          <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-center">
            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 space-y-3"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold md:text-2xl lg:text-3xl line-clamp-2"
              >
                {videoInfo.title}
              </motion.h1>

              {videoInfo.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Description</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                      {videoInfo.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnail */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative lg:w-[400px]"
            >
              <div className="group relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md">
                  <Clock className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {formatDuration(videoInfo.duration)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Download Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/10 bg-card/30 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-6 ">
              {/* Format Selection */}
              <div className="flex items-center flex-col md:flex-row md:justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap w-full">
                  <div className="flex gap-3">
                    {["video", "audio"].map((tab) => (
                      <Button
                        key={tab}
                        size="lg"
                        onClick={() => handleActiveTab(tab as FormatType)}
                        className={`relative ${
                          activeTab === tab
                            ? "bg-primary hover:bg-primary/90"
                            : "bg-muted/50 hover:bg-muted/80"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Video
                            className={`h-5 w-5 ${
                              activeTab === tab
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={`font-semibold capitalize ${
                              activeTab === tab
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {tab}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {activeTab === "audio" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Select
                        value={selectedExtension}
                        onValueChange={setSelectedExtension}
                      >
                        <SelectTrigger className="h-12 w-[120px] border-none bg-muted/50 px-6 text-base font-medium hover:bg-muted/80">
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {videoInfo.extensions.audio.map((extension) => (
                            <SelectItem
                              key={extension}
                              value={extension}
                              className="text-base"
                            >
                              {extension.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </div>

                {selectedQuality && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary ring-1 ring-primary/20 whitespace-nowrap"
                  >
                    Selected: {selectedQuality}
                  </motion.div>
                )}
              </div>

              {/* Quality Grid */}
              <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
                {(activeTab === "video"
                  ? videoInfo.qualities.video
                  : videoInfo.qualities.audio
                ).map((quality, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={quality}
                  >
                    <Button
                      variant={
                        selectedQuality === quality ? "default" : "outline"
                      }
                      onClick={() => setSelectedQuality(quality)}
                      className="group relative h-auto w-full py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {activeTab === "video" ? (
                          <FileVideo className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        ) : (
                          <Music className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        )}
                        <span className="font-medium">{quality}</span>
                      </div>
                      {selectedQuality === quality && (
                        <motion.div
                          layoutId="quality-highlight"
                          className="absolute inset-0 -z-10 rounded-md bg-primary/10 ring-1 ring-primary/20"
                          transition={{ type: "spring", bounce: 0.2 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Progress & Actions */}
              <div className="space-y-4">
                {downloadState.status === "downloading" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-lg bg-muted/30 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {downloadState.isConverting ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Converting
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3" />
                            Downloading
                          </>
                        )}
                      </span>
                      <motion.span
                        key={downloadState.progress}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-medium text-primary"
                      >
                        {downloadState.progress.toFixed(1)}%
                      </motion.span>
                    </div>
                    <div className="relative h-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${downloadState.progress}%` }}
                        transition={{ type: "spring", bounce: 0 }}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  {downloadState.status === "complete" &&
                    downloadState.downloadUrl &&
                    !isNewDownload && (
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        size="lg"
                        onClick={handleDownloadAgain}
                      >
                        <Download className="h-4 w-4" />
                        Download Again
                      </Button>
                    )}

                  {downloadState.status !== "downloading" && isNewDownload && (
                    <Button
                      onClick={handleDownload}
                      disabled={!selectedQuality}
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      <Download className="h-4 w-4" />
                      Start Download
                    </Button>
                  )}

                  {downloadState.status === "downloading" && (
                    <Button disabled className="flex-1 gap-2" size="lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {downloadState.isConverting
                        ? "Converting..."
                        : "Downloading..."}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
