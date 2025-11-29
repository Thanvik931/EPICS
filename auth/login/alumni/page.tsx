"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, UserCircle, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function AlumniLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  // Get redirect URL from query params
  const redirectUrl = searchParams.get("redirect") || searchParams.get("callbackURL") || "/dashboard/alumni";

  // Redirect if already authenticated
  useEffect(() => {
    if (!isPending && session?.user) {
      router.push(redirectUrl);
    }
  }, [session, isPending, router, redirectUrl]);

  // Show loading skeleton while checking session
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="mx-auto max-w-md">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
                <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Don't render form if already authenticated
  if (session?.user) {
    return null;
  }

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    if (errors.email) {
      setErrors({ ...errors, email: validateEmail(email) });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    if (errors.password) {
      setErrors({ ...errors, password: validatePassword(password) });
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectUrl
      });

      if (error?.code) {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Signing in with Google...");
    } catch (err) {
      console.error("Google sign-in exception:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: redirectUrl
      });

      if (error?.code) {
        console.error("Login error:", error);
        
        // Specific error messages based on error codes
        const errorMessages: Record<string, string> = {
          "INVALID_EMAIL_OR_PASSWORD": "Invalid email or password. Please check your credentials and try again.",
          "USER_NOT_FOUND": "No account found with this email. Please register first.",
          "INVALID_PASSWORD": "Incorrect password. Please try again.",
          "EMAIL_NOT_VERIFIED": "Please verify your email address before logging in. Check your inbox for the verification link.",
          "ACCOUNT_LOCKED": "Your account has been locked due to too many failed login attempts. Please try again later or contact support.",
          "ACCOUNT_DISABLED": "Your account has been disabled. Please contact support for assistance.",
          "TOO_MANY_REQUESTS": "Too many login attempts. Please wait a few minutes before trying again.",
          "NETWORK_ERROR": "Network error. Please check your internet connection and try again.",
        };

        const errorMessage = errorMessages[error.code] || "Invalid email or password. Please make sure you have already registered an account and try again.";
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      toast.success("Login successful! Redirecting...");
      router.push(redirectUrl);
    } catch (err) {
      console.error("Login exception:", err);
      toast.error("An unexpected error occurred. Please check your internet connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
            <li><span>/</span></li>
            <li><span className="text-gray-900 dark:text-gray-100">Alumni Login</span></li>
          </ol>
        </nav>

        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="group"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-md"
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                <UserCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl">Alumni Login</CardTitle>
              <CardDescription className="text-base">
                Sign in to connect with your alma mater
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alumni@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleEmailChange}
                      onBlur={() => setErrors({ ...errors, email: validateEmail(formData.email) })}
                      required
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="none"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="flex items-center text-sm text-red-600 dark:text-red-400" role="alert">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      onBlur={() => setErrors({ ...errors, password: validatePassword(formData.password) })}
                      required
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="flex items-center text-sm text-red-600 dark:text-red-400" role="alert">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label
                          htmlFor="remember"
                          className="cursor-help text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Stay logged in for 30 days. Don't use this on shared devices.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Not registered yet?{" "}
                  <Link 
                    href={`/auth/register/alumni${redirectUrl !== "/dashboard/alumni" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Register as Alumni
                  </Link>
                </div>

                <div className="text-center text-sm">
                  <Link href="/help" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Need help? Contact Support
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function AlumniLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="mx-auto max-w-md">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
                <div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    }>
      <AlumniLoginForm />
    </Suspense>
  );
}