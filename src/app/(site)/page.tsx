import { Hero } from "@/components/site/hero";
import { ParticipantCounterSection } from "@/components/site/participant-counter-section";
import { CountriesSection } from "@/components/site/countries-section";
import { AboutEventSection } from "@/components/site/about-event-section";
import { CebuFeatureSection } from "@/components/site/cebu-feature-section";
import { HighlightsSection } from "@/components/site/highlights-section";
import { RegistrationCtaSection } from "@/components/site/registration-cta-section";
import { getPublicCountryStats, getPublicSummary } from "@/lib/stats";

export const revalidate = 30;

export default async function HomePage() {
  const [summary, countries] = await Promise.all([getPublicSummary(), getPublicCountryStats()]);

  return (
    <>
      <Hero />
      <ParticipantCounterSection totalConfirmed={summary.totalConfirmed} countryCount={summary.countryCount} />
      <CountriesSection countries={countries} />
      <AboutEventSection />
      <CebuFeatureSection />
      <HighlightsSection />
      <RegistrationCtaSection />
    </>
  );
}
