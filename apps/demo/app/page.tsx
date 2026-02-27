'use client';

import { useState } from 'react';
import { AdaptiveContainer, SoaiSuggestion } from '@soai/react';
import { Header } from '@/components/layout/Header';

import { HeroData } from '@/components/sections/hero/HeroData';
import { HeroStory } from '@/components/sections/hero/HeroStory';
import { HeroNeutral } from '@/components/sections/hero/HeroNeutral';

import { FeaturesData } from '@/components/sections/features/FeaturesData';
import { FeaturesStory } from '@/components/sections/features/FeaturesStory';
import { FeaturesNeutral } from '@/components/sections/features/FeaturesNeutral';

import { LiveSignalStrip } from '@/components/sections/LiveSignalStrip';
import { DashboardGenerator } from '@/components/sections/DashboardGenerator';
import { AdaptiveShowcase } from '@/components/sections/AdaptiveShowcase';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Integration } from '@/components/sections/Integration';
import { CTAFooter } from '@/components/sections/CTAFooter';

import { useOnboarding } from '@/lib/hooks/useOnboarding';
import { SoaiJourney } from '@/components/onboarding/SoaiJourney';
import { PersonaTransitionToast } from '@/components/sections/PersonaTransitionToast';

export default function Home() {
  const { hasCompleted, completeOnboarding } = useOnboarding();
  const [journeyDone, setJourneyDone] = useState(false);

  const handleJourneyComplete = () => {
    completeOnboarding();
    setJourneyDone(true);
  };

  const showPostOnboarding = hasCompleted === true || journeyDone;

  return (
    <div className="min-h-screen bg-[var(--color-soai-bg)] selection:bg-[#00d9c0]/25 selection:text-[var(--color-soai-text)]">
      <Header />

      <main className="flex flex-col items-center w-full">
        {/* 1. Hero — Adaptive */}
        <div className="w-full pt-16">
          <AdaptiveContainer
            id="hero"
            variants={{
              browser: HeroNeutral,
              researcher: HeroData,
              buyer: HeroStory,
            }}
          />
        </div>

        {/* 2. Live Signal Strip */}
        <LiveSignalStrip />

        {/* 3. Dashboard Generator */}
        <div className="w-full">
          <DashboardGenerator />
        </div>

        {/* 4. Adaptive Showcase */}
        <div className="w-full border-t border-white/[0.04]">
          <AdaptiveShowcase />
        </div>

        {/* 5. Features — Adaptive */}
        <div className="w-full border-t border-white/[0.04]">
          <AdaptiveContainer
            id="features"
            variants={{
              browser: FeaturesNeutral,
              researcher: FeaturesData,
              buyer: FeaturesStory,
            }}
          />
        </div>

        {/* 6. How It Works */}
        <div className="w-full border-t border-white/[0.04]">
          <HowItWorks />
        </div>

        {/* 7. Integration */}
        <div className="w-full border-t border-white/[0.04]">
          <Integration />
        </div>

        {/* 8. CTA Footer */}
        <div className="w-full border-t border-white/[0.04]">
          <CTAFooter />
        </div>
      </main>

      {/* Post-onboarding widgets */}
      {showPostOnboarding && (
        <>
          <SoaiSuggestion position="bottom-right" />
          <PersonaTransitionToast />
        </>
      )}

      {/* Onboarding overlay — sibling to landing page, sensors run underneath */}
      {hasCompleted === false && !journeyDone && (
        <SoaiJourney onComplete={handleJourneyComplete} />
      )}
    </div>
  );
}
