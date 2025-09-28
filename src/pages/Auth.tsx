import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ext } from "@/lib/safeLink";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 relative overflow-hidden">
      {/* Video Background */}
      <video
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
              width={320}
              height={160}
              priority
              className="h-40 w-auto"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome to TD STUDIOS</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              variant="platinum"
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('https://tdstudiosny.com', ext.target, ext.rel)}
            >
              AGENCY
            </Button>
            <Button
              variant="platinum"
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('https://tdstudiosdigital.com', ext.target, ext.rel)}
            >
              DIGITAL
            </Button>
            <Button
              variant="platinum"
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => navigate('/mylars')}
            >
              DESIGNS
            </Button>
            <Button
              variant="platinum"
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => navigate('/shop')}
            >
              SHOP
            </Button>
            <Button
              variant="platinum"
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('https://wa.me/13474859935', ext.target, ext.rel)}
            >
              CONTACT
            </Button>
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
              onClick={() => window.open('https://instagram.com/tdstudiosco', ext.target, ext.rel)}
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

export default Auth;
