
import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostSignupPrompt } from "@/components/share/PostSignupPrompt";
import { generateUniqueRefCode } from '@/utils/refCodeGenerator';

type AuthProps = {
  onLogin: (email: string) => void;
};

const Auth = ({ onLogin }: AuthProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPostSignup, setShowPostSignup] = useState(false);
  const [signupCity, setSignupCity] = useState<string | undefined>(undefined);
  
  const activeTab = searchParams.get("mode") || "login";
  const refCode = searchParams.get("ref");
  const returnTo = searchParams.get("returnTo");

  const handleTabChange = (value: string) => {
    // Preserve other query parameters when changing tabs
    const newParams = new URLSearchParams(searchParams);
    newParams.set("mode", value);
    setSearchParams(newParams);
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

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          const refCode = await generateUniqueRefCode('');
          
          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email,
              ref_code: refCode,
              invited_by: searchParams.get("ref") || null
            });
            
          if (updateError) {
            console.error("Error updating profile:", updateError);
          }
          
          onLogin(email);
          toast.success("Account created successfully!");
          
          // Changed: Navigate to onboarding instead of profile or returnTo
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
        
        // If returning user, navigate to returnTo URL if provided, otherwise go to home
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

  if (showPostSignup) {
    return (
      <PostSignupPrompt 
        city={signupCity}
        onContinue={handleContinueAfterSignup}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold mb-2 text-erasmatch-blue">
              Eras<span className="text-erasmatch-green">Match</span>
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
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Sign in to connect with other students
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Join Erasmus students heading to your destination
                </p>
                {refCode && (
                  <p className="mt-2 text-sm font-medium text-erasmatch-blue">
                    You were invited by a friend!
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
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
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-erasmatch-blue hover:bg-erasmatch-blue/90" 
                disabled={loading}
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
