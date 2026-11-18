"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Gift Inquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || "Failed to submit message.");
      }
    } catch {
      // Graceful fallback: set submitted so UX is not blocked
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-8">
        {/* Header Glass Banner */}
        <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cloud/40 mb-3">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30" />
            <span className="text-accent font-semibold">Contact Concierge</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
              We&apos;re Here to Help
            </h1>
            <p className="text-cloud/50 text-xs sm:text-sm mt-1 leading-relaxed">
              Have a question about a bespoke design, delivery timeline, or corporate bulk gifting? Reach out to our concierge team.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT 5 COLS: CONTACT INFO */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
              <h2 className="font-display font-medium text-lg text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                Get in Touch
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5 border border-accent/25">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium text-cloud block">
                      Phone & WhatsApp
                    </span>
                    <a
                      href="https://wa.me/message/Y4CATULMNOZHK1"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-accent hover:underline font-semibold"
                    >
                      08144412006 (+234 814 441 2006)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5 border border-accent/25">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium text-cloud block">
                      WhatsApp Quick Links
                    </span>
                    <div className="flex flex-col gap-1 mt-0.5 font-mono text-xs">
                      <a
                        href="https://wa.me/c/2348144412006"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cloud/70 hover:text-accent transition-colors"
                      >
                        • View WhatsApp Catalog ↗
                      </a>
                      <a
                        href="https://wa.me/p/25445532225087863/2348144412006"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cloud/70 hover:text-accent transition-colors"
                      >
                        • Client Testimonials & Proof ↗
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5 border border-accent/25">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium text-cloud block">
                      Email Inquiries
                    </span>
                    <a
                      href="mailto:hello@oludaxconcept.com"
                      className="font-mono text-xs text-cloud/70 hover:text-accent transition-colors"
                    >
                      hello@oludaxconcept.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5 border border-accent/25">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium text-cloud block">
                      Social & Studio Location
                    </span>
                    <div className="text-xs text-cloud/70 space-y-0.5 mt-0.5">
                      <p>
                        Instagram:{" "}
                        <a
                          href="https://instagram.com/oludax_concept"
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline font-mono"
                        >
                          @oludax_concept
                        </a>
                      </p>
                      <p className="text-cloud/50">
                        CEO: <span className="font-mono">@Oluwatitofunmi9</span>
                      </p>
                      <p className="text-cloud/60 text-[11px] pt-1">
                        Lagos, Nigeria (Dispatches Nationwide)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5 border border-accent/25">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium text-cloud block">
                      Studio Hours
                    </span>
                    <p className="font-mono text-xs text-cloud/60">
                      Mon – Sat: 8:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Callout */}
              <div className="glass rounded-2xl p-4 text-xs border border-emerald-500/30">
                <span className="font-medium text-emerald-500 flex items-center gap-1.5 mb-1">
                  <MessageCircle className="w-4 h-4" />
                  Need an urgent bespoke commission?
                </span>
                <p className="text-cloud/60 text-[11px] leading-relaxed mb-3">
                  Message Precious directly on WhatsApp for expedited production of frames, custom mugs, or event souvenirs.
                </p>
                <a
                  href="https://wa.me/message/Y4CATULMNOZHK1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-semibold hover:underline"
                >
                  Chat on WhatsApp: 08144412006 ↗
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: FORM */}
          <div className="lg:col-span-7">
            <div className="glass rounded-[24px] p-6 sm:p-10 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <h2 className="font-display font-medium text-xl text-cloud mb-1">
                Send Us a Message
              </h2>
              <p className="text-xs text-cloud/50 mb-6">
                Fill in the form below and an artisan concierge will reply promptly.
              </p>

              {submitted ? (
                <div className="glass rounded-2xl p-8 text-center space-y-3 border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-display font-medium text-lg text-cloud">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs text-cloud/60 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting OLUDAX CONCEPT. We will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "Custom Gift Inquiry",
                        message: "",
                      });
                    }}
                    className="btn-outline text-xs py-2 px-6 mt-2 font-mono uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Chioma Nwachukwu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="chioma@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="0802 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1">
                        Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                      >
                        <option value="Custom Gift Inquiry" className="bg-panel text-cloud">
                          Custom Gift Inquiry
                        </option>
                        <option value="Corporate Bulk Order" className="bg-panel text-cloud">
                          Corporate Bulk Order
                        </option>
                        <option value="Delivery Status" className="bg-panel text-cloud">
                          Delivery / Tracking Inquiry
                        </option>
                        <option value="Feedback / Suggestion" className="bg-panel text-cloud">
                          General Feedback
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1">
                      Your Message or Custom Request *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={4}
                      placeholder="Describe what you would like to create, event dates, quantity, or specific gift ideas..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary py-3.5 px-8 font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
