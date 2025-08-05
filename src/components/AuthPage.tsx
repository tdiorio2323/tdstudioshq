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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let authResult;
      
      if (isSignUp) {
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
      } else {
        authResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (authResult.error) throw authResult.error;
      }

      if (authResult.data.user && !isSignUp) {
        // Get user role from user_roles table
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authResult.data.user.id)
          .single();

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
        backgroundImage: `url('/lovable-uploads/fa9437b3-6b52-4add-a826-421f47af7c9c.png')`,
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
              src="/lovable-uploads/9d23fdcd-25dd-46bf-bedd-97557e70bf90.png" 
              alt="Bag Man NY" 
              className="h-40 w-auto"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Join the Community</h2>
            <p className="text-white/70">Enter your email to get started</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
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

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 text-sm font-medium">
                    Create Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
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
                {isLoading ? "Loading..." : (isSignUp ? "Create Account" : "Continue")}
              </Button>
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-white/70 hover:text-white text-sm"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};