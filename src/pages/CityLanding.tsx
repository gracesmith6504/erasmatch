import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { getCityBySlug } from "@/data/cityLandingData";
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
  const { studentCount, universityCount, universities, loading } =
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-primary-foreground">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgydjRoNHYyaC00djRoLTJ2LTR6bS0yMC0xMmgtMnYtNGgydi00aDJ2NGg0djJoLTR2NGgtMnYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <MapPin className="h-4 w-4" />
              {cityInfo.flag} {cityInfo.country}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4">
              Erasmus in {cityInfo.name}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {cityInfo.tagline}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8"
            >
              <Link to="/auth?mode=signup">
                Join students in {cityInfo.name}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b bg-card">
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

      {/* Universities */}
      {universities.length > 0 && (
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-6 text-foreground">
                Universities in {cityInfo.name}
              </h2>
              <div className="grid gap-3">
                {universities.map((uni) => (
                  <Link
                    key={uni.name}
                    to={`/students?university=${encodeURIComponent(uni.name)}`}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border hover:border-accent/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                      <span className="font-medium text-foreground">
                        {uni.name}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
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

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
            Ready for your Erasmus in {cityInfo.name}?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join ErasMatch to connect with other students heading to{" "}
            {cityInfo.name}. It's free.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8"
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
