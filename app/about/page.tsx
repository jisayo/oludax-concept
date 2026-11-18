import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "About Us | OLUDAX CONCEPT",
  description:
    "Learn about OLUDAX CONCEPT, our approach to thoughtful gifting, artisanal personalization, and our commitment to making every celebration memorable.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-12">
        {/* Header Glass Banner */}
        <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cloud/40 mb-3">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30" />
            <span className="text-accent font-semibold">About Us</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider mb-2 border border-accent/25">
              <Sparkles className="w-3.5 h-3.5" />
              <span>More Than a Gift... It&apos;s a Feeling</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
              Gifting Reimagined with Heart, Craft & Elegance
            </h1>
            <p className="text-cloud/50 text-xs sm:text-sm mt-2 leading-relaxed">
              At OLUDAX CONCEPT, we believe a truly meaningful gift does not just mark a date on the calendar; it communicates love, celebrates personal milestones, and creates memories that last a lifetime.
            </p>
          </div>
        </div>

        {/* Purpose Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent font-semibold">
              Our Purpose
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-cloud tracking-tight">
              What Oludax Concept Stands For
            </h2>
            <p className="text-sm leading-relaxed text-cloud/60">
              OLUDAX CONCEPT is a premier Nigerian gifting brand and bespoke customization studio based in Lagos. We specialize in thoughtfully curated gift hampers, personalized merchandise, fresh floral arrangements, and celebration packages.
            </p>
            <p className="text-sm leading-relaxed text-cloud/60">
              Whether you are preparing a romantic anniversary package, celebrating a milestone birthday, welcoming a newborn, or expressing gratitude to corporate clients, we provide the creativity and attention to detail that elevates every present into an unforgettable experience.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="glass rounded-2xl p-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <span className="font-display text-xl font-medium text-accent block mb-1">
                  100%
                </span>
                <span className="font-mono text-xs text-cloud/60">
                  Tailored Personalization
                </span>
              </div>
              <div className="glass rounded-2xl p-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <span className="font-display text-xl font-medium text-accent block mb-1">
                  Nationwide
                </span>
                <span className="font-mono text-xs text-cloud/60">
                  Reliable Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="glass rounded-[28px] p-10 flex items-center justify-center text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
            <div>
              <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                OC
              </div>
              <h3 className="font-display text-2xl font-medium text-cloud">
                Oludax Concept
              </h3>
              <p className="font-mono text-xs uppercase tracking-widest text-accent mt-1">
                Gift · Customize · Celebrate
              </p>
            </div>
          </div>
        </section>

        {/* 3 Step Craft Section */}
        <section className="glass rounded-[28px] p-8 sm:p-12 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent font-semibold">
              Our Craft
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-cloud tracking-tight">
              Our Approach to Bespoke Personalization
            </h2>
            <p className="text-xs sm:text-sm text-cloud/50">
              Every celebration is unique, and we treat every customized order as a personalized work of art.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 space-y-3 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <span className="font-mono text-xs text-accent font-semibold">01</span>
              <h3 className="font-display text-lg font-medium text-cloud">
                Thoughtful Selection
              </h3>
              <p className="text-xs leading-relaxed text-cloud/50">
                We hand-select quality ceramic goods, breathable apparel, durable accessories, and fresh botanical stems that delight upon unboxing.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <span className="font-mono text-xs text-accent font-semibold">02</span>
              <h3 className="font-display text-lg font-medium text-cloud">
                Artisan Customization
              </h3>
              <p className="text-xs leading-relaxed text-cloud/50">
                From precision engraving and heat-pressed mugs to bespoke ribbon tags and greeting card typography, your words take center stage.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <span className="font-mono text-xs text-accent font-semibold">03</span>
              <h3 className="font-display text-lg font-medium text-cloud">
                Pristine Presentation
              </h3>
              <p className="text-xs leading-relaxed text-cloud/50">
                Every order is enclosed in luxury packaging with satin ribbons, wax seals, and protective cushioning ready for instant presentation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="glass rounded-[28px] p-8 sm:p-12 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-cloud tracking-tight">
            Ready to Celebrate Someone Special?
          </h2>
          <p className="text-xs sm:text-sm text-cloud/50 max-w-md mx-auto">
            Explore our curated gift catalogue or step into the Customization Studio to design your one-of-a-kind creation.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link href="/shop" className="btn-primary py-3 px-8 font-mono text-xs uppercase tracking-wider">
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link href="/customize" className="btn-outline py-3 px-8 font-mono text-xs uppercase tracking-wider">
              <span>Customize a Gift</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
