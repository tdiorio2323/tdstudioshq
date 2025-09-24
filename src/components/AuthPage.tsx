import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const AuthPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/67d6d2cf-3ae5-48f0-8b30-8cbded3815b7.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40" />
      
      <Card className="w-full max-w-md bg-black/10 backdrop-blur-sm border-white/10 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/29251ffd-00b5-4b7d-b8a1-a2f82a9b0479.png" 
              alt="TD Studios" 
              className="h-40 w-auto"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome to TD STUDIOS</h2>
            <p className="text-white/70">Follow us for premium drops and studio updates</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              variant="platinum" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('https://tdstudiosny.com', '_blank', 'noopener,noreferrer')}
            >
              AGENCY
            </Button>
            <Button 
              variant="platinum" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('https://tdstudiosdigital.com', '_blank', 'noopener,noreferrer')}
            >
              DIGITAL
            </Button>
            <Button 
              variant="platinum" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={undefined}
            >
              DESIGNS
            </Button>
            <Button 
              variant="platinum" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={undefined}
            >
              CANNABIS
            </Button>
            <Button 
              variant="platinum" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={undefined}
            >
              CONTACT
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="ghost"
              type="button"
              className="glossy-instagram w-full h-14 rounded-xl flex items-center justify-center"
              onClick={() => window.open('https://instagram.com/tdstudiosco', '_blank', 'noopener,noreferrer')}
            >
              FOLLOW @TDSTUDIOSCO
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
