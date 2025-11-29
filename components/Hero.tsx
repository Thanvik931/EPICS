"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, UserCircle, Users, Building, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const quickAccessRoles = [
  { icon: UserCircle, label: "Alumni", href: "/dashboard/alumni", color: "from-blue-500 to-cyan-500" },
  { icon: Users, label: "Student", href: "/dashboard/student", color: "from-purple-500 to-pink-500" },
  { icon: Building, label: "University", href: "/dashboard/university", color: "from-orange-500 to-red-500" },
  { icon: Landmark, label: "Government", href: "/dashboard/government", color: "from-green-500 to-emerald-500" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      <div className="container relative mx-auto px-4 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
          >
            <Sparkles className="h-4 w-4" />
            Smart India Hackathon 2025 Solution
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Unilink
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl"
          >
            AI-Powered Centralized Alumni Platform
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-10 text-lg text-gray-600 dark:text-gray-400"
          >
            Connecting alumni, students, universities, and government for enhanced engagement,
            mentorship, career success, and data-driven insights with blockchain-verified credentials.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/auth/role">
              <Button size="lg" className="group min-w-[200px] shadow-lg hover:shadow-xl transition-shadow">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Learn More
              </Button>
            </a>
          </motion.div>

          {/* Quick Access Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16"
          >
            <p className="mb-6 text-sm font-medium text-gray-600 dark:text-gray-400">
              Quick Access to Portals
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quickAccessRoles.map((role, index) => (
                <motion.div
                  key={role.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                >
                  <Link href={role.href}>
                    <Button
                      variant="outline"
                      className="group h-auto w-full flex-col gap-2 p-4 transition-all hover:shadow-md"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.color} text-white transition-transform group-hover:scale-110`}>
                        <role.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">{role.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-600/10" />
      </div>
    </section>
  );
}