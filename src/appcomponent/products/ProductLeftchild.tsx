'use client';
import { DiselHeater } from '@/interfaces';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ProductResponse } from '@/interfaces/api';

interface ProductLeftProps {
  product?: ProductResponse;
}

export const ProductLeftChild = ({ product }: ProductLeftProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Generate thumbnail from first frame
  useEffect(() => {
    const video = document.createElement("video");
    video.src = product?.video || "";
    video.crossOrigin = "anonymous"; // needed if CORS video
    video.muted = true;

    const captureThumbnail = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setThumbnail(imageUrl);
      }
    };

    video.addEventListener("loadeddata", captureThumbnail);
    return () => {
      video.removeEventListener("loadeddata", captureThumbnail);
    };
  }, [product?.video]);

  console.log("Thumbnail URL:", thumbnail);

  if (!product) return <div>Product not found</div>;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 2 * 120; // scroll 2 images width
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full md:w-1/2">
      {/* Main Image */}
      <div className="w-full md:h-[500px] relative">
        <Image src={product.main_image || ''} alt={product.title} fill className="object-cover rounded-lg w-full" />
      </div>

      {/* More Images with Chevron */}
      <div className="relative">
        <div className="flex items-center">
          <button onClick={() => scroll('left')} className="p-2 bg-primary/20 rounded-full">
            <ChevronLeft />
          </button>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-none px-2">
            {product.images?.map((img, idx) => (
              <div key={idx} className="shrink-0 w-28 h-28 relative rounded-lg border border-primary/30">
                <Image src={img} alt={`more-${idx}`} fill className="object-cover rounded-lg" />
              </div>
            ))}
          </div>
          <button onClick={() => scroll('right')} className="p-2 bg-primary/20 rounded-full">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* How to Use Video */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">How to Use</h3>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
           {!isVideoPlaying && (
        <>
          <Image
            src={thumbnail || "/placeholder.png"} // fallback while thumbnail loads
            alt="Video thumbnail"
            fill
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsVideoPlaying(true)}
            className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-primary/50 rounded-full"
          >
            <Play className="text-white" />
          </button>
        </>
      )}

      {/* Video player */}
      {isVideoPlaying && product.video && (
        <video
          ref={videoRef}
          src={product.video}
          controls
          autoPlay
          className="w-full h-full"
        />
      )}
        </div>
      </div>
    </div>
  );
};