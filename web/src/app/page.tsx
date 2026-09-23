import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/homepage/hero";
import { TrustStats } from "@/components/marketing/homepage/trust-stats";
import { HowItWorks } from "@/components/marketing/homepage/how-it-works";
import { FeaturedScholarships } from "@/components/marketing/homepage/featured-scholarships";
import { MatchingPromo } from "@/components/marketing/homepage/matching-promo";
import { AdviserMarketplace } from "@/components/marketing/homepage/adviser-marketplace";
import { CvBuilderPromo } from "@/components/marketing/homepage/cv-builder-promo";
import { ApplicationGuides } from "@/components/marketing/homepage/application-guides";
import { TestimonialsFaq } from "@/components/marketing/homepage/testimonials-faq";
import { FinalCta } from "@/components/marketing/homepage/final-cta";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TrustStats />
      <HowItWorks />
      <FeaturedScholarships defaultTab="closing" />
      <MatchingPromo />
      <AdviserMarketplace />
      <CvBuilderPromo />
      <ApplicationGuides />
      <TestimonialsFaq openFirstFaq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
