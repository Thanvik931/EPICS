"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCircle, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  Edit,
  Heart,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  LogOut,
  Link as LinkIcon,
  Code,
  Target,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";

// Mock data for career analytics
const careerProgressData = [
  { year: "2020", salary: 50000, position: "Junior" },
  { year: "2021", salary: 65000, position: "Mid-Level" },
  { year: "2022", salary: 85000, position: "Senior" },
  { year: "2023", salary: 110000, position: "Lead" },
  { year: "2024", salary: 140000, position: "Manager" },
];

const mentorshipData = [
  { month: "Jan", students: 3 },
  { month: "Feb", students: 5 },
  { month: "Mar", students: 4 },
  { month: "Apr", students: 7 },
  { month: "May", students: 6 },
  { month: "Jun", students: 8 },
];

const mentorshipRequests = [
  { id: 1, name: "Priya Sharma", course: "Computer Science", year: "3rd Year", topic: "Career Guidance in AI/ML" },
  { id: 2, name: "Rahul Kumar", course: "Electronics", year: "4th Year", topic: "Interview Preparation" },
  { id: 3, name: "Ananya Singh", course: "Computer Science", year: "2nd Year", topic: "Internship Guidance" },
];

export default function AlumniDashboard() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/login/alumni");
    }
  }, [session, isPending, router]);

  // Fetch complete profile data
  const fetchProfileData = async () => {
    try {
      setLoadingProfile(true);
      const token = localStorage.getItem("bearer_token");
      if (!token) return;

      const response = await fetch("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchProfileData();
    }
  }, [session]);

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

  const handleProfileUpdated = () => {
    fetchProfileData();
    refetch();
  };

  // Show loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no session
  if (!session?.user) {
    return null;
  }

  const user = profileData || session.user;
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
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Alumni
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
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
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Profile</CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <Avatar className="mx-auto h-24 w-24">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <h3 className="mt-4 text-xl font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.currentPosition || "Alumni"}</p>
                      <Badge className="mt-2" variant="secondary">
                        Verified Alumni
                      </Badge>
                      {user.bio && (
                        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 border-t pt-4">
                      {user.graduationYear && (
                        <div className="flex items-center gap-3 text-sm">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <span>Batch of {user.graduationYear}</span>
                        </div>
                      )}
                      {user.currentCompany && (
                        <div className="flex items-center gap-3 text-sm">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span>{user.currentCompany}</span>
                        </div>
                      )}
                      {user.currentPosition && (
                        <div className="flex items-center gap-3 text-sm">
                          <UserCircle className="h-4 w-4 text-gray-400" />
                          <span>{user.currentPosition}</span>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.aadhaarNumber && (
                        <div className="flex items-center gap-3 text-sm">
                          <UserCircle className="h-4 w-4 text-gray-400" />
                          <span>Aadhaar: ****{user.aadhaarNumber.slice(-4)}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {(user.linkedinUrl || user.githubUrl || user.portfolioUrl) && (
                      <div className="space-y-2 border-t pt-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Social Links</p>
                        <div className="flex flex-wrap gap-2">
                          {user.linkedinUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                LinkedIn
                              </a>
                            </Button>
                          )}
                          {user.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={user.githubUrl} target="_blank" rel="noopener noreferrer">
                                GitHub
                              </a>
                            </Button>
                          )}
                          {user.portfolioUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                Portfolio
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="space-y-6 lg:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Students Mentored</p>
                          <p className="text-2xl font-bold">24</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                          <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Donations</p>
                          <p className="text-2xl font-bold">₹50K</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                          <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Recognition</p>
                          <p className="text-2xl font-bold">Gold</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Skills & Expertise */}
                  {user.skills && user.skills.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Skills & Expertise
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Career Goals */}
                  {user.careerGoals && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Career Goals
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">{user.careerGoals}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Projects */}
                  {user.projects && user.projects.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Projects
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {user.projects.map((project: any, index: number) => (
                          <div key={index} className="rounded-lg border p-4">
                            <h4 className="font-semibold">{project.name}</h4>
                            {project.description && (
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                            )}
                            {project.tech && project.tech.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {project.tech.map((tech: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                              >
                                <LinkIcon className="h-3 w-3" />
                                View Project
                              </a>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Achievements */}
                  {user.achievements && user.achievements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Achievements & Awards
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {user.achievements.map((achievement: any, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              </div>
                              <div className="flex-1">
                                <span className="font-medium">{achievement.title}</span>
                                {achievement.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                                )}
                                {achievement.date && (
                                  <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Accepted mentorship request from Priya Sharma</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                          <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Donated ₹5,000 to scholarship fund</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                          <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Earned "Top Mentor" badge</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">3 days ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Mentorship Tab */}
            <TabsContent value="mentorship" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold">95%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mentorship Requests</CardTitle>
                  <CardDescription>Students seeking your guidance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentorshipRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={`https://images.unsplash.com/photo-${1500000000000 + request.id}?w=100&h=100&fit=crop`} />
                            <AvatarFallback>{request.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{request.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.course} • {request.year}
                            </p>
                            <p className="mt-1 text-sm">
                              <span className="font-medium">Topic:</span> {request.topic}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Decline</Button>
                          <Button size="sm">Accept</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mentorship Impact</CardTitle>
                  <CardDescription>Number of students mentored per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      students: {
                        label: "Students",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mentorshipData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="students" fill="var(--color-students)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-6">
                    <DollarSign className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">₹50,000</h3>
                    <p className="text-blue-100">Total Contributions</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <CardContent className="p-6">
                    <Users className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">12</h3>
                    <p className="text-green-100">Students Supported</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="p-6">
                    <Award className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">Gold</h3>
                    <p className="text-purple-100">Donor Status</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Donation</CardTitle>
                    <CardDescription>Support students and institutional development</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <Button variant="outline" className="h-auto flex-col items-start p-4">
                        <span className="font-semibold">Scholarship Fund</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Support deserving students</span>
                      </Button>
                      <Button variant="outline" className="h-auto flex-col items-start p-4">
                        <span className="font-semibold">Infrastructure Development</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Build better facilities</span>
                      </Button>
                      <Button variant="outline" className="h-auto flex-col items-start p-4">
                        <span className="font-semibold">Research Grants</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fund innovative research</span>
                      </Button>
                    </div>
                    <Button className="w-full" size="lg">
                      <Heart className="mr-2 h-4 w-4" />
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>Your recent contributions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Scholarship Fund</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Dec 15, 2024</p>
                        </div>
                        <p className="font-semibold text-green-600 dark:text-green-400">₹5,000</p>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Infrastructure Fund</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Nov 20, 2024</p>
                        </div>
                        <p className="font-semibold text-green-600 dark:text-green-400">₹10,000</p>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Research Grant</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Oct 5, 2024</p>
                        </div>
                        <p className="font-semibold text-green-600 dark:text-green-400">₹15,000</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Career Progress</CardTitle>
                    <CardDescription>Your salary growth over the years</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        salary: {
                          label: "Salary (₹)",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={careerProgressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="salary" stroke="var(--color-salary)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                    <CardDescription>Your platform activity summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Profile Views</span>
                        <span className="font-semibold">245</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[80%] bg-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Mentorship Success</span>
                        <span className="font-semibold">95%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[95%] bg-green-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Network Connections</span>
                        <span className="font-semibold">180</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[70%] bg-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Summary</CardTitle>
                  <CardDescription>Your contribution to the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border p-4 text-center">
                      <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Students Mentored</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <Heart className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                      <p className="text-2xl font-bold">₹50K</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Donated</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <MessageSquare className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                      <p className="text-2xl font-bold">150+</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Messages</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <Award className="mx-auto mb-2 h-8 w-8 text-orange-600 dark:text-orange-400" />
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}