
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUniversityDetails } from "@/hooks/useUniversityDetails";
import { 
  School, 
  MapPin, 
  Info, 
  Lightbulb, 
  Home, 
  BookOpen,
  Users, 
  Link as LinkIcon,
  MessageSquare
} from "lucide-react";

const UniversityHub = () => {
  const { id } = useParams<{ id: string }>();
  const { university, students, loading, error } = useUniversityDetails(id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-60 bg-gray-200 rounded"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-red-100">
          <h2 className="text-xl font-medium text-red-600 mb-2">Error loading university details</h2>
          <p className="text-gray-600 mb-4">{error || "University not found"}</p>
          <Link to="/universities">
            <Button className="button-hover bg-gradient-to-r from-red-500 to-orange-500 text-white">
              Back to Universities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate a deterministic background gradient based on the university name
  const getBackgroundGradient = (name: string) => {
    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const h1 = Math.abs(hash % 360);
    const h2 = (h1 + 40) % 360;
    
    return `linear-gradient(135deg, hsl(${h1}, 80%, 40%) 0%, hsl(${h2}, 80%, 50%) 100%)`;
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* University Header */}
      <div 
        className="relative rounded-xl overflow-hidden mb-8 text-white p-8 bg-cover bg-center"
        style={{ background: getBackgroundGradient(university.name) }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/universities" className="text-white/80 hover:text-white transition-colors">
              ← Back to Universities
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">{university.name}</h1>
          <div className="flex items-center text-white/90">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{university.city || "City not specified"}{university.country ? `, ${university.country}` : ""}</span>
          </div>
        </div>
      </div>

      {/* University Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Info className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" /> Erasmus Tips
              </TabsTrigger>
              <TabsTrigger value="accommodation" className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Accommodation
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> Popular Courses
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">University Overview</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {university.overview || "No overview information available yet."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Erasmus Tips</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {university.erasmus_tips || "No tips available yet."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="accommodation" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Accommodation Information</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {university.accommodation_info || "No accommodation information available yet."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Popular Courses</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {university.popular_courses || "No course information available yet."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Students Section */}
          <div id="students-section">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <Users className="h-5 w-5 mr-2 text-erasmatch-blue" />
              Students Going to This University
            </h2>
            
            {students.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600 mb-6">Be the first to update your profile with this university!</p>
                <Link to="/profile">
                  <Button className="button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white">
                    Update Your Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                          <AvatarImage src={student.avatar_url || undefined} />
                          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-purple-100 text-erasmatch-blue">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-grow text-center sm:text-left">
                          <h4 className="font-semibold text-gray-900">{student.name || "Name not specified"}</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex items-center justify-center sm:justify-start text-gray-600">
                              <School className="h-4 w-4 mr-2 text-erasmatch-blue opacity-70" />
                              <span>{student.university || "University not specified"}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-erasmatch-green opacity-70" />
                              <span>{student.city || "City not specified"}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 sm:self-center">
                          <Link to={`/profile/${student.id}`}>
                            <Button variant="outline" size="sm" className="button-hover">
                              View Profile
                            </Button>
                          </Link>
                          <Link to={`/messages?user=${student.id}`}>
                            <Button size="sm" className="button-hover bg-erasmatch-blue text-white">
                              <MessageSquare className="mr-1 h-4 w-4" /> Message
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Quick Info</h3>
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Students on ErasMatch:</span>
                  <Badge variant="outline" className="bg-blue-50 text-erasmatch-blue">
                    {students.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{university.city || "N/A"}{university.country ? `, ${university.country}` : ""}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Useful Links */}
          {university.links && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center text-gray-800">
                  <LinkIcon className="h-4 w-4 mr-2" /> Useful Links
                </h3>
                <Separator />
                <div className="space-y-3">
                  {university.links.housing && (
                    <a 
                      href={university.links.housing} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex justify-between items-center text-sm hover:underline text-erasmatch-blue"
                    >
                      <span className="flex items-center">
                        <Home className="h-4 w-4 mr-2 opacity-80" /> Student Housing
                      </span>
                      <span>→</span>
                    </a>
                  )}
                  
                  {university.links.transport && (
                    <a 
                      href={university.links.transport} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex justify-between items-center text-sm hover:underline text-erasmatch-blue"
                    >
                      <span className="flex items-center">
                        <LinkIcon className="h-4 w-4 mr-2 opacity-80" /> Public Transport
                      </span>
                      <span>→</span>
                    </a>
                  )}
                  
                  {university.links.student_groups && (
                    <a 
                      href={university.links.student_groups} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex justify-between items-center text-sm hover:underline text-erasmatch-blue"
                    >
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-2 opacity-80" /> Student Groups
                      </span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Connect with Students */}
          <Card className="bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Connect with Students</h3>
              <p className="text-sm text-white/90 mb-4">
                Join the ErasMatch community to connect with students at this university.
              </p>
              <Link to="/students">
                <Button className="w-full bg-white text-erasmatch-blue hover:bg-gray-100">
                  Find Students
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating action button for mobile - visible only on small screens */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <a href="#students-section">
          <Button className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-erasmatch-blue hover:bg-erasmatch-purple transition-colors">
            <Users className="h-6 w-6" />
          </Button>
        </a>
      </div>
    </div>
  );
};

export default UniversityHub;
