"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { PageContainer } from "@/components/shared/page-container";
import { contactSchema, type ContactInput } from "@/lib/validation/contact.schema";

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: "support@sportswear.example", href: "mailto:support@sportswear.example" },
  { icon: Phone, label: "Phone", value: "+91 12345 67890", href: "tel:+911234567890" },
  { icon: MapPin, label: "Office", value: "Pune, Maharashtra, India", href: undefined },
] as const;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(): Promise<void> {
    // NOTE: there is no backend endpoint for contact submissions yet — this is a
    // mocked success path until a real /api/contact route exists.
    toast.success("Message sent — we'll get back to you within 1 business day.");
    reset();
  }

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact Us</h1>
        <p className="text-muted-foreground">
          Questions about an order, sizing, or anything else? We usually reply within one business day.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-5">
        <div className="space-y-4 sm:col-span-2">
          {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium hover:underline">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 sm:col-span-3">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" type="text" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
          </FormField>

          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </FormField>

          <FormField label="Message" htmlFor="message" error={errors.message?.message}>
            <Textarea
              id="message"
              rows={5}
              aria-invalid={!!errors.message}
              {...register("message")}
            />
          </FormField>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send message"}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
