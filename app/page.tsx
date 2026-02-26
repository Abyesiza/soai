'use client';

import { useBehavioralSensor } from '@/hooks/useBehavioralSensor';
import { SuperpositionContainer } from '@/components/agentic/SuperpositionContainer';
import { PersonalizedAgent } from '@/components/agentic/PersonalizedAgent';
import { Header } from '@/components/layout/Header';

import { HeroData } from '@/components/sections/hero/HeroData';
import { HeroStory } from '@/components/sections/hero/HeroStory';
import { HeroNeutral } from '@/components/sections/hero/HeroNeutral';

import { FeaturesData } from '@/components/sections/features/FeaturesData';
import { FeaturesStory } from '@/components/sections/features/FeaturesStory';
import { FeaturesNeutral } from '@/components/sections/features/FeaturesNeutral';

export default function Home() {
  useBehavioralSensor();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="pt-20 flex flex-col items-center w-full">
        {/* Helper text explaining the interaction */}
        <div className="w-full bg-slate-100/50 py-3 text-center text-xs text-slate-500 font-mono tracking-wide border-b border-slate-200">
          PRO TIP: Scroll & move quickly for Analytical View. Move slowly/hover for Storyteller View.
        </div>

        {/* Hero Superposition */}
        <div className="w-full">
          <SuperpositionContainer
            layoutId="hero"
            analyticalView={<HeroData />}
            storytellerView={<HeroStory />}
            neutralView={<HeroNeutral />}
          />
        </div>

        {/* Features Superposition */}
        <div className="w-full">
          <SuperpositionContainer
            layoutId="features"
            analyticalView={<FeaturesData />}
            storytellerView={<FeaturesStory />}
            neutralView={<FeaturesNeutral />}
          />
        </div>

      </main>

      {/* Floating Agent that talks to Gemini AI and saves session to Supabase */}
      <PersonalizedAgent />
    </div>
  );
}
