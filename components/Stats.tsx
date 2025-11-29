"use client";

import { Users, GraduationCap, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Alumni",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: GraduationCap,
    value: "1,00,000+",
    label: "Students Connected",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Universities",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Satisfaction Rate",
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function Stats() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 dark:from-blue-900 dark:to-indigo-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">
            Platform Impact
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-blue-100">
            Empowering thousands of connections and transforming the alumni engagement landscape.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className={`mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-5xl font-bold text-transparent`}>
                {stat.value}
              </div>
              <p className="text-lg font-medium text-blue-100">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
