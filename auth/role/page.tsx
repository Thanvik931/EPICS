"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Users, Building, Landmark, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const roles = [
  {
    icon: UserCircle,
    title: "Alumni",
    description: "I'm an alumnus looking to give back and stay connected",
    loginHref: "/auth/login/alumni",
    registerHref: "/auth/register/alumni",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Student",
    description: "I'm a current student seeking mentorship and opportunities",
    loginHref: "/auth/login/student",
    registerHref: "/auth/register/student",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Building,
    title: "University",
    description: "I represent a university or educational institution",
    loginHref: "/auth/login/university",
    registerHref: "/auth/register/university",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Landmark,
    title: "Government",
    description: "I'm a government official accessing national data",
    loginHref: "/auth/login/government",
    registerHref: "/auth/register/government",
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-5xl"
        >
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              Select Your Role
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Choose the option that best describes you to access your personalized dashboard
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full transition-all hover:shadow-xl dark:hover:shadow-blue-900/20">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${role.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                      <role.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">{role.title}</CardTitle>
                    <CardDescription className="text-base">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href={role.loginHref}>
                      <Button className="group/btn w-full" size="lg" variant="default">
                        Sign In as {role.title}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href={role.registerHref}>
                      <Button className="w-full" size="lg" variant="outline">
                        Create {role.title} Account
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}