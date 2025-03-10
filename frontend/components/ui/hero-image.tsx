'use client'

import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
      <Image 
        src="/logo.svg" 
        alt="Exam System" 
        fill
        priority
        className="object-contain"
        onError={(e) => {
          // Fallback if the image doesn't exist
          e.currentTarget.src = "/logo.svg";
        }}
      />
    </div>
  );
}
