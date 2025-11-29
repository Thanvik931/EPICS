import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import RoleCards from "@/components/RoleCards";
import Stats from "@/components/Stats";
import CTASection from "@/components/CTASection";
import { ArrowUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <section id="about">
        <RoleCards />
      </section>
      <Stats />
      <CTASection />
      
      {/* Footer */}
      <footer id="contact" className="border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Footer Navigation */}
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="/auth/role" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Portals</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/dashboard/student" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Student Portal</a></li>
                <li><a href="/dashboard/alumni" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Alumni Portal</a></li>
                <li><a href="/dashboard/university" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">University Portal</a></li>
                <li><a href="/dashboard/government" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Government Portal</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="mailto:contact@unilink.edu" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    contact@unilink.edu
                  </a>
                </li>
                <li>
                  <a href="tel:+911234567890" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    +91 123 456 7890
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8 text-center dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Unilink Alumni Platform. Built for Smart India Hackathon 2025.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <a
        href="#"
        className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:bg-blue-500 dark:hover:bg-blue-600"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </a>
    </div>
  );
}