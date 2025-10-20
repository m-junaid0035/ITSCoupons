
"use client";

import HeroSlider from "./HeroSlider";
import type { EventWithStore } from "@/types/event";

interface HeroSliderWrapperProps {
  events: EventWithStore[];
}

export default function HeroSliderWrapper({ events }: HeroSliderWrapperProps) {
  return <HeroSlider events={events} />;
}
