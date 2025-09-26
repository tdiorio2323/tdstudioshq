import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LinkTest = () => {
  const candymanImages = [
    "/slideshow/candyman1.png",
    "/slideshow/candyman2.png",
    "/slideshow/candyman3.png",
    "/slideshow/candyman4.jpg",
    "/slideshow/candyman5.jpg",
    "/slideshow/candyman6.png",
    "/slideshow/candyman7.png",
    "/slideshow/candyman8.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % candymanImages.length
      );
    }, 2000); // 2 seconds per image

    return () => clearInterval(interval);
  }, [candymanImages.length]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 relative bg-cover bg-center bg-no-repeat md:bg-[url('/lovable-uploads/67d6d2cf-3ae5-48f0-8b30-8cbded3815b7.png')] bg-[url('/times%20square')]"
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40" />

      <Card className="w-full max-w-sm sm:max-w-md bg-black/5 backdrop-blur-[2px] border-white/10 shadow-2xl drop-shadow-2xl relative z-10" style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}>
        <CardHeader className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <img
              src="/products/rich-off-candy.PNG"
              alt="Rich Off Candy"
              className="h-40 w-auto"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">CANDYMAN EXOTICS</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              variant="platinum"
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('https://www.instagram.com/candyman__exotics/', '_blank', 'noopener,noreferrer')}
            >
              FOLLOW
            </Button>
            <Button
              variant="platinum"
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => {}}
            >
              TELEGRAM
            </Button>
          </div>

          {/* Image Slideshow */}
          <div className="w-full h-80 bg-white/5 rounded-lg overflow-hidden">
            <img
              src={candymanImages[currentImageIndex]}
              alt={`Candyman ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              type="button"
              className="glossy-instagram w-full h-14 rounded-xl flex items-center justify-center overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, rgba(131, 58, 180, 0.9) 0%, rgba(253, 29, 29, 0.9) 50%, rgba(252, 176, 64, 0.9) 100%)',
                boxShadow: '0 8px 32px 0 rgba(131, 58, 180, 0.37), inset 0 2px 4px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}
              onClick={() => window.open('https://instagram.com/tdstudiosco', '_blank', 'noopener,noreferrer')}
            >
              <div
                className="absolute inset-0 opacity-30 animate-shine"
                style={{
                  background: 'linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%)'
                }}
              />
              FOLLOW @TDSTUDIOSCO
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkTest;