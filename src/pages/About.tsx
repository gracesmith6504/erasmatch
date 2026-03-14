import { Link } from "react-router-dom";
import { Users, MessageSquare, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6 text-foreground">
            About <span className="text-erasmatch-blue">Eras</span><span className="text-erasmatch-green">Match</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're connecting Erasmus students worldwide to create meaningful friendships 
            and support networks that make studying abroad an unforgettable experience.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Starting a new chapter in a foreign country shouldn't feel lonely. 
              ErasMatch helps Erasmus students find their tribe before they even arrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-border hover:shadow-card transition-all">
              <CardHeader>
                <Users className="w-12 h-12 text-erasmatch-blue mx-auto mb-4" />
                <CardTitle className="text-lg font-display">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find students heading to your destination city and build connections before you travel.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-card transition-all">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-erasmatch-green mx-auto mb-4" />
                <CardTitle className="text-lg font-display">Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join city-specific group chats to share tips, plan meetups, and ask questions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-card transition-all">
              <CardHeader>
                <Globe className="w-12 h-12 text-erasmatch-purple mx-auto mb-4" />
                <CardTitle className="text-lg font-display">Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover your new city together with fellow students who share your interests.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-card transition-all">
              <CardHeader>
                <Heart className="w-12 h-12 text-erasmatch-coral mx-auto mb-4" />
                <CardTitle className="text-lg font-display">Thrive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build lasting friendships and create memories that will last a lifetime.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Story</h2>
          </div>
          
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              ErasMatch was born from the understanding that studying abroad is one of life's most 
              transformative experiences, but it can also be one of the most challenging.
            </p>
            <p className="text-lg leading-relaxed">
              We believe that every Erasmus student deserves to feel welcomed, supported, and 
              connected from day one. That's why we created a platform where students can find 
              their community before they even pack their bags.
            </p>
            <p className="text-lg leading-relaxed">
              Today, hundreds of Erasmus students use ErasMatch to discover friendships, 
              share experiences, and make their exchange dreams come true.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Who's Behind ErasMatch?</h2>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
              Get to know the creator and the mission behind the platform.
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground mt-12">
            <p className="text-lg leading-relaxed">
              Hi! I'm Grace Smith, a student and developer passionate about creating tools that make life easier for other students. 
              I built ErasMatch to solve real problems I noticed in the Erasmus process and I'm continuing to develop new features based on your feedback.
            </p>
            <p className="text-lg leading-relaxed">
              📩 <a href="mailto:erasmatchbusiness@gmail.com" className="text-erasmatch-green underline hover:text-erasmatch-green/80 transition-colors">erasmatchbusiness@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-background mb-6">
            Ready to Start Your Erasmus Journey?
          </h2>
          <p className="text-xl text-background/70 mb-8 max-w-2xl mx-auto">
            Join students who have found their perfect study abroad community through ErasMatch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 shadow-elevated">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;