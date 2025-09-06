import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onLogin?: (role: 'customer' | 'brand' | 'admin') => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const navigate = useNavigate();
  // Force refresh to clear isSignUp reference error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // If password field is not shown yet, show it after email is entered
    if (!showPasswordField) {
      setShowPasswordField(true);
      return;
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First try to sign in
      let authResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If sign in fails, try to sign up
      if (authResult.error && authResult.error.message.includes('Invalid login credentials')) {
        authResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });
        
        if (authResult.error) throw authResult.error;
        
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account",
        });
        return;
      }
      
      if (authResult.error) throw authResult.error;

      if (authResult.data.user) {
        // Get user role from user_roles table
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authResult.data.user.id)
          .maybeSingle();

        if (roleData) {
          const userRole = roleData.role;
          
          // Navigate based on role
          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userRole === 'brand') {
            navigate('/brand');
          } else {
            navigate('/shop');
          }
          
          // Call onLogin if provided (for backward compatibility)
          if (onLogin) {
            onLogin(userRole);
          }
        } else {
          // Default to customer role if no role found
          navigate('/shop');
        }
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    navigate('/shop'); // Mock Google auth
  };

  const handleAppleAuth = () => {
    navigate('/shop'); // Mock Apple auth
  };

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
            <h2 className="text-2xl font-bold text-white">Join the Community</h2>
            <p className="text-white/70">Enter your email to get started</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              variant="chrome" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('#', '_blank')}
            >
              View Services
            </Button>
            <Button 
              variant="platinum" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('#', '_blank')}
            >
              Portfolio
            </Button>
            <Button 
              variant="gold" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('#', '_blank')}
            >
              Join Waitlist
            </Button>
            <Button 
              variant="emerald" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('#', '_blank')}
            >
              Book a Call
            </Button>
            <Button 
              variant="chrome" 
              className="w-full h-12 text-base font-semibold rounded-xl"
              onClick={() => window.open('#', '_blank')}
            >
              About Us
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white/90 text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 text-white placeholder:text-white/50 border-white/30 h-12 text-base"
                />
              </div>

              {showPasswordField && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 text-white placeholder:text-white/50 border-white/30 pr-10 h-12 text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-white/60" />
                      ) : (
                        <Eye className="h-4 w-4 text-white/60" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary-hover"
              >
                {isLoading ? "Loading..." : (!showPasswordField ? "Continue" : "Sign In")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};