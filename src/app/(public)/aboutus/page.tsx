"use client";

import { useState, useEffect, startTransition, FC } from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createSubscriberAction } from "@/actions/subscriberActions";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { question: 'How does ItsCoupons verify the coupons?', answer: 'We verify coupons through manual testing and merchant API integration to ensure accuracy.' },
  { question: 'Is ItsCoupons free to use?', answer: 'Yes, 100% free for all users. No sign-up or subscription required.' },
  { question: 'How often are new deals added?', answer: 'We update deals daily to bring you the latest savings opportunities.' },
  { question: 'Can I suggest a store or brand for inclusion?', answer: 'Absolutely! Send your suggestions through our Contact page.' },
];

interface TeamCardProps {
  name: string;
  title: string;
  color: string;
}

const TeamCard: FC<TeamCardProps> = ({ name, title, color }) => (
  <div
    className={`p-8 rounded-lg shadow-md ${color} text-white min-h-[220px] flex flex-col justify-center`}
  >
    <h3 className="text-lg sm:text-xl font-semibold">{name}</h3>
    <p className="text-sm sm:text-base mt-2">{title}</p>
  </div>
);


interface FieldErrors {
  [key: string]: string[];
}

const AboutPage: FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'story' | 'mission' | 'values'>('story');

  const toggleFAQ = (index: number) => setOpenFAQ(openFAQ === index ? null : index);

  // Newsletter form state using useActionState
  const [email, setEmail] = useState("");
  const [formState, dispatch, isPending] = useActionState(createSubscriberAction, {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    if (formState.data && !formState.error) {
      setDialogMessage("You have been successfully subscribed!");
      setDialogOpen(true);
      setEmail("");
    }

    if (formState.error && "message" in formState.error) {
      setDialogMessage((formState.error as any).message?.[0] || "Something went wrong!");
      setDialogOpen(true);
    }
  }, [formState]);

  return (
    <div className="text-gray-800">

      {/* Hero Section */}
      <section className="bg-purple-800 text-white py-16 px-4 sm:px-6 lg:px-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">About ItsCoupons</h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg mb-10">
          Empowering millions of shoppers to save money every day with verified coupons and exclusive deals across thousands of retailers.
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-white/90 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold">10M+</div>
            <p className="text-sm sm:text-base">Active Visitors</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold">143K+</div>
            <p className="text-sm sm:text-base">Coupons Verified</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold">$293M</div>
            <p className="text-sm sm:text-base">Money Saved</p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start space-x-0 sm:space-x-8 border-b mb-8 text-sm font-medium">
          {['story', 'mission', 'values'].map((tab) => {
            const label = tab === 'story' ? 'Our Story' : tab === 'mission' ? 'Mission & Vision' : 'Our Values';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-2 py-2 sm:py-0 pb-2 sm:pb-2 ${activeTab === tab ? 'border-b-2 border-purple-700 text-purple-700 font-semibold' : 'hover:text-purple-600'}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {activeTab === 'story' && (
            <>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">How It All Started</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Founded in 2015, ItsCoupons began as a simple idea: make saving money effortless. Since then, we’ve grown into a trusted destination for over 10 million users seeking verified, reliable coupons across thousands of brands.
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Our platform is powered by smart technology and a dedicated team that works 24/7 to update, test, and verify coupon codes so users never miss a chance to save.
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Today, ItsCoupons is a recognized leader in the deal discovery space — empowering users to stretch their spending and enjoy more for less.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 shadow">
                <h3 className="font-semibold mb-4 text-purple-700">Key Milestones</h3>
                <ul className="text-sm sm:text-base text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>2015</strong> – ItsCoupons founded</li>
                  <li><strong>2017</strong> – 1M+ users</li>
                  <li><strong>2020</strong> – AI-powered coupon validation</li>
                  <li><strong>2023</strong> – $250M+ user savings milestone</li>
                  <li><strong>2024</strong> – Mobile app + international expansion</li>
                </ul>
              </div>
            </>
          )}
          {activeTab === 'mission' && (
            <div className="md:col-span-2">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Our Mission & Vision</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                Our mission is to make saving effortless and accessible to everyone.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                We envision a world where shoppers can always find the best deals without the hassle of searching multiple websites.
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                By combining technology, data insights, and a dedicated team, we ensure verified coupons and exclusive deals reach millions of users globally.
              </p>
            </div>
          )}
          {activeTab === 'values' && (
            <div className="md:col-span-2">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Our Core Values</h2>
              <ul className="text-sm sm:text-base text-gray-600 space-y-2 list-disc list-inside">
                <li>Integrity – We always provide verified and accurate coupon information.</li>
                <li>Innovation – Continuously improving our platform with smart technology.</li>
                <li>Customer-Centric – Our users are at the heart of everything we do.</li>
                <li>Transparency – Clear, honest, and accessible deal information for everyone.</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Meet Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
          <TeamCard name="Sarah Chen" title="Co-founder & CEO" color="bg-blue-600" />
          <TeamCard name="Michael Rodriguez" title="Head of Product" color="bg-green-600" />
          <TeamCard name="Emily Johnson" title="Marketing Director" color="bg-orange-500" />
          <TeamCard name="David Kim" title="Growth Strategist" color="bg-yellow-500 text-black" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-lg">
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full text-left px-4 py-3 font-medium bg-gray-100 hover:bg-gray-200 transition"
              >
                {faq.question}
              </button>
              {openFAQ === i && (
                <div className="px-4 py-3 text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-white text-center py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the Savings Revolution</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Get exclusive access to the best deals, early notifications of sales, and personalized coupon recommendations.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.set("email", email);

            startTransition(() => {
              dispatch(formData);
            });
          }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition shadow-sm"
            disabled={isPending}
          >
            {isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        {errorFor("email") && <p className="text-red-500 mt-2">{errorFor("email")}</p>}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Subscription Status</DialogTitle>
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
      </section>
    </div>
  );
};

export default AboutPage;
