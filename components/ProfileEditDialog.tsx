"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, X, Award, Briefcase, Code, Heart, Target, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onProfileUpdated: () => void;
}

export function ProfileEditDialog({ open, onOpenChange, user, onProfileUpdated }: ProfileEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    careerGoals: "",
    skills: [] as string[],
    interests: [] as string[],
    achievements: [] as Array<{ title: string; description?: string; date?: string }>,
    projects: [] as Array<{ name: string; description?: string; tech?: string[]; url?: string }>,
  });

  // Input states for adding new items
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newAchievement, setNewAchievement] = useState({ title: "", description: "", date: "" });
  const [newProject, setNewProject] = useState({ name: "", description: "", tech: "", url: "" });

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
        careerGoals: user.careerGoals || "",
        skills: user.skills || [],
        interests: user.interests || [],
        achievements: user.achievements || [],
        projects: user.projects || [],
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("bearer_token");
      if (!token) {
        toast.error("You must be logged in to update your profile");
        return;
      }

      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      onProfileUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.title.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, {
          title: newAchievement.title.trim(),
          description: newAchievement.description.trim(),
          date: newAchievement.date
        }]
      }));
      setNewAchievement({ title: "", description: "", date: "" });
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, {
          name: newProject.name.trim(),
          description: newProject.description.trim(),
          tech: newProject.tech.split(",").map(t => t.trim()).filter(Boolean),
          url: newProject.url.trim()
        }]
      }));
      setNewProject({ name: "", description: "", tech: "", url: "" });
    }
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information, achievements, and more
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="careerGoals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Career Goals
                </Label>
                <Textarea
                  id="careerGoals"
                  value={formData.careerGoals}
                  onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                  placeholder="Describe your career aspirations..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Social Links
                </Label>
                
                <div className="space-y-2">
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="LinkedIn URL"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="GitHub URL"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="Portfolio URL"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Skills & Interests Tab */}
            <TabsContent value="skills" className="space-y-6">
              {/* Skills */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Skills
                </Label>
                
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:bg-gray-300 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Interests
                </Label>
                
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                  />
                  <Button type="button" onClick={addInterest} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="ml-1 hover:bg-gray-300 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Add Achievement
                </Label>
                
                <div className="space-y-2 rounded-lg border p-4">
                  <Input
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    placeholder="Achievement title"
                  />
                  <Textarea
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                    placeholder="Description (optional)"
                    rows={2}
                  />
                  <Input
                    type="date"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                  />
                  <Button type="button" onClick={addAchievement} size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Achievement
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          {achievement.description && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {achievement.description}
                            </p>
                          )}
                          {achievement.date && (
                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Add Project
                </Label>
                
                <div className="space-y-2 rounded-lg border p-4">
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Project name"
                  />
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Project description"
                    rows={2}
                  />
                  <Input
                    value={newProject.tech}
                    onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                    placeholder="Technologies (comma separated)"
                  />
                  <Input
                    value={newProject.url}
                    onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                    placeholder="Project URL (optional)"
                  />
                  <Button type="button" onClick={addProject} size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{project.name}</h4>
                          {project.description && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {project.description}
                            </p>
                          )}
                          {project.tech && project.tech.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {project.tech.map((tech, i) => (
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
                              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                            >
                              <LinkIcon className="h-3 w-3" />
                              View Project
                            </a>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
