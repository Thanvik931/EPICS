"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building, 
  Users, 
  TrendingUp, 
  Briefcase,
  GraduationCap,
  Shield,
  CheckCircle,
  Clock,
  Search,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Target,
  AlertCircle,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bar, BarChart, Line, LineChart, Pie, PieChart as RePieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data for analytics
const engagementData = [
  { month: "Jul", active: 450, inactive: 150 },
  { month: "Aug", active: 520, inactive: 130 },
  { month: "Sep", active: 580, inactive: 120 },
  { month: "Oct", active: 650, inactive: 100 },
  { month: "Nov", active: 720, inactive: 90 },
  { month: "Dec", active: 800, inactive: 80 },
];

const placementData = [
  { year: "2020", placed: 320, total: 400 },
  { year: "2021", placed: 380, total: 450 },
  { year: "2022", placed: 420, total: 480 },
  { year: "2023", placed: 450, total: 500 },
  { year: "2024", placed: 480, total: 520 },
];

const skillGapData = [
  { skill: "AI/ML", demand: 85, supply: 45 },
  { skill: "Cloud", demand: 75, supply: 60 },
  { skill: "Blockchain", demand: 70, supply: 30 },
  { skill: "Data Science", demand: 80, supply: 55 },
  { skill: "Cybersecurity", demand: 65, supply: 40 },
];

const industryDistribution = [
  { name: "Tech", value: 45, color: "#3b82f6" },
  { name: "Finance", value: 20, color: "#10b981" },
  { name: "Healthcare", value: 15, color: "#f59e0b" },
  { name: "Education", value: 12, color: "#8b5cf6" },
  { name: "Others", value: 8, color: "#6b7280" },
];

// Mock alumni database
const alumniDatabase = [
  {
    id: "ALU001",
    name: "Amit Sharma",
    batch: "2018",
    course: "B.Tech CSE",
    company: "Google India",
    position: "Senior Engineer",
    salary: "₹40L",
    blockchain: "verified",
    lastActive: "2 days ago",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    id: "ALU002",
    name: "Priya Mehta",
    batch: "2017",
    course: "B.Tech CSE",
    company: "Microsoft",
    position: "Data Scientist",
    salary: "₹35L",
    blockchain: "verified",
    lastActive: "1 day ago",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: "ALU003",
    name: "Rajesh Kumar",
    batch: "2016",
    course: "B.Tech ME",
    company: "Amazon",
    position: "Product Manager",
    salary: "₹45L",
    blockchain: "verified",
    lastActive: "5 hours ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: "ALU004",
    name: "Sneha Reddy",
    batch: "2019",
    course: "B.Tech ECE",
    company: "Flipkart",
    position: "Full Stack Developer",
    salary: "₹28L",
    blockchain: "pending",
    lastActive: "1 week ago",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    id: "ALU005",
    name: "Vikram Singh",
    batch: "2015",
    course: "B.Tech CSE",
    company: "TCS",
    position: "Tech Lead",
    salary: "₹32L",
    blockchain: "verified",
    lastActive: "3 days ago",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
];

export default function UniversityDashboard() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/login/university");
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
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
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
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                University
              </Badge>
              {user.institutionName && (
                <Badge variant="outline">{user.institutionName}</Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
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
          {/* Overview Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Alumni</p>
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+12% this year</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verified Alumni</p>
                  <p className="text-2xl font-bold">2,683</p>
                  <p className="text-xs text-green-600 dark:text-green-400">94.2% verified</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold">800</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+8% this month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <Briefcase className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Placement</p>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+3% from last year</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="database">Alumni Database</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain Verification</TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Alumni Engagement Trends</CardTitle>
                  <CardDescription>Monthly active vs inactive users over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      active: {
                        label: "Active Users",
                        color: "hsl(var(--chart-1))",
                      },
                      inactive: {
                        label: "Inactive Users",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="active" fill="var(--color-active)" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="inactive" fill="var(--color-inactive)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Placement Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Placement Statistics</CardTitle>
                    <CardDescription>Year-over-year placement trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        placed: {
                          label: "Placed",
                          color: "hsl(var(--chart-3))",
                        },
                        total: {
                          label: "Total",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={placementData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="placed" stroke="var(--color-placed)" strokeWidth={2} />
                          <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Industry Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Industry Distribution</CardTitle>
                    <CardDescription>Where your alumni are working</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                          <Pie
                            data={industryDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {industryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skill Gap Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Skill Gap Analysis</CardTitle>
                  <CardDescription>Industry demand vs alumni skill supply</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      demand: {
                        label: "Industry Demand",
                        color: "hsl(var(--chart-1))",
                      },
                      supply: {
                        label: "Alumni Supply",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skillGapData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="skill" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="demand" fill="var(--color-demand)" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="supply" fill="var(--color-supply)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <p className="text-2xl font-bold">₹18.5L</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Package</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Top Performers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Career Growth Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <p className="text-2xl font-bold">420</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Mentors</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Alumni Database Tab */}
            <TabsContent value="database" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Verified Alumni Database</CardTitle>
                      <CardDescription>Comprehensive alumni records with blockchain verification</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search by name, ID, company..." className="pl-10" />
                    </div>
                  </div>

                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Alumni ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Salary</TableHead>
                          <TableHead>Blockchain</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alumniDatabase.map((alumni) => (
                          <TableRow key={alumni.id}>
                            <TableCell className="font-medium">{alumni.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={alumni.image} />
                                  <AvatarFallback>{alumni.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <span>{alumni.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{alumni.batch}</TableCell>
                            <TableCell>{alumni.course}</TableCell>
                            <TableCell>{alumni.company}</TableCell>
                            <TableCell>{alumni.position}</TableCell>
                            <TableCell>{alumni.salary}</TableCell>
                            <TableCell>
                              {alumni.blockchain === "verified" ? (
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                  <Shield className="mr-1 h-3 w-3" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-gray-600 dark:text-gray-400">{alumni.lastActive}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing 5 of 2,847 alumni records
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blockchain Verification Tab */}
            <TabsContent value="blockchain" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <CardContent className="p-6">
                    <Shield className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">2,683</h3>
                    <p className="text-green-100">Verified Credentials</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                  <CardContent className="p-6">
                    <Clock className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">164</h3>
                    <p className="text-yellow-100">Pending Verification</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-6">
                    <Activity className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">94.2%</h3>
                    <p className="text-blue-100">Verification Rate</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification System</CardTitle>
                  <CardDescription>Secure, tamper-proof credential verification using blockchain technology</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div className="text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-medium">Secure Verification Process</p>
                        <p className="mt-1">All alumni credentials are verified through our blockchain-based system, ensuring authenticity and preventing fraud.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Verification Process Flow</h4>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">1</span>
                        </div>
                        <h5 className="font-medium">Alumni Submits</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Documents uploaded</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">2</span>
                        </div>
                        <h5 className="font-medium">AI Validation</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Automated check</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">3</span>
                        </div>
                        <h5 className="font-medium">Manual Review</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Staff verification</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">4</span>
                        </div>
                        <h5 className="font-medium">Blockchain Store</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Immutable record</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Recent Verifications</h4>
                    {alumniDatabase.slice(0, 3).map((alumni) => (
                      <div key={alumni.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={alumni.image} />
                            <AvatarFallback>{alumni.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{alumni.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {alumni.id} • {alumni.batch} • {alumni.course}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {alumni.blockchain === "verified" ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified on Blockchain
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Verification Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
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