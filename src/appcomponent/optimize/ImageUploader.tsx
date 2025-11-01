"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import Image from "next/image";
import { ProductResponse } from "@/interfaces/api";

interface Props {
  mainFile: File | null;
  setMainFile: React.Dispatch<React.SetStateAction<File | null>>;
  moreFiles: File[];
  setMoreFiles: React.Dispatch<React.SetStateAction<File[]>>;
  editing: ProductResponse | null;
}

export const ImageUploader = ({
  mainFile,
  setMainFile,
  moreFiles,
  setMoreFiles,
  editing,
}: Props) => {
  const mainRef = useRef<HTMLInputElement | null>(null);
  const moreRef = useRef<HTMLInputElement | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(
    editing?.main_image ?? null
  );
  const [morePreviews, setMorePreviews] = useState<string[]>(
    editing?.images ?? []
  );

  useEffect(() => {
    if (mainFile) {
      const url = URL.createObjectURL(mainFile);
      setMainPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mainFile]);

  useEffect(() => {
    if (moreFiles.length) {
      const urls = moreFiles.map((f) => URL.createObjectURL(f));
      setMorePreviews(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    } else {
      setMorePreviews([]);
    }
  }, [moreFiles]);

  const removeMore = (idx: number) => {
    setMoreFiles((prev) => prev.filter((_, i) => i !== idx));
    setMorePreviews((prev) => {
      const urlToRevoke = prev[idx];
      if (urlToRevoke && urlToRevoke.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(urlToRevoke);
        } catch (err) {
          // ignore
        }
      }
      return prev.filter((_, i) => i !== idx);
    });

    if (moreRef.current) {
      moreRef.current.value = "";
    }
  };

  const handleDropMain = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) setMainFile(e.dataTransfer.files[0]);
  };

  const handleDropMore = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) setMoreFiles((cur) => [...cur, ...files]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div
        onClick={() => mainRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropMain}
        className="border border-primary/20 rounded p-3 flex items-center gap-4 cursor-pointer hover:bg-primary/10 transition"
      >
        <input
          ref={mainRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setMainFile(e.target.files?.[0] ?? null)}
        />
        {mainPreview ? (
          <div className="relative">
            <Image
              src={mainPreview}
              className="w-24 h-24 object-cover rounded"
              width={100}
              height={100}
              alt="main"
            />
            {mainFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMainFile(null);
                  setMainPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 bg-[#0B0B0B] flex items-center justify-center text-gray-400">
            <Plus />
          </div>
        )}
      </div>

      {/* More Images */}
      <div
        onClick={() => moreRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropMore}
        className="border border-primary/20 rounded p-3 min-h-20 flex flex-col gap-2 cursor-pointer hover:bg-primary/10 transition"
      >
        <input
          ref={moreRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            if (files.length) setMoreFiles((cur) => [...cur, ...files]);
          }}
        />
        <div className="flex gap-2 overflow-x-auto items-center">
          {morePreviews.map((src, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded overflow-hidden border border-primary/20 shrink-0"
            >
              <Image
                src={src}
                alt={`preview ${idx}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMore(idx);
                }}
                className="absolute top-1 right-1 bg-black/50 p-1 rounded"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <div className="w-20 h-20 flex items-center justify-center rounded border border-dashed border-primary/30 shrink-0 hover:border-primary/60 transition text-white">
            <Plus size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};