"use client";

import { useState, startTransition } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { SettingData } from "@/types/setting";
import { sendContactEmail } from "@/actions/contactActions";

interface ContactSectionProps {
  latestSetting: SettingData | null;
}

export default function ContactSection({ latestSetting }: ContactSectionProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    startTransition(async () => {
      const res = await sendContactEmail(form, latestSetting);
      setLoading(false);

      if (res.success) {
        setDialogMessage("Message sent successfully!");
        setDialogOpen(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setDialogMessage("Failed to send message: " + (res.error || "Unknown error"));
        setDialogOpen(true);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <h1 className="text-3xl font-semibold border-b-2 border-purple-900 pb-2 w-fit">
        Contact Us
      </h1>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-3">
          <MapPin className="mx-auto h-10 w-10 text-purple-900" />
          <h3 className="font-semibold">ADDRESS</h3>
          <p className="text-gray-600">
            {latestSetting?.address || "123, street, Discount city, 50050"}
          </p>
        </div>
        <div className="space-y-3">
          <Phone className="mx-auto h-10 w-10 text-purple-900" />
          <h3 className="font-semibold">PHONE NUMBER</h3>
          <p className="text-gray-600">
            {latestSetting?.contactPhone || "(+92) 3143328342"}
          </p>
        </div>
        <div className="space-y-3">
          <Mail className="mx-auto h-10 w-10 text-purple-900" />
          <h3 className="font-semibold">EMAIL</h3>
          <p className="text-gray-600">
            {latestSetting?.contactEmail || "support@itscoupons.com"}
          </p>
        </div>
      </div>

      {/* Map + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Google Map */}
        <div className="w-full h-[350px] rounded-lg overflow-hidden shadow">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.837720510796!2d-73.79201928459468!3d40.73494597932909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2611f84d6d9f7%3A0x7ec9f632eea7eb4b!2s20117%20Horace%20Harding%20Expy%2C%20Queens%2C%20NY%2011364%2C%20USA!5e0!3m2!1sen!2sus!4v1632866500000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">Contact Us Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />
          <Textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            className="h-32"
          />
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>

      {/* Dialog for success/error message */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Message Status</DialogTitle>
          </DialogHeader>
          <p className="py-2 text-sm sm:text-base">{dialogMessage}</p>
          <DialogFooter>
            <Button
              className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition shadow-sm"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
