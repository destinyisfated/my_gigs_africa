import { Hero } from "@/components/Hero";
import { FeaturedGigs } from "@/components/FeaturedGigs";
import { GrowWithUs } from "@/components/GrowWithUs";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedGigs />
      <Testimonials />
      <GrowWithUs />
    </main>
  );
}
