"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Truck,
  Sparkles,
  CreditCard,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  category: string;
  icon: any;
  items: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    category: "Ordering & Customization",
    icon: Sparkles,
    items: [
      {
        question: "How do I personalize a product?",
        answer:
          "You can personalize an item directly from its product page or via our Customization Studio. Enter the recipient's name, craft your personal message, pick your preferred colour schemes, choose clothing sizes or phone models, and even upload reference artwork. We confirm all spelling before production begins.",
      },
      {
        question: "Can I review the design before it is produced?",
        answer:
          "Yes. Our artisan team inspects all customization requests. For complex orders, corporate logos, or custom photo prints, we can send a digital mock-up preview via WhatsApp or email for your confirmation.",
      },
      {
        question: "Can I place a bulk corporate order?",
        answer:
          "Absolutely. We supply branded merchandise, onboarding hampers, and event celebration packages for businesses across Nigeria. Contact us via our Contact Us page or WhatsApp for corporate tier pricing.",
      },
    ],
  },
  {
    category: "Delivery & Tracking",
    icon: Truck,
    items: [
      {
        question: "Do you deliver across all states in Nigeria?",
        answer:
          "Yes! We deliver across Ile-Ife, Akure, and all 36 states and the Federal Capital Territory (Abuja). Orders within Ile-Ife & Akure typically arrive within 1-2 business days, while deliveries to other states take 2-4 business days depending on transit routes.",
      },
      {
        question: "How does Free Delivery work?",
        answer:
          "All orders with a subtotal of ₦50,000 or higher automatically qualify for Free Doorstep Delivery nationwide. No discount code is needed; the discount calculates automatically in your cart.",
      },
      {
        question: "How do I track my dispatched order?",
        answer:
          "As soon as your package is dispatched, we send you an SMS/email with your delivery courier details and order reference. You can also visit our Track Order page at any time to check real-time progress.",
      },
    ],
  },
  {
    category: "Payments & Security",
    icon: CreditCard,
    items: [
      {
        question: "What payment methods are supported?",
        answer:
          "We process payments securely via Paystack. You can pay using Nigerian debit cards (Mastercard, Visa, Verve), direct bank transfer, or USSD. We also accept corporate direct invoices for bulk orders.",
      },
      {
        question: "Is my online payment information secure?",
        answer:
          "Yes, completely. All online transactions are processed through Paystack's PCI-DSS Level 1 certified gateway with 256-bit SSL encryption. OLUDAX Concept never stores or accesses your raw card or bank credentials.",
      },
    ],
  },
  {
    category: "Returns, Replacements & Refunds",
    icon: RotateCcw,
    items: [
      {
        question: "What is your return policy for personalized gifts?",
        answer:
          "Because customized items are bespoke creations crafted with your unique name or photo, they cannot be restocked or refunded once produced. However, if there is a spelling mistake caused by our team or if an item arrives damaged in transit, we will immediately produce and dispatch a replacement at zero cost to you.",
      },
      {
        question: "What should I do if an item arrives damaged?",
        answer:
          "Please notify us via WhatsApp or email within 24 hours of delivery with a clear photograph of the damaged product and packaging. We will prioritize an expedited replacement.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true,
  });

  const toggleItem = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-12">
        {/* Header Glass Banner */}
        <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cloud/40 mb-3">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30" />
            <span className="text-accent font-semibold">FAQs</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider mb-2 border border-accent/25">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
              Frequently Asked Questions
            </h1>
            <p className="text-cloud/50 text-xs sm:text-sm mt-1 leading-relaxed">
              Find instant answers regarding our custom gifting process, nationwide shipping, payments, and return guarantees.
            </p>
          </div>
        </div>

        {/* FAQs list */}
        <div className="space-y-10">
          {faqData.map((section, catIdx) => {
            const Icon = section.icon;
            return (
              <div key={section.category} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                  <Icon className="w-4 h-4 text-accent" />
                  <h2 className="font-display font-medium text-base sm:text-lg text-cloud">
                    {section.category}
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {section.items.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = !!openItems[key];

                    return (
                      <div
                        key={item.question}
                        className="glass rounded-2xl overflow-hidden border border-black/8 dark:border-[rgba(244,244,242,0.08)] transition-all"
                      >
                        <button
                          onClick={() => toggleItem(catIdx, itemIdx)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-medium text-xs sm:text-sm text-cloud hover:text-accent transition-colors cursor-pointer"
                        >
                          <span>{item.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-cloud/40 transition-transform duration-200 shrink-0 ${
                              isOpen ? "rotate-180 text-accent" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 sm:px-5 pb-5 text-xs text-cloud/60 leading-relaxed border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] pt-3">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Banner */}
        <div className="glass rounded-[24px] p-8 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-3">
          <h3 className="font-display font-medium text-xl text-cloud">
            Still Have Questions?
          </h3>
          <p className="text-xs text-cloud/50 max-w-sm mx-auto leading-relaxed">
            Our artisan concierge is available on WhatsApp and email to assist with special gift combinations or express orders.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="btn-primary text-xs py-3 px-8 font-mono uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>Contact Concierge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
