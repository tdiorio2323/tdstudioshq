import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ext } from "@/lib/safeLink";

const Auth = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Try to play video on any user interaction for mobile devices
      const playVideo = () => {
        video.play().catch(error => {
          console.log('Video autoplay blocked:', error);
        });
      };

      // Listen for user interactions to trigger video play
      const handleUserInteraction = () => {
        playVideo();
        // Remove listeners after first interaction
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('scroll', handleUserInteraction);
      };

      document.addEventListener('touchstart', handleUserInteraction, { passive: true });
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('scroll', handleUserInteraction, { passive: true });

      return () => {
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('scroll', handleUserInteraction);
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 relative overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/td-studios-home-background.jpg"
      >
        <source src="/td-studios-home-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <Card className="w-full max-w-sm sm:max-w-md bg-black/5 backdrop-blur-[2px] border-white/10 shadow-2xl drop-shadow-2xl relative z-20" style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}>
        <CardHeader className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <OptimizedImage
              src="/td-studios-chrome-metal-logo.png"
              alt="TD Studios"
              width={240}
              height={120}
              priority
              className="h-30 w-auto"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome to TD STUDIOS</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CTA Buttons */}
          <div className="space-y-3">
            <a
              href="https://tdstudiosny.com"
              target={ext.target}
              rel={ext.rel}
              className="btn-silver"
            >
              AGENCY
            </a>
            <a
              href="https://seriousinquiriesonly.tdstudiosny.com"
              target={ext.target}
              rel={ext.rel}
              className="btn-silver"
            >
              SERIOUS INQUIRIES ONLY
            </a>
            <a
              href="/mylars"
              className="btn-silver"
            >
              DESIGNS
            </a>
            <a
              href="/shop"
              className="btn-silver"
            >
              SHOP
            </a>
            <a
              href="https://wa.me/13474859935"
              target={ext.target}
              rel={ext.rel}
              className="btn-silver"
            >
              CONTACT
            </a>
          </div>

          <div className="button-row">
            <a
              href="https://instagram.com/tdstudiosco"
              target={ext.target}
              rel={ext.rel}
              className="btn-black"
            >
              FOLLOW @TDSTUDIOSCO
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
