import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostSignupPrompt } from "@/components/share/PostSignupPrompt";

import { GoogleAuthHandler } from "@/components/auth/GoogleAuthHandler";

type AuthProps = {
  onLogin: (email: string) => void;
};

const Auth = ({ onLogin }: AuthProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPostSignup, setShowPostSignup] = useState(false);
  const [signupCity, setSignupCity] = useState<string | undefined>(undefined);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  
  const activeTab = searchParams.get("mode") || "login";
  const refCode = searchParams.get("ref");
  const returnTo = searchParams.get("returnTo");

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("mode", value);
    setSearchParams(newParams);
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    
    // Store referral and return info in sessionStorage before redirect
    // (Google strips custom queryParams on callback)
    if (refCode) sessionStorage.setItem("pendingRefCode", refCode);
    if (returnTo) sessionStorage.setItem("pendingReturnTo", returnTo);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth?mode=google-callback`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isSignUp = activeTab === "signup";

    if (!email) {
      toast.error("Please enter your email");
      setLoading(false);
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      setLoading(false);
      return;
    }

    if (isSignUp && !privacyConsent) {
      toast.error("Please agree to the Privacy Policy to continue");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Store referral info in sessionStorage so AuthProvider can use it
        const ref = searchParams.get("ref");
        if (ref) {
          sessionStorage.setItem("pendingRefCode", ref);
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          onLogin(email);
          toast.success("Account created successfully!");
          navigate("/onboarding");
          return;
        } else {
          toast.info("Please check your email to confirm your registration");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        toast.success("Welcome back!");
        onLogin(email);
        
        if (returnTo) {
          navigate(returnTo);
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Email or password not recognised.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAfterSignup = () => {
    navigate("/profile");
  };

  if (activeTab === "google-callback") {
    return <GoogleAuthHandler />;
  }

  if (showPostSignup) {
    return (
      <PostSignupPrompt 
        city={signupCity}
        onContinue={handleContinueAfterSignup}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-display font-extrabold mb-2">
              <span className="text-erasmatch-blue">Eras</span><span className="text-erasmatch-green">Match</span>
            </h1>
          </Link>
          
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full mt-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Welcome back</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in to connect with other students
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Create your account</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Join Erasmus students heading to your destination
                </p>
                {refCode && (
                  <p className="mt-2 text-sm font-medium text-erasmatch-green">
                    You were invited by a friend!
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-card py-8 px-6 shadow-card rounded-2xl border border-border">
          {/* Google Sign In Button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full border-border hover:bg-secondary"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? "Connecting..." : `Continue with Google`}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </Label>
                {activeTab === "login" && (
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                    onClick={async () => {
                      if (!email) {
                        toast.error("Please enter your email first");
                        return;
                      }
                      setLoading(true);
                      try {
                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: `${window.location.origin}/reset-password`,
                        });
                        if (error) throw error;
                        toast.success("Password reset link sent! Check your email.");
                      } catch (error: any) {
                        toast.error(error.message || "Failed to send reset link");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {activeTab === "signup" && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy-consent"
                  checked={privacyConsent}
                  onCheckedChange={(checked) => setPrivacyConsent(checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="privacy-consent" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link 
                    to="/privacy-policy" 
                    className="text-erasmatch-green hover:text-erasmatch-green/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            )}

            <div>
              <Button 
                type="submit" 
                className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full" 
                disabled={loading || googleLoading}
              >
                {loading ? "Processing..." : activeTab === "signup" ? "Create Account" : "Sign In"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;