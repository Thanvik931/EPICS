"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Building2, Shield, TrendingUp, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Alumni Network",
    description: "Connect with verified alumni for mentorship, career guidance, and networking opportunities.",
  },
  {
    icon: GraduationCap,
    title: "Student Empowerment",
    description: "Access mentorship, internships, financial aid, and career resources from alumni.",
  },
  {
    icon: Building2,
    title: "University Insights",
    description: "Real-time analytics on engagement, placements, and skill-gap analysis for better decision-making.",
  },
  {
    icon: Shield,
    title: "Blockchain Verified",
    description: "Secure, tamper-proof verification of credentials and alumni data using blockchain technology.",
  },
  {
    icon: TrendingUp,
    title: "Career Analytics",
    description: "Track alumni career trajectories, industry trends, and placement statistics with AI-powered insights.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot Support",
    description: "24/7 intelligent assistance for queries, guidance, and platform navigation.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Platform Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Comprehensive tools and features designed to enhance alumni engagement and foster meaningful connections.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-all hover:shadow-lg dark:hover:shadow-blue-900/20">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}