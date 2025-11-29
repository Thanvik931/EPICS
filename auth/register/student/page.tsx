"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, Lock, Mail, User, Building2, Calendar, Home, RefreshCw, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function StudentRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    registrationNumber: "",
    university: "",
    enrollmentYear: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    if (!formData.university.trim()) {
      newErrors.university = "University name is required";
    }

    if (!formData.enrollmentYear) {
      newErrors.enrollmentYear = "Enrollment year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      if (error?.code) {
        const errorMap: Record<string, string> = {
          USER_ALREADY_EXISTS: "This email is already registered. Please sign in instead.",
          INVALID_EMAIL: "Please enter a valid email address",
          WEAK_PASSWORD: "Please choose a stronger password",
          EMAIL_VERIFICATION_REQUIRED: "Please verify your email address",
        };
        toast.error(errorMap[error.code] || "Registration failed. Please try again.");
        console.error("Registration error:", error);
        setIsLoading(false);
        return;
      }

      toast.success("🎉 Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login/student?registered=true");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="group">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/auth/role">
            <Button variant="outline" className="group">
              <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
              Change Role
            </Button>
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400">
            Home
          </Link>
          <span>/</span>
          <Link href="/auth/role" className="hover:text-purple-600 dark:hover:text-purple-400">
            Role Selection
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900 dark:text-white">Student Registration</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-md"
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl">Student Registration</CardTitle>
              <CardDescription className="text-base">
                Create your account to access the student dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setErrors({ ...errors, name: "" });
                      }}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      required
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.edu"
                      className="pl-10"
                      inputMode="email"
                      autoCapitalize="none"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: "" });
                      }}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="registrationNumber"
                      type="text"
                      placeholder="e.g., 2023CS001"
                      className="pl-10"
                      value={formData.registrationNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, registrationNumber: e.target.value });
                        setErrors({ ...errors, registrationNumber: "" });
                      }}
                      aria-invalid={!!errors.registrationNumber}
                      aria-describedby="reg-help"
                      required
                    />
                  </div>
                  <p id="reg-help" className="text-xs text-gray-500">Your unique student identification number</p>
                  {errors.registrationNumber && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="university"
                      type="text"
                      placeholder="Your University Name"
                      className="pl-10"
                      value={formData.university}
                      onChange={(e) => {
                        setFormData({ ...formData, university: e.target.value });
                        setErrors({ ...errors, university: "" });
                      }}
                      aria-invalid={!!errors.university}
                      required
                    />
                  </div>
                  {errors.university && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.university}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentYear">Enrollment Year *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="enrollmentYear"
                      type="number"
                      placeholder="2023"
                      className="pl-10"
                      min="1900"
                      max="2100"
                      value={formData.enrollmentYear}
                      onChange={(e) => {
                        setFormData({ ...formData, enrollmentYear: e.target.value });
                        setErrors({ ...errors, enrollmentYear: "" });
                      }}
                      aria-invalid={!!errors.enrollmentYear}
                      required
                    />
                  </div>
                  {errors.enrollmentYear && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.enrollmentYear}
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
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrors({ ...errors, password: "" });
                      }}
                      aria-invalid={!!errors.password}
                      aria-describedby="password-help"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p id="password-help" className="text-xs text-gray-500">Minimum 8 characters</p>
                  {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setErrors({ ...errors, confirmPassword: "" });
                      }}
                      aria-invalid={!!errors.confirmPassword}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Student Account"}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/auth/login/student" className="font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline">
                    Sign in here
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