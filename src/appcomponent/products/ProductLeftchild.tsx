'use client';
import { DiselHeater } from '@/interfaces';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { ProductResponse } from '@/interfaces/api';

interface ProductLeftProps {
  product?: ProductResponse;
}

export const ProductLeftChild = ({ product }: ProductLeftProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
        <h3 className="text-lg font-semibold">How to Use</h3>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {!isVideoPlaying && (
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-primary/50 rounded-full"
            >
              <Play className="text-white" />
            </button>
          )}
          {isVideoPlaying && product.video && (
            <iframe
              src={product.video + '?autoplay=1'}
              title="How to Use Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};