
import { useState, FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AuthProps = {
  onLogin: (email: string) => void;
};

const Auth = ({ onLogin }: AuthProps) => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSignUp = mode === "signup";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp && !name) {
      toast.error("Please enter your name");
      setLoading(false);
      return;
    }

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
          options: {
            data: {
              name
            }
          }
        });

        if (error) throw error;
        
        if (data.user) {
          // Update the profile with name
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ name })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Error updating profile:", updateError);
          }
          
          toast.success("Account created successfully!");
          onLogin(email);
          navigate("/profile");
        } else {
          toast.info("Please check your email to confirm your registration");
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        toast.success("Welcome back!");
        onLogin(email);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || (isSignUp ? "Failed to create account" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold mb-2 text-erasmatch-blue">
              Eras<span className="text-erasmatch-green">Match</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp
              ? "Join the Erasmus community"
              : "Sign in to connect with other students"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required={isSignUp}
                  className="mt-1"
                />
              </div>
            </div>
          )}

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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <Link
              to={isSignUp ? "/auth?mode=login" : "/auth?mode=signup"}
              className="ml-1 font-medium text-erasmatch-blue hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
