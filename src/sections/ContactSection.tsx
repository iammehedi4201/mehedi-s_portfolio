"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContactForm } from "@/hooks";
import { createMessageSchema, type CreateMessageInput } from "@/lib/schemas";
import { toast } from "sonner";
import { Send, CheckCircle, Mail, MapPin, Clock, Phone } from "lucide-react";

export default function ContactSection() {
  const { submitForm, isSubmitting, isSuccess } = useContactForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
  });

  const onSubmit = async (data: CreateMessageInput) => {
    await submitForm(data);
    toast.success("Message sent! I'll get back to you soon.");
    reset();
  };

  return (
    <SectionWrapper id="contact" className="bg-deep-dark">
      <SectionHeading
        title="Get In Touch"
        subtitle="Have a project in mind? Let's build something extraordinary together"
      />

      <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        {/* Left — Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="space-y-5">
            {[
              { icon: Mail, label: "Direct Email", value: "iammehedi296@gmail.com", href: "mailto:iammehedi296@gmail.com" },
              { icon: Phone, label: "Phone / WhatsApp", value: "+880-1775777038", href: "tel:+8801775777038" },
              { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh (UTC+6)" },
              { icon: Clock, label: "Response Time", value: "Within 24 hours" },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="text-text-heading hover:text-brand-primary font-medium text-sm sm:text-base transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-text-heading font-medium text-sm sm:text-base">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Solid Information Panel (Zero Gradients) */}
          <div className="hidden lg:block p-6 rounded-2xl bg-surface border border-border-subtle space-y-3">
            <h4 className="font-heading font-semibold text-text-heading text-sm uppercase tracking-wider">
              Project Consultation
            </h4>
            <p className="text-xs text-text-body font-normal leading-relaxed">
              Available for full-stack web applications, TypeScript architecture, and specialized Next.js contract roles. All inquiries receive direct attention from the engineer.
            </p>
          </div>
        </motion.div>

        {/* Right — Form (Solid Surface, Zero Gradients) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3"
        >
          <div className="rounded-2xl border border-border-subtle bg-surface p-7 sm:p-8 shadow-sm">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-color-success/10 border border-color-success/30 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-color-success" />
                </div>
                <h3 className="text-xl font-heading font-semibold tracking-tight text-text-heading">Thank you!</h3>
                <p className="text-text-body font-normal mt-2 text-sm leading-relaxed">
                  Your message has been sent. I&apos;ll get back to you within 24 hours!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-text-heading font-semibold text-xs uppercase tracking-wider">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      className="bg-surface-subtle border-border-subtle focus-visible:ring-brand-primary"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-color-error font-medium">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-text-heading font-semibold text-xs uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      className="bg-surface-subtle border-border-subtle focus-visible:ring-brand-primary"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-color-error font-medium">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-text-heading font-semibold text-xs uppercase tracking-wider">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="New Project Inquiry"
                    className="bg-surface-subtle border-border-subtle focus-visible:ring-brand-primary"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-xs text-color-error font-medium">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body" className="text-text-heading font-semibold text-xs uppercase tracking-wider">
                    Message
                  </Label>
                  <Textarea
                    id="body"
                    placeholder="Tell me about your project goals and scope..."
                    rows={5}
                    className="bg-surface-subtle border-border-subtle focus-visible:ring-brand-primary"
                    {...register("body")}
                  />
                  {errors.body && (
                    <p className="text-xs text-color-error font-medium">{errors.body.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-on-primary border-t-transparent" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

