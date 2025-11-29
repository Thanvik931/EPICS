"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Unilink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Roles
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Contact
            </Link>
            
            {/* Quick Access Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboards
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/student" className="cursor-pointer">
                    Student Portal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/alumni" className="cursor-pointer">
                    Alumni Portal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/university" className="cursor-pointer">
                    University Portal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/government" className="cursor-pointer">
                    Government Portal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/role" className="cursor-pointer font-medium">
                    Sign In
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/auth/role">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-gray-200 py-4 dark:border-gray-800 md:hidden">
            <div className="flex flex-col gap-4">
              <Link 
                href="#features" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#about" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Roles
              </Link>
              <Link 
                href="#contact" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Quick Access</p>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard/student" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Student Portal
                    </Button>
                  </Link>
                  <Link href="/dashboard/alumni" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Alumni Portal
                    </Button>
                  </Link>
                  <Link href="/dashboard/university" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      University Portal
                    </Button>
                  </Link>
                  <Link href="/dashboard/government" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Government Portal
                    </Button>
                  </Link>
                </div>
              </div>

              <Link href="/auth/role" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}