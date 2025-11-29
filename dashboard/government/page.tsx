"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Landmark, 
  Users, 
  TrendingUp, 
  Building,
  Shield,
  BarChart3,
  Download,
  Globe,
  Award,
  Target,
  Activity,
  MapPin,
  Briefcase,
  GraduationCap,
  IndianRupee,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bar, BarChart, Line, LineChart, Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data for national statistics
const nationalEmploymentData = [
  { year: "2020", employed: 680000, unemployed: 120000 },
  { year: "2021", employed: 750000, unemployed: 110000 },
  { year: "2022", employed: 820000, unemployed: 95000 },
  { year: "2023", employed: 900000, unemployed: 85000 },
  { year: "2024", employed: 980000, unemployed: 75000 },
];

const stateWiseData = [
  { state: "Maharashtra", alumni: 156000, avgSalary: 18.5 },
  { state: "Karnataka", alumni: 142000, avgSalary: 19.2 },
  { state: "Tamil Nadu", alumni: 128000, avgSalary: 17.8 },
  { state: "Delhi", alumni: 115000, avgSalary: 20.5 },
  { state: "Telangana", alumni: 98000, avgSalary: 18.9 },
  { state: "Gujarat", alumni: 87000, avgSalary: 16.5 },
];

const skillTrendsData = [
  { month: "Jan", ai: 45, cloud: 38, blockchain: 25, data: 42 },
  { month: "Feb", ai: 48, cloud: 40, blockchain: 28, data: 44 },
  { month: "Mar", ai: 52, cloud: 42, blockchain: 30, data: 46 },
  { month: "Apr", ai: 55, cloud: 45, blockchain: 33, data: 48 },
  { month: "May", ai: 58, cloud: 48, blockchain: 35, data: 50 },
  { month: "Jun", ai: 62, cloud: 50, blockchain: 38, data: 52 },
];

const sectorDistribution = [
  { sector: "Technology", count: 450000, percentage: 45 },
  { sector: "Finance", count: 200000, percentage: 20 },
  { sector: "Healthcare", count: 150000, percentage: 15 },
  { sector: "Manufacturing", count: 100000, percentage: 10 },
  { sector: "Education", count: 80000, percentage: 8 },
  { sector: "Others", count: 20000, percentage: 2 },
];

const topUniversities = [
  { name: "IIT Delhi", alumni: 45000, verified: 43500, placement: 95 },
  { name: "IIT Bombay", alumni: 42000, verified: 41000, placement: 96 },
  { name: "IIT Madras", alumni: 38000, verified: 37200, placement: 94 },
  { name: "BITS Pilani", alumni: 35000, verified: 34000, placement: 93 },
  { name: "IIT Kharagpur", alumni: 32000, verified: 31500, placement: 92 },
];

export default function GovernmentDashboard() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/login/government");
    }
  }, [session, isPending, router]);

  // Handle logout
  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Failed to sign out. Please try again.");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  // Show loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no session
  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Unilink
              </Link>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                Government
              </Badge>
              {user.departmentName && (
                <Badge variant="outline">{user.departmentName}</Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <Avatar>
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* National Overview Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Alumni</p>
                  <p className="text-2xl font-bold">1.05M</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Nationwide</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verified Records</p>
                  <p className="text-2xl font-bold">989K</p>
                  <p className="text-xs text-green-600 dark:text-green-400">94.2% verified</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Employment Rate</p>
                  <p className="text-2xl font-bold">92.9%</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+2.3% YoY</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <IndianRupee className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Salary</p>
                  <p className="text-2xl font-bold">₹18.5L</p>
                  <p className="text-xs text-green-600 dark:text-green-400">National avg.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">National Overview</TabsTrigger>
              <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
              <TabsTrigger value="policy">Policy Insights</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain Status</TabsTrigger>
            </TabsList>

            {/* National Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Employment Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>National Employment Trends</CardTitle>
                  <CardDescription>Employed vs unemployed alumni across India (2020-2024)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      employed: {
                        label: "Employed",
                        color: "hsl(var(--chart-1))",
                      },
                      unemployed: {
                        label: "Unemployed",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={nationalEmploymentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area type="monotone" dataKey="employed" stackId="1" stroke="var(--color-employed)" fill="var(--color-employed)" />
                        <Area type="monotone" dataKey="unemployed" stackId="1" stroke="var(--color-unemployed)" fill="var(--color-unemployed)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* State-wise Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>State-wise Alumni Distribution</CardTitle>
                    <CardDescription>Alumni count and average salary by state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        alumni: {
                          label: "Alumni Count",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stateWiseData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="state" type="category" width={100} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="alumni" fill="var(--color-alumni)" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Sector Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sector-wise Distribution</CardTitle>
                    <CardDescription>Alumni working across different sectors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sectorDistribution.map((sector) => (
                      <div key={sector.sector} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{sector.sector}</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {sector.count.toLocaleString()} ({sector.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                            style={{ width: `${sector.percentage * 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Top Universities */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Universities</CardTitle>
                  <CardDescription>Universities ranked by alumni count and placement rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topUniversities.map((uni, index) => (
                      <div key={uni.name} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            <span className="text-lg font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{uni.name}</h4>
                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>{uni.alumni.toLocaleString()} Alumni</span>
                              <span>•</span>
                              <span>{uni.verified.toLocaleString()} Verified</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{uni.placement}%</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Placement Rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trend Analysis Tab */}
            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emerging Skill Trends</CardTitle>
                  <CardDescription>Month-over-month growth in key skill areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      ai: {
                        label: "AI/ML",
                        color: "hsl(var(--chart-1))",
                      },
                      cloud: {
                        label: "Cloud Computing",
                        color: "hsl(var(--chart-2))",
                      },
                      blockchain: {
                        label: "Blockchain",
                        color: "hsl(var(--chart-3))",
                      },
                      data: {
                        label: "Data Science",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={skillTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="ai" stroke="var(--color-ai)" strokeWidth={2} />
                        <Line type="monotone" dataKey="cloud" stroke="var(--color-cloud)" strokeWidth={2} />
                        <Line type="monotone" dataKey="blockchain" stroke="var(--color-blockchain)" strokeWidth={2} />
                        <Line type="monotone" dataKey="data" stroke="var(--color-data)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <p className="text-2xl font-bold">+15.2%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tech Sector Growth</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                    <p className="text-2xl font-bold">+8.5%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Startup Employment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Globe className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <p className="text-2xl font-bold">+12.3%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Remote Work Adoption</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="mx-auto mb-2 h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <p className="text-2xl font-bold">+6.8%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Salary Increase</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Policy Insights Tab */}
            <TabsContent value="policy" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Recommendations</CardTitle>
                    <CardDescription>Data-driven policy suggestions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900 dark:text-blue-100">Skill Development Focus</h5>
                          <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                            Increase AI/ML and Blockchain training programs by 40% to meet industry demand
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-green-900 dark:text-green-100">Regional Balance</h5>
                          <p className="mt-1 text-sm text-green-800 dark:text-green-300">
                            Promote tier-2 city employment to reduce concentration in metros
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                          <span className="text-sm font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-purple-900 dark:text-purple-100">Startup Ecosystem</h5>
                          <p className="mt-1 text-sm text-purple-800 dark:text-purple-300">
                            Provide incentives for alumni entrepreneurship and innovation
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Critical Insights</CardTitle>
                    <CardDescription>Areas requiring immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      <div>
                        <h5 className="font-medium">Unemployment in Rural Areas</h5>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          18% higher than urban centers - requires targeted intervention
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div>
                        <h5 className="font-medium">Gender Gap in Tech</h5>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Only 32% women in tech roles - need diversity initiatives
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h5 className="font-medium">Salary Disparity</h5>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          30% variation across states - standardization needed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics Dashboard</CardTitle>
                  <CardDescription>Track progress on key government initiatives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Skill India Program Completion</span>
                        <span className="text-gray-600 dark:text-gray-400">78% (Target: 85%)</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[78%] bg-gradient-to-r from-blue-500 to-cyan-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Digital India Literacy</span>
                        <span className="text-gray-600 dark:text-gray-400">65% (Target: 75%)</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[65%] bg-gradient-to-r from-green-500 to-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Startup India Registration</span>
                        <span className="text-gray-600 dark:text-gray-400">92% (Target: 90%)</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-pink-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blockchain Status Tab */}
            <TabsContent value="blockchain" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <CardContent className="p-6">
                    <Shield className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">989K</h3>
                    <p className="text-green-100">Blockchain Verified</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-6">
                    <Activity className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">24/7</h3>
                    <p className="text-blue-100">System Uptime</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="p-6">
                    <BarChart3 className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">5.2M</h3>
                    <p className="text-purple-100">Transactions Recorded</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>National Blockchain Infrastructure</CardTitle>
                  <CardDescription>Secure verification system for educational credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-start gap-4">
                      <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold text-green-900 dark:text-green-100">Blockchain Benefits</h4>
                        <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                          <li>• Tamper-proof credential verification across all institutions</li>
                          <li>• Real-time validation and fraud prevention</li>
                          <li>• Decentralized storage ensuring data integrity</li>
                          <li>• Instant verification for employers and authorities</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <h5 className="mb-4 font-medium">Verification Statistics</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Total Verifications</span>
                          <span className="font-semibold">5.2M</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Success Rate</span>
                          <span className="font-semibold text-green-600">99.8%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Avg. Processing Time</span>
                          <span className="font-semibold">2.3 sec</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Fraud Prevented</span>
                          <span className="font-semibold text-red-600">12,450</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h5 className="mb-4 font-medium">System Health</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>System Status</span>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                            Operational
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Network Nodes</span>
                          <span className="font-semibold">847 Active</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Daily Transactions</span>
                          <span className="font-semibold">45.2K</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Response Time</span>
                          <span className="font-semibold text-green-600">&lt;3 sec</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}