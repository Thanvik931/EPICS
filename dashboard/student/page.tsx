"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Filter,
  MapPin,
  Briefcase,
  MessageSquare,
  Phone,
  Mail,
  GraduationCap,
  DollarSign,
  BookOpen,
  Calendar,
  Star,
  TrendingUp,
  Award,
  Clock,
  Send,
  User,
  Edit,
  Building,
  Target,
  Code,
  Heart,
  Home,
  ArrowRight,
  CheckCircle2,
  LogOut,
  Link as LinkIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";

// Mock data for alumni directory
const alumniData = [
  {
    id: 1,
    name: "Amit Sharma",
    role: "Senior Software Engineer",
    company: "Google India",
    location: "Bangalore",
    batch: "2018",
    expertise: ["React", "Node.js", "AI/ML"],
    available: true,
    rating: 4.9,
    students: 24,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Data Scientist",
    company: "Microsoft",
    location: "Hyderabad",
    batch: "2017",
    expertise: ["Python", "ML", "Data Analytics"],
    available: true,
    rating: 4.8,
    students: 18,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    role: "Product Manager",
    company: "Amazon",
    location: "Mumbai",
    batch: "2016",
    expertise: ["Product Strategy", "Analytics", "UX"],
    available: false,
    rating: 4.7,
    students: 31,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Full Stack Developer",
    company: "Flipkart",
    location: "Bangalore",
    batch: "2019",
    expertise: ["React", "Django", "AWS"],
    available: true,
    rating: 4.6,
    students: 12,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
];

// Mock mentorship matches
const mentorshipMatches = [
  {
    id: 1,
    mentor: "Amit Sharma",
    matchScore: 95,
    reason: "Expertise in React and AI/ML matches your interests",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    mentor: "Priya Mehta",
    matchScore: 88,
    reason: "Data Science specialization aligns with your career goals",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    mentor: "Sneha Reddy",
    matchScore: 82,
    reason: "Recent graduate with relevant tech stack experience",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
];

// Mock financial aid opportunities
const financialAidData = [
  {
    id: 1,
    title: "Merit Scholarship 2025",
    amount: "₹50,000",
    type: "Merit-based",
    deadline: "Jan 31, 2025",
    status: "Open",
  },
  {
    id: 2,
    title: "Alumni Sponsored Grant",
    amount: "₹75,000",
    type: "Need-based",
    deadline: "Feb 15, 2025",
    status: "Open",
  },
  {
    id: 3,
    title: "Research Fellowship",
    amount: "₹1,00,000",
    type: "Research",
    deadline: "Mar 1, 2025",
    status: "Open",
  },
];

// Mock chat messages
const chatMessages = [
  { id: 1, sender: "Amit Sharma", message: "Hi! I'd be happy to help you with your career questions.", time: "10:30 AM", isOwn: false },
  { id: 2, sender: "You", message: "Thank you! I'm interested in learning about AI/ML career paths.", time: "10:32 AM", isOwn: true },
  { id: 3, sender: "Amit Sharma", message: "Great! AI/ML is a fantastic field. What's your current background?", time: "10:33 AM", isOwn: false },
];

export default function StudentDashboard() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/login/student");
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
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Unilink
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                Student Portal
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-2">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                <Home className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm">
                <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="mentorship" className="text-xs sm:text-sm">
                <Users className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Mentorship</span>
                <span className="sm:hidden">Mentors</span>
              </TabsTrigger>
              <TabsTrigger value="directory" className="text-xs sm:text-sm">
                <GraduationCap className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Alumni</span>
                <span className="sm:hidden">Alumni</span>
              </TabsTrigger>
              <TabsTrigger value="networking" className="text-xs sm:text-sm">
                <MessageSquare className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Network</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="text-xs sm:text-sm">
                <DollarSign className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Financial Aid</span>
                <span className="sm:hidden">Aid</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Welcome Section */}
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:border-blue-900 dark:from-blue-950/30 dark:to-purple-950/30">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-blue-200 dark:border-blue-800">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Welcome back, {user.name}! 👋
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                          {user.university || "Student"} • {user.enrollmentYear ? `${new Date().getFullYear() - user.enrollmentYear + 1}th Year` : "Current Student"}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditDialogOpen(true)} className="w-full sm:w-auto">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("mentorship")}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Mentors</p>
                        <p className="text-xl sm:text-2xl font-bold">3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("directory")}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Alumni Network</p>
                        <p className="text-xl sm:text-2xl font-bold">28</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("networking")}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Messages</p>
                        <p className="text-xl sm:text-2xl font-bold">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("financial")}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Aid Received</p>
                        <p className="text-xl sm:text-2xl font-bold">₹50k</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-purple-200 hover:shadow-lg transition-all dark:border-purple-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Find a Mentor
                    </CardTitle>
                    <CardDescription>Get matched with alumni mentors in your field</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => setActiveTab("mentorship")}>
                      Browse Mentors
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 hover:shadow-lg transition-all dark:border-blue-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Network & Connect
                    </CardTitle>
                    <CardDescription>Chat with alumni and expand your network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" onClick={() => setActiveTab("networking")}>
                      Start Networking
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-200 hover:shadow-lg transition-all dark:border-green-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Apply for Aid
                    </CardTitle>
                    <CardDescription>Explore scholarships and financial grants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" onClick={() => setActiveTab("financial")}>
                      View Opportunities
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Top Mentor Matches */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Mentor Matches</CardTitle>
                      <CardDescription>AI-powered recommendations based on your profile</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("mentorship")}>
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentorshipMatches.slice(0, 2).map((match) => (
                      <div key={match.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={match.image} />
                            <AvatarFallback>{match.mentor.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-semibold">{match.mentor}</h4>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                {match.matchScore}% Match
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {match.reason}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full sm:w-auto">Request Mentorship</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions & Latest Aid */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Sessions
                    </CardTitle>
                    <CardDescription>Your scheduled mentorship meetings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border p-3 sm:p-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">Career Planning Session</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">with Amit Sharma</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Tomorrow, 3:00 PM</p>
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3 sm:p-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">Interview Prep</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">with Priya Mehta</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Jan 25, 5:00 PM</p>
                      </div>
                      <Button size="sm" variant="outline">Details</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Latest Financial Aid
                    </CardTitle>
                    <CardDescription>New opportunities you may qualify for</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {financialAidData.slice(0, 2).map((aid) => (
                      <div key={aid.id} className="flex items-start justify-between gap-3 rounded-lg border p-3 sm:p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-sm sm:text-base">{aid.title}</h4>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">
                              {aid.status}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-green-600 dark:text-green-400">{aid.amount}</span>
                            <span>•</span>
                            <span>{aid.type}</span>
                          </div>
                        </div>
                        <Button size="sm">Apply</Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("financial")}>
                      View All Opportunities
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {/* Profile Header Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="text-2xl sm:text-3xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="w-full">
                          <h2 className="text-2xl sm:text-3xl font-bold">{user.name}</h2>
                          <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                          {user.bio && (
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                              {user.bio}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                            {user.university && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                {user.university}
                              </Badge>
                            )}
                            {user.enrollmentYear && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                Enrolled: {user.enrollmentYear}
                              </Badge>
                            )}
                            {user.registrationNumber && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                Reg No: {user.registrationNumber}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button onClick={() => setIsEditDialogOpen(true)} className="w-full sm:w-auto">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {user.registrationNumber && (
                        <div className="flex items-center justify-between border-b pb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Registration No.</span>
                          <span className="font-medium">{user.registrationNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                        <span className="font-medium truncate ml-2">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center justify-between border-b pb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                          <span className="font-medium">{user.phone}</span>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center justify-between border-b pb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                          <span className="font-medium">{user.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                        <span className="font-medium capitalize">{user.role || "Student"}</span>
                      </div>
                      {user.university && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">University</span>
                          <span className="font-medium text-right">{user.university}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Academic Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {user.enrollmentYear && (
                        <>
                          <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Enrollment Year</span>
                            <span className="font-medium">{user.enrollmentYear}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Current Year</span>
                            <span className="font-medium">{new Date().getFullYear() - user.enrollmentYear + 1}th Year</span>
                          </div>
                        </>
                      )}
                      {(!user.phone || !user.location || !user.bio) && (
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Complete your profile to unlock more features</p>
                          <Button size="sm" variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                            Update Profile
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              {(user.linkedinUrl || user.githubUrl || user.portfolioUrl) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5" />
                      Social Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
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
                  </CardContent>
                </Card>
              )}

              {/* Skills & Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills & Expertise
                  </CardTitle>
                  <CardDescription>Your technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Code className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-3">No skills added yet</p>
                      <Button size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        Add Skills
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interests & Career Goals */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.interests && user.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">No interests added yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Career Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.careerGoals ? (
                      <p className="text-gray-700 dark:text-gray-300">{user.careerGoals}</p>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">No career goals added yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Projects
                  </CardTitle>
                  <CardDescription>Showcase of your work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.projects && user.projects.length > 0 ? (
                    user.projects.map((project: any, index: number) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-3">No projects added yet</p>
                      <Button size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        Add Projects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements & Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.achievements && user.achievements.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8">
                      <Award className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-3">No achievements added yet</p>
                      <Button size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        Add Achievements
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mentorship Matching Tab */}
            <TabsContent value="mentorship" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Mentors</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Attended</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Skills Gained</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Mentor Matches</CardTitle>
                  <CardDescription>These mentors match your interests and career goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentorshipMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={match.image} />
                            <AvatarFallback>{match.mentor.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{match.mentor}</h4>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                {match.matchScore}% Match
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {match.reason}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm">Request Mentorship</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>Your scheduled mentorship meetings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                        <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Career Planning Session</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">with Amit Sharma</p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Tomorrow, 3:00 PM
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Technical Interview Prep</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">with Priya Mehta</p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Jan 25, 5:00 PM
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Details</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Learning Path</CardTitle>
                    <CardDescription>Track your mentorship progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Career Planning</span>
                        <span className="text-gray-600 dark:text-gray-400">75%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[75%] bg-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Technical Skills</span>
                        <span className="text-gray-600 dark:text-gray-400">60%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[60%] bg-purple-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Interview Preparation</span>
                        <span className="text-gray-600 dark:text-gray-400">40%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[40%] bg-green-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Soft Skills</span>
                        <span className="text-gray-600 dark:text-gray-400">85%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div className="h-full w-[85%] bg-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Alumni Directory Tab */}
            <TabsContent value="directory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alumni Directory</CardTitle>
                  <CardDescription>Connect with verified alumni from your institution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, company, or expertise..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="microsoft">Microsoft</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="flipkart">Flipkart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alumni Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {alumniData.map((alumni) => (
                      <div key={alumni.id} className="rounded-lg border p-4 transition-all hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={alumni.image} />
                            <AvatarFallback>{alumni.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{alumni.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{alumni.role}</p>
                              </div>
                              {alumni.available ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Busy</Badge>
                              )}
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-3 w-3" />
                                {alumni.company}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {alumni.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-3 w-3" />
                                Batch of {alumni.batch}
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {alumni.rating} • {alumni.students} students mentored
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {alumni.expertise.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" className="flex-1">
                                <MessageSquare className="mr-2 h-3 w-3" />
                                Connect
                              </Button>
                              <Button size="sm" variant="outline">View Profile</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Networking/Chat Tab */}
            <TabsContent value="networking" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Connections List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Your Connections</CardTitle>
                    <CardDescription>Active conversations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium">Amit Sharma</h4>
                        <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                          Great! AI/ML is a fantastic...
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-600 text-white">2</Badge>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                        <AvatarFallback>PM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium">Priya Mehta</h4>
                        <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                          Let me know if you need help...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" />
                        <AvatarFallback>SR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium">Sneha Reddy</h4>
                        <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                          The project looks interesting!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="lg:col-span-2">
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">Amit Sharma</CardTitle>
                        <CardDescription className="text-xs">Senior Software Engineer at Google</CardDescription>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Messages */}
                    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] rounded-lg p-3 ${
                            msg.isOwn 
                              ? "bg-blue-600 text-white" 
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}>
                            {!msg.isOwn && <p className="text-xs font-medium mb-1">{msg.sender}</p>}
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Networking Stats */}
              <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connections</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Messages</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Meetings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="mx-auto mb-2 h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Referrals</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financial Aid Tab */}
            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <CardContent className="p-6">
                    <DollarSign className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">₹2,25,000</h3>
                    <p className="text-green-100">Total Aid Available</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-6">
                    <BookOpen className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">6</h3>
                    <p className="text-blue-100">Opportunities Matched</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="p-6">
                    <Award className="mb-4 h-10 w-10" />
                    <h3 className="text-2xl font-bold">₹50,000</h3>
                    <p className="text-purple-100">Aid Received</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Available Financial Aid</CardTitle>
                  <CardDescription>Scholarships and grants you may qualify for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialAidData.map((aid) => (
                      <div key={aid.id} className="flex items-start justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{aid.title}</h4>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                              {aid.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {aid.amount}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {aid.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Deadline: {aid.deadline}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Details</Button>
                          <Button size="sm">Apply Now</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Tips</CardTitle>
                    <CardDescription>Increase your chances of success</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Complete Your Profile</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ensure all academic and personal details are up to date
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Submit Early</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Don't wait until the deadline - apply as soon as possible
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Provide Documentation</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Have all required documents ready before starting
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Applications</CardTitle>
                    <CardDescription>Track your submitted applications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">Merit Scholarship 2024</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Submitted: Dec 15, 2024</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                        Approved
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">Research Fellowship</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Submitted: Jan 5, 2025</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
                        Under Review
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
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