import { Hero } from "@/components/home/Hero";
import { HowWeWork } from "@/components/home/HowWeWork";
import { WhyUs } from "@/components/home/WhyUs";
import { Services } from "@/components/home/Services";
import { Prices } from "@/components/home/Prices";
import { Reviews } from "@/components/home/Reviews";
import { Workshop } from "@/components/home/Workshop";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { RequestFormSection } from "@/components/forms/RequestFormSection";
import { getPublishedCases } from "@/lib/portfolio-queries";

// Работы портфолио читаются из БД — без ревалидации новые кейсы из админки
// не появлялись бы на главной без пересборки сайта.
export const revalidate = 60;

// title, description, canonical, Open Graph — из app/(site)/layout.tsx.

export default async function Home() {
  const cases = await getPublishedCases({ take: 6 });

  return (
    <>
      <Hero collage={cases.slice(0, 3)} />
      <PortfolioSection items={cases} label="Работы" title="Примеры работ" />
      <HowWeWork />
      <WhyUs />
      <Services />
      <Prices />
      <Reviews />
      <Workshop />
      <RequestFormSection />
    </>
  );
}
