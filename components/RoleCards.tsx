"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Users, Building, Landmark, ArrowRight, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const roles = [
  {
    icon: UserCircle,
    title: "Alumni",
    description: "Mentor students, give back to your alma mater, and stay connected with your network.",
    features: ["Profile Showcase", "Mentorship Programs", "Donation Portal", "Career Analytics"],
    dashboardHref: "/dashboard/alumni",
    loginHref: "/auth/role?role=alumni",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Students",
    description: "Connect with alumni, access mentorship, find internships, and build your professional network.",
    features: ["Mentorship Matching", "Alumni Directory", "Networking Chat", "Financial Aid"],
    dashboardHref: "/dashboard/student",
    loginHref: "/auth/role?role=student",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Building,
    title: "Universities",
    description: "Manage alumni data, track engagement metrics, and leverage insights for institutional growth.",
    features: ["Real-time Analytics", "Verified Database", "Placement Stats", "Skill-Gap Analysis"],
    dashboardHref: "/dashboard/university",
    loginHref: "/auth/role?role=university",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Landmark,
    title: "Government",
    description: "Access nationwide alumni data, analyze trends, and create informed policy decisions.",
    features: ["National Statistics", "Trend Analysis", "Policy Insights", "Blockchain Verification"],
    dashboardHref: "/dashboard/government",
    loginHref: "/auth/role?role=government",
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function RoleCards() {
  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Choose Your Role
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Select your role to access tailored features and start your journey on the Unilink platform.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                <CardContent>
                  <ul className="mb-6 space-y-2">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className={`mr-2 h-1.5 w-1.5 rounded-full bg-gradient-to-br ${role.gradient}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2">
                    <Link href={role.dashboardHref}>
                      <Button className="group/btn w-full" size="sm">
                        View Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href={role.loginHref}>
                      <Button className="w-full" variant="outline" size="sm">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}