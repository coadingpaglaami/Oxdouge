"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductResponse } from "@/interfaces/api";

interface ProductLeftProps {
  product?: ProductResponse;
}

export const ProductLeftChild = ({ product }: ProductLeftProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(true);
  const [activeImage, setActiveImage] = useState(product?.main_image);

  // Generate thumbnail from 5-second mark
  useEffect(() => {
    if (!product?.video) return;

    const video = document.createElement("video");
    video.src = product.video;
    video.crossOrigin = "anonymous";
    video.muted = true;

    const captureThumbnail = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/png");
        setThumbnail(base64); // set base64 directly
      }
      setVideoLoaded(false);
    };

    const handleSeeked = () => {
      captureThumbnail();
    };

    video.addEventListener("loadedmetadata", () => {
      // Go to 5 seconds or video duration if shorter
      video.currentTime = Math.min(5, video.duration);
    });

    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [product?.video]);
  useEffect(() => {
    if (product?.main_image) {
      setActiveImage(product.main_image);
    }
  }, [product?.main_image]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 2 * 120;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!product) return <div>Product not found</div>;

  return (
    <div className="flex flex-col gap-6 w-full md:w-1/2">
      {/* Main Image */}
      <div className="relative w-full aspect-video">
        <Image
          src={activeImage || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* More Images */}
      <div className="relative">
        <div className="flex items-center">
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-primary/20 rounded-full"
          >
            <ChevronLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none px-2"
          >
            {product.images?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`shrink-0 w-28 h-28 relative rounded-lg border cursor-pointer
        ${activeImage === img ? "border-primary" : "border-primary/30"}
      `}
              >
                <Image
                  src={img}
                  alt={`more-${idx}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-primary/20 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Video */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">How to Use</h3>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {!isVideoPlaying && (
            <>
              {videoLoaded ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Loading thumbnail...</span>
                </div>
              ) : (
                <>
                  <Image
                    src={thumbnail || "/placeholder.png"}
                    alt="Video thumbnail"
                    fill
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-primary/50 rounded-full"
                  >
                    <Play className="text-white" />
                  </button>
                </>
              )}
            </>
          )}

          {isVideoPlaying && product.video && (
            <video
              ref={videoRef}
              src={product.video}
              controls
              autoPlay
              className="w-full h-full rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};
