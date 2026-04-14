import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { getCityBySlug, cityLandingData } from "@/data/cityLandingData";
import { useCityLandingData } from "@/hooks/useCityLandingData";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraduationCap, Users, ArrowRight, MapPin } from "lucide-react";

const CityLanding = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const cityInfo = citySlug ? getCityBySlug(citySlug) : undefined;
  const { studentCount, universityCount, universities, avatars, loading } =
    useCityLandingData(cityInfo?.name ?? "");

  useEffect(() => {
    if (cityInfo) {
      document.title = `Erasmus in ${cityInfo.name} 2025 – Meet Students | ErasMatch`;
      const meta = document.querySelector('meta[name="description"]');
      const content = `${cityInfo.description.slice(0, 155)}…`;
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        const tag = document.createElement("meta");
        tag.name = "description";
        tag.content = content;
        document.head.appendChild(tag);
      }
    }
    return () => {
      document.title = "ErasMatch";
    };
  }, [cityInfo]);

  if (!cityInfo) return <Navigate to="/students" replace />;

  const otherCities = cityLandingData.filter((c) => c.slug !== citySlug);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — clean light design */}
      <section className="relative overflow-hidden bg-card border-b">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              {cityInfo.flag} {cityInfo.country}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-3 text-foreground">
              Erasmus in{" "}
              <span className="text-accent">{cityInfo.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {cityInfo.tagline}
            </p>

            {/* Student avatars for FOMO */}
            {avatars.length > 0 && (
              <div className="flex flex-col items-center mb-8">
                <div className="flex items-center justify-center">
                  {avatars.map((url, i) => (
                    <img
                      key={i}
                      src={`${url}?width=72&height=72&resize=cover`}
                      alt=""
                      className="w-9 h-9 rounded-full border-2 border-background object-cover"
                      style={{ marginLeft: i === 0 ? 0 : -8 }}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {studentCount >= 5
                    ? `${studentCount}+ students already joined for ${cityInfo.name}`
                    : "Students are already signing up"}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="text-base px-8 py-6 bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full shadow-elevated"
              >
                <Link to="/auth?mode=signup">
                  Join students in {cityInfo.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-full border-border"
              >
                <Link to="/students">See who's going</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "…" : universityCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {universityCount === 1 ? "University" : "Universities"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading
                    ? "…"
                    : studentCount >= 5
                    ? `${studentCount}+`
                    : "—"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {studentCount >= 5
                    ? "Students heading here"
                    : "Students joining soon"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-4 text-foreground">
            Why {cityInfo.name} for Erasmus?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {cityInfo.description}
          </p>
        </div>
      </section>

      {/* Universities — links to signup, not /students */}
      {universities.length > 0 && (
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-2 text-foreground">
                Universities in {cityInfo.name}
              </h2>
              <p className="text-muted-foreground mb-6">
                Sign up to see students at each university and join their group chats.
              </p>
              <div className="grid gap-3">
                {universities.map((uni) => (
                  <Link
                    key={uni.name}
                    to="/auth?mode=signup"
                    className="flex items-center justify-between p-4 bg-card rounded-lg border hover:border-accent/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                      <span className="font-medium text-foreground">
                        {uni.name}
                      </span>
                    </div>
                    <span className="text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Join <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-6 text-foreground">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {cityInfo.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Other cities — internal linking */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-6 text-foreground">
              Explore other Erasmus destinations
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/erasmus/${city.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-card border rounded-full text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent transition-colors"
                >
                  {city.flag} {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
            Ready for your Erasmus in {cityInfo.name}?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
            Join ErasMatch to connect with other students heading to{" "}
            {cityInfo.name}. It's free.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 py-6 rounded-full"
          >
            <Link to="/auth?mode=signup">
              Join ErasMatch — it's free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CityLanding;
