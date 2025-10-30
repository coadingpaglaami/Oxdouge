"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Video } from "lucide-react";

interface Props {
  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const VideoUploader = ({ videoFile, setVideoFile }: Props) => {
  const videoRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) setVideoFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="text-sm text-gray-300">How to Use Video (optional)</label>
      <div
        onClick={() => videoRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-2 border border-primary/20 p-4 rounded cursor-pointer flex justify-center items-center relative hover:bg-primary/10 transition"
      >
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
        {preview ? (
          <>
            <video src={preview} controls className="w-full max-h-40 object-cover rounded" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVideoFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-black/50 p-1 rounded"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
            <Video size={24} />
            <span>Click or drag video here</span>
          </div>
        )}
      </div>
    </div>
  );
};

