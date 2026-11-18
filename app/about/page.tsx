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
              <span>Your Number One Gift Plug • Est. 2022</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
              Turning Special Moments Into Beautiful Keepsakes
            </h1>
            <p className="text-cloud/60 text-xs sm:text-sm mt-2 leading-relaxed">
              Founded in 2022, Oludax Concept was born from a passion for creativity and the desire to bring beautiful ideas to life. Over the years, we&apos;ve continued to grow, creating thoughtful pieces and adding a special touch to every idea and occasion.
            </p>
          </div>
        </div>

        {/* What is Oludax Concept Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent font-semibold">
              Our Story
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-cloud tracking-tight">
              What is Oludax Concept?
            </h2>
            <p className="text-sm leading-relaxed text-cloud/70">
              Founded in 2022, <strong>Oludax Concept</strong> was born from a passion for creativity and the desire to bring beautiful ideas to life. Over the years, we’ve continued to grow, creating thoughtful pieces and adding a special touch to every idea and occasion.
            </p>
            <p className="text-sm leading-relaxed text-cloud/70">
              Today, Oludax Concept offers beautiful frames, personalised gifts, customised items, business branding, printing, and souvenirs. Whether you’re celebrating a special moment, gifting someone you love, or bringing your business ideas to life, we’re here to make it happen.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="glass rounded-2xl p-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)] text-center">
                <span className="font-display text-xl font-medium text-accent block mb-1">
                  2022
                </span>
                <span className="font-mono text-[11px] text-cloud/60">
                  Founded
                </span>
              </div>
              <div className="glass rounded-2xl p-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)] text-center">
                <span className="font-display text-xl font-medium text-accent block mb-1">
                  100%
                </span>
                <span className="font-mono text-[11px] text-cloud/60">
                  Custom Craft
                </span>
              </div>
              <div className="glass rounded-2xl p-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)] text-center">
                <span className="font-display text-xl font-medium text-accent block mb-1">
                  36 States
                </span>
                <span className="font-mono text-[11px] text-cloud/60">
                  Nationwide
                </span>
              </div>
            </div>
          </div>

          {/* Visual Badge Card */}
          <div className="glass rounded-[28px] p-8 sm:p-10 flex flex-col items-center justify-center text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)] relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              OC
            </div>
            <h3 className="font-display text-2xl font-medium text-cloud">
              Oludax Concept
            </h3>
            <p className="font-mono text-xs uppercase tracking-widest text-accent mt-1">
              &ldquo;Your Number One Gift Plug&rdquo;
            </p>
            <p className="text-xs text-cloud/50 mt-3 max-w-xs leading-relaxed">
              Bespoke Frames • Merchandise Branding • Luxury Printing • Souvenirs
            </p>
          </div>
        </section>

        {/* The CEO Story Section */}
        <section className="glass rounded-[28px] p-8 sm:p-12 border border-black/8 dark:border-[rgba(244,244,242,0.08)] relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent font-semibold">
              The CEO & Creative Mind
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-cloud tracking-tight">
              Who is Oludax? Meet Precious Oluwatofunmi
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-cloud/70">
              Meet <strong>Precious Oluwatofunmi</strong>, the student entrepreneur and creative mind behind Oludax Concept.
            </p>
            <p className="text-sm leading-relaxed text-cloud/70">
              With a love for creativity and an eye for beautiful things, Precious is passionate about creating pieces that feel personal, thoughtful, and special. Through Oludax Concept, she brings ideas to life through frames, customised gifts, branding, printing, and more.
            </p>
            <p className="text-sm leading-relaxed text-cloud/70">
              As she continues to balance school and entrepreneurship, Precious is steadily building a brand that reflects her creativity, passion, and vision.
            </p>
          </div>
        </section>

        {/* 3 Pillars of Services */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent font-semibold">
              Our Services
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-cloud tracking-tight">
              What We Create For You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 space-y-3 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <span className="font-mono text-xs text-accent font-semibold">FRAME</span>
              <h3 className="font-display text-lg font-medium text-cloud">
                Turning Moments Into Keepsakes
              </h3>
              <p className="text-xs leading-relaxed text-cloud/60">
                Borderless frames, Border frames, Crystal Acrylic floating frames, Polaroid aesthetic frames, Pinterest boards, and Personalized wall photo collages.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <span className="font-mono text-xs text-accent font-semibold">BRAND</span>
              <h3 className="font-display text-lg font-medium text-cloud">
                Giving Your Business A Standout Look
              </h3>
              <p className="text-xs leading-relaxed text-cloud/60">
                Customized mugs & thermal bottles, journals & engraved pens, customized T-shirts & face caps, tote bags, silk hair bonnets, branded nylons, and souvenirs.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <span className="font-mono text-xs text-accent font-semibold">PRINT</span>
              <h3 className="font-display text-lg font-medium text-cloud">
                Bringing Ideas To Life Through Print
              </h3>
              <p className="text-xs leading-relaxed text-cloud/60">
                Magazines & booklets, business flyers & posters, event invitations & programmes, thank you cards, greeting cards, and certificates.
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
