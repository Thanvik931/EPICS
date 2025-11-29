"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, MessageCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: UserPlus,
    step: "1",
    title: "Create Your Profile",
    description: "Sign up and choose your role - Alumni, Student, University, or Government official.",
  },
  {
    icon: Search,
    step: "2",
    title: "Discover Connections",
    description: "Browse verified alumni profiles, mentors, or access analytics based on your role.",
  },
  {
    icon: MessageCircle,
    step: "3",
    title: "Engage & Connect",
    description: "Start conversations, request mentorship, donate, or analyze engagement data.",
  },
  {
    icon: TrendingUp,
    step: "4",
    title: "Grow Together",
    description: "Track progress, build networks, and contribute to the community's success.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Get started with Unilink in four simple steps and unlock a world of opportunities.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-blue-400 to-indigo-400 lg:block" />
              )}
              
              <Card className="relative h-full transition-all hover:shadow-lg dark:hover:shadow-blue-900/20">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <item.icon className="h-8 w-8" />
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600 shadow-md dark:bg-gray-800 dark:text-blue-400">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
