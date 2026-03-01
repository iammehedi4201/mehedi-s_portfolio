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
import { Send, CheckCircle, Mail, MapPin, Clock } from "lucide-react";

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
        subtitle="Have a project in mind? Let's work together"
      />

      <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        {/* Left — Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@mehedi.dev" },
              { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" },
              { icon: Clock, label: "Response", value: "Within 24 hours" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center">
                  <Icon className="h-5 w-5 text-electric" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-foreground font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative gradient */}
          <div className="hidden lg:block relative h-48">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric/5 via-violet/5 to-cyan/5 blur-2xl" />
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3"
        >
          <div className="gradient-border rounded-xl">
            <div className="glass-card rounded-xl p-8">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">Thank you!</h3>
                  <p className="text-muted-foreground mt-2">
                    Your message has been sent. I&apos;ll get back to you soon!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Project Inquiry"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Message</Label>
                    <Textarea
                      id="body"
                      placeholder="Tell me about your project..."
                      rows={5}
                      {...register("body")}
                    />
                    {errors.body && (
                      <p className="text-xs text-red-400">{errors.body.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
