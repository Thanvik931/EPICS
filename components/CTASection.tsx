"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
          >
            <Sparkles className="h-4 w-4" />
            Join Thousands of Users
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl"
          >
            Ready to Connect with Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Alumni Network?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-10 text-lg text-gray-600 dark:text-gray-400"
          >
            Whether you're an alumnus looking to give back, a student seeking mentorship, or an institution aiming to strengthen engagement - Unilink is your platform for meaningful connections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/auth/role">
              <Button size="lg" className="group min-w-[200px] shadow-lg hover:shadow-xl transition-shadow">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Explore Features
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-600/10" />
      </div>
    </section>
  );
}
