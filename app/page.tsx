'use client';

import { useBehavioralSensor } from '@/hooks/useBehavioralSensor';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SuperpositionContainer } from '@/components/agentic/SuperpositionContainer';
import { PersonalizedAgent } from '@/components/agentic/PersonalizedAgent';
import { LiveMetricsPanel } from '@/components/agentic/LiveMetricsPanel';
import { Header } from '@/components/layout/Header';

import { HeroData } from '@/components/sections/hero/HeroData';
import { HeroStory } from '@/components/sections/hero/HeroStory';
import { HeroNeutral } from '@/components/sections/hero/HeroNeutral';

import { FeaturesData } from '@/components/sections/features/FeaturesData';
import { FeaturesStory } from '@/components/sections/features/FeaturesStory';
import { FeaturesNeutral } from '@/components/sections/features/FeaturesNeutral';

import { PipelineData } from '@/components/sections/pipeline/PipelineData';
import { PipelineStory } from '@/components/sections/pipeline/PipelineStory';
import { PipelineNeutral } from '@/components/sections/pipeline/PipelineNeutral';

import { PricingData } from '@/components/sections/pricing/PricingData';
import { PricingStory } from '@/components/sections/pricing/PricingStory';
import { PricingNeutral } from '@/components/sections/pricing/PricingNeutral';

import { SocialData } from '@/components/sections/social/SocialData';
import { SocialStory } from '@/components/sections/social/SocialStory';
import { SocialNeutral } from '@/components/sections/social/SocialNeutral';

import { CtaData } from '@/components/sections/cta/CtaData';
import { CtaStory } from '@/components/sections/cta/CtaStory';
import { CtaNeutral } from '@/components/sections/cta/CtaNeutral';

export default function Home() {
  useBehavioralSensor();
  useAnalytics();

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-900/40 selection:text-indigo-200">
      <Header />

      <main className="pt-20 flex flex-col items-center w-full">
        {/* Hero */}
        <div className="w-full" id="section-hero">
          <SuperpositionContainer
            layoutId="hero"
            analyticalView={<HeroData />}
            storytellerView={<HeroStory />}
            neutralView={<HeroNeutral />}
          />
        </div>

        {/* Features */}
        <div className="w-full" id="section-features">
          <SuperpositionContainer
            layoutId="features"
            analyticalView={<FeaturesData />}
            storytellerView={<FeaturesStory />}
            neutralView={<FeaturesNeutral />}
          />
        </div>

        {/* Pipeline */}
        <div className="w-full" id="section-pipeline">
          <SuperpositionContainer
            layoutId="pipeline"
            analyticalView={<PipelineData />}
            storytellerView={<PipelineStory />}
            neutralView={<PipelineNeutral />}
          />
        </div>

        {/* Social Proof */}
        <div className="w-full border-t border-slate-800/60" id="section-social">
          <SuperpositionContainer
            layoutId="social"
            analyticalView={<SocialData />}
            storytellerView={<SocialStory />}
            neutralView={<SocialNeutral />}
          />
        </div>

        {/* Pricing */}
        <div className="w-full border-t border-slate-800/60" id="section-pricing">
          <SuperpositionContainer
            layoutId="pricing"
            analyticalView={<PricingData />}
            storytellerView={<PricingStory />}
            neutralView={<PricingNeutral />}
          />
        </div>

        {/* CTA */}
        <div className="w-full border-t border-slate-800/60" id="section-cta">
          <SuperpositionContainer
            layoutId="cta"
            analyticalView={<CtaData />}
            storytellerView={<CtaStory />}
            neutralView={<CtaNeutral />}
          />
        </div>
      </main>

      {/* Floating overlays */}
      <PersonalizedAgent />
      <LiveMetricsPanel />
    </div>
  );
}
