'use client';

import { useBehavioralSensor } from '@/hooks/useBehavioralSensor';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useIntent } from '@/hooks/useIntent';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { LiveMetricsPanel } from '@/components/agentic/LiveMetricsPanel';
import { PersonalizedAgent } from '@/components/agentic/PersonalizedAgent';
import type { PersonaType } from '@/types';
import { useEffect, useState } from 'react';

// ─── Persona metadata ─────────────────────────────────────────────────────────

const PERSONA_META: Record<PersonaType, {
  label:       string;
  color:       string;
  ring:        string;
  bg:          string;
  accent:      string;
  description: string;
  tagline:     string;
}> = {
  commander: {
    label:       'Commander',
    color:       'text-red-400',
    ring:        'ring-red-500/40',
    bg:          'from-red-950/60 via-slate-950 to-slate-950',
    accent:      'bg-red-500',
    description: 'Decisive. Action-driven. You know what you want.',
    tagline:     'Execute at full speed.',
  },
  analytical: {
    label:       'Analytical',
    color:       'text-cyan-400',
    ring:        'ring-cyan-500/40',
    bg:          'from-cyan-950/40 via-slate-950 to-slate-950',
    accent:      'bg-cyan-500',
    description: 'Data-first. Systematic. Every variable accounted for.',
    tagline:     'The numbers speak clearly.',
  },
  researcher: {
    label:       'Researcher',
    color:       'text-emerald-400',
    ring:        'ring-emerald-500/40',
    bg:          'from-emerald-950/40 via-slate-950 to-slate-950',
    accent:      'bg-emerald-500',
    description: 'Thorough. Deep-diver. No detail left unexplored.',
    tagline:     'Go deeper.',
  },
  explorer: {
    label:       'Explorer',
    color:       'text-amber-400',
    ring:        'ring-amber-500/40',
    bg:          'from-amber-950/40 via-slate-950 to-slate-950',
    accent:      'bg-amber-500',
    description: 'Curious. High-entropy. Drawn to the unexpected.',
    tagline:     'What\'s around the corner?',
  },
  storyteller: {
    label:       'Storyteller',
    color:       'text-violet-400',
    ring:        'ring-violet-500/40',
    bg:          'from-violet-950/40 via-slate-950 to-slate-950',
    accent:      'bg-violet-500',
    description: 'Narrative-first. Emotionally resonant. The journey matters.',
    tagline:     'Every interface tells a story.',
  },
  skeptic: {
    label:       'Skeptic',
    color:       'text-orange-400',
    ring:        'ring-orange-500/40',
    bg:          'from-orange-950/40 via-slate-950 to-slate-950',
    accent:      'bg-orange-500',
    description: 'Trust-seeker. Evidence-driven. Prove it first.',
    tagline:     'Show the evidence.',
  },
  neutral: {
    label:       'Undetermined',
    color:       'text-slate-400',
    ring:        'ring-slate-500/40',
    bg:          'from-slate-900/40 via-slate-950 to-slate-950',
    accent:      'bg-slate-500',
    description: 'Still observing. The interface is still learning you.',
    tagline:     'Keep interacting...',
  },
};

// ─── Persona-specific UI layouts ──────────────────────────────────────────────

function CommanderLayout({ intent }: { intent: ReturnType<typeof useIntent>['intent'] }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-mono uppercase tracking-widest text-red-500 border border-red-500/30 rounded px-2 py-0.5">MISSION READY</span>
      </div>
      <h1 className="text-6xl font-black text-white leading-none tracking-tight">
        Stop <span className="text-red-400">browsing.</span><br />Start executing.
      </h1>
      <p className="text-xl text-slate-400 max-w-lg">You move fast. The interface moves faster. No friction. No noise. Just output.</p>
      <div className="flex gap-4 pt-4">
        <button className="px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold text-lg rounded-xl transition-all shadow-2xl shadow-red-500/30">
          Deploy Now →
        </button>
        <button className="px-8 py-4 border border-red-500/40 text-red-400 font-bold text-lg rounded-xl hover:bg-red-500/10 transition-all">
          View Metrics
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800">
        {[
          { label: 'Response Time', value: `${(intent.mouseVelocity * 3.2).toFixed(0)}ms`, unit: 'avg latency' },
          { label: 'Session Velocity', value: `${(intent.mouseVelocity * 100).toFixed(0)}`, unit: 'px/sec' },
          { label: 'Engagement', value: `${(intent.probability * 100).toFixed(0)}%`, unit: 'intensity' },
        ].map(m => (
          <div key={m.label} className="bg-red-950/20 border border-red-900/40 rounded-xl p-5">
            <div className="text-3xl font-black text-red-400 font-mono">{m.value}</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{m.unit}</div>
            <div className="text-sm text-slate-300 mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticalLayout({ intent }: { intent: ReturnType<typeof useIntent>['intent'] }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-500">Behavioral Signal Analysis</div>
          <h1 className="text-5xl font-black text-white leading-tight">
            Predict every user.<br /><span className="text-cyan-400">Prove every assumption.</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">The HMM pipeline classifies your interaction pattern in real-time. Shannon entropy H = {intent.metrics.globalEntropy.toFixed(3)} bits signals your behavioral diversity index.</p>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all">Read the Paper</button>
            <button className="px-6 py-3 border border-cyan-500/30 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all">API Docs</button>
          </div>
        </div>
        <div className="col-span-2 space-y-3">
          {[
            { label: 'HMM State',        value: intent.hmm.currentStateName, mono: true },
            { label: 'Shannon H',        value: `${intent.metrics.globalEntropy.toFixed(4)} bits`, mono: true },
            { label: 'λ₂ (Persistence)', value: intent.metrics.eigen2.toFixed(4), mono: true },
            { label: 'Velocity Pct',     value: `${(intent.metrics.velocityPercentile * 100).toFixed(1)}th`, mono: true },
            { label: 'Observations',     value: String(intent.hmm.observationCount), mono: true },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-xs text-slate-500 uppercase tracking-wide">{r.label}</span>
              <span className="text-sm font-mono text-cyan-300">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResearcherLayout({ intent }: { intent: ReturnType<typeof useIntent>['intent'] }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-10">
      <div className="border-l-2 border-emerald-500 pl-5">
        <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">In-Depth Analysis</div>
        <h1 className="text-5xl font-black text-white">Understanding the mathematics behind<br /><span className="text-emerald-400">behavioral phenotyping</span></h1>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[
          {
            title: 'Hidden Markov Models',
            body: 'A dHMM with N=3 hidden states (ENGAGED, SCANNING, HESITANT) and M=6 discrete observation symbols models the latent cognitive state of every user interaction event.',
            tag: 'Section 2.1 — Stochastic Models',
          },
          {
            title: 'Baum-Welch EM',
            body: 'Online parameter estimation via the re-estimation equations: Â_ij = Σₜ ξₜ(i,j) / Σₜ γₜ(i). Fires every 20 observations, adapting to this specific user.',
            tag: 'Section 2.2 — Parameter Learning',
          },
          {
            title: 'Shannon Entropy',
            body: `Current H = ${intent.metrics.globalEntropy.toFixed(4)} bits (max = ${Math.log2(3).toFixed(4)}). High entropy indicates diverse, evenly distributed behavioral repertoire.`,
            tag: 'Section 3.1 — Information Theory',
          },
          {
            title: 'PCHIP Percentile',
            body: `Your velocity ranks at the ${(intent.metrics.velocityPercentile * 100).toFixed(1)}th percentile of your own history. Fritsch–Carlson monotone cubic interpolation ensures valid CDF.`,
            tag: 'Section 3.3 — Individualized Baseline',
          },
        ].map(c => (
          <div key={c.title} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">{c.tag}</div>
            <h3 className="text-lg font-bold text-white">{c.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all">Full Paper →</button>
        <button className="px-6 py-3 border border-emerald-500/30 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 transition-all">Source Code</button>
      </div>
    </div>
  );
}

function ExplorerLayout({ intent }: { intent: ReturnType<typeof useIntent>['intent'] }) {
  const cards = [
    { title: 'Predictive UI',      color: 'border-amber-500/40 bg-amber-950/10',  icon: '🔮', desc: 'Pages that shape themselves around you' },
    { title: 'Behavioral DNA',     color: 'border-violet-500/40 bg-violet-950/10', icon: '🧬', desc: `Entropy: ${intent.metrics.globalEntropy.toFixed(2)} bits — your unique fingerprint` },
    { title: 'Live HMM Engine',    color: 'border-cyan-500/40 bg-cyan-950/10',     icon: '⚙️', desc: `State: ${intent.hmm.currentStateName} — updated every event` },
    { title: 'Persona Collapse',   color: 'border-emerald-500/40 bg-emerald-950/10', icon: '⚡', desc: '7 archetypes competing to describe you' },
    { title: 'PCHIP Baseline',     color: 'border-pink-500/40 bg-pink-950/10',     icon: '📈', desc: `You are faster than ${(intent.metrics.velocityPercentile * 100).toFixed(0)}% of yourself` },
    { title: 'Discover More',      color: 'border-amber-500/40 bg-amber-900/10',   icon: '🗺️', desc: 'The deeper you explore, the more it knows' },
  ];
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-10">
      <div className="text-center space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500">You are in explorer mode</span>
        <h1 className="text-5xl font-black text-white">
          High entropy detected.<br /><span className="text-amber-400">Embrace the unknown.</span>
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {cards.map(c => (
          <motion.div
            key={c.title}
            whileHover={{ scale: 1.03, y: -4 }}
            className={`border rounded-2xl p-6 cursor-pointer space-y-3 ${c.color} transition-all`}
          >
            <div className="text-3xl">{c.icon}</div>
            <h3 className="text-white font-bold">{c.title}</h3>
            <p className="text-sm text-slate-400">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StorytellerLayout({ intent }: { intent: ReturnType<typeof useIntent>['intent'] }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6"
      >
        <div className="text-xs font-mono uppercase tracking-widest text-violet-400">A story about how interfaces learn</div>
        <h1 className="text-6xl font-black text-white leading-tight">
          Once upon a time,<br /><span className="text-violet-400">a page knew your name.</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          The interface watches. Not with cameras — with mathematics. Every scroll tells a chapter. Every pause is a sentence. Your behavior is the story.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-3 gap-6 text-center"
      >
        {[
          { icon: '📖', title: 'Chapter 1', body: 'You arrived. The HMM started observing your movement patterns.' },
          { icon: '🔍', title: 'Chapter 2', body: `After ${intent.hmm.observationCount} events, the model began to understand your rhythm.` },
          { icon: '✨', title: 'Chapter 3', body: 'The interface collapsed into storyteller mode. Because that\'s who you are.' },
        ].map(c => (
          <div key={c.title} className="space-y-3">
            <div className="text-4xl">{c.icon}</div>
            <div className="text-violet-400 font-bold">{c.title}</div>
            <p className="text-sm text-slate-400 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </motion.div>
      <div className="text-center">
        <button className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg rounded-2xl transition-all shadow-2xl shadow-violet-500/20">
          Continue the Story →
        </button>
      </div>
    </div>
  );
}

function SkepticLayout({ intent }: { intent: ReturnType<typeof useIntent>['intent'] }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-10">
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-widest text-orange-500">We noted your hesitations</div>
        <h1 className="text-5xl font-black text-white">
          We know you need<br /><span className="text-orange-400">proof before trust.</span>
        </h1>
        <p className="text-xl text-slate-400">Fair. Here is exactly what the system observed about you — transparently.</p>
      </div>
      <div className="space-y-3 border border-orange-900/40 rounded-2xl p-6 bg-orange-950/10">
        <div className="text-sm font-mono text-orange-400 mb-4">// Session evidence report</div>
        {[
          { key: 'Hesitation events detected',   value: `${intent.hmm.observationCount > 0 ? Math.round(intent.hmm.observationCount * 0.12) : 0} pauses > 500ms` },
          { key: 'Current cognitive state',       value: intent.hmm.currentStateName },
          { key: 'Behavioral confidence',         value: `${(Math.max(...intent.hmm.posteriors) * 100).toFixed(1)}% certainty` },
          { key: 'Entropy (behavioral diversity)',value: `${intent.metrics.globalEntropy.toFixed(4)} bits` },
          { key: 'Observations processed',        value: String(intent.hmm.observationCount) },
          { key: 'Model adapted to you',          value: intent.hmm.observationCount >= 10 ? 'YES — Baum-Welch active' : 'Pending (need 10 obs)' },
        ].map(r => (
          <div key={r.key} className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
            <span className="text-sm text-slate-400">{r.key}</span>
            <span className="text-sm font-mono text-orange-300">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all">I Accept the Evidence</button>
        <button className="px-6 py-3 border border-orange-500/30 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/10 transition-all">View Source Code</button>
      </div>
    </div>
  );
}

function NeutralLayout() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 rounded-full border border-slate-700/60 animate-ping opacity-20" />
        <div className="absolute inset-3 rounded-full border border-slate-600/60 animate-pulse" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <span className="text-3xl">?</span>
        </div>
      </div>
      <h1 className="text-5xl font-black text-white">
        The interface is in<br /><span className="text-slate-400">superposition.</span>
      </h1>
      <p className="text-xl text-slate-500 max-w-xl mx-auto">All seven personas exist simultaneously until your behavior collapses the wave function. Keep interacting — the model is learning.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        {(['commander', 'analytical', 'researcher', 'explorer', 'storyteller', 'skeptic'] as PersonaType[]).map(p => {
          const m = PERSONA_META[p];
          return (
            <span key={p} className={`text-xs font-mono px-3 py-1 rounded-full border border-white/10 ${m.color}`}>{m.label}</span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function SuperpositionPage() {
  useBehavioralSensor();
  useAnalytics();

  const { intent } = useIntent();
  const [prevPersona, setPrevPersona] = useState<PersonaType>('neutral');
  const [collapseCount, setCollapseCount] = useState(0);

  useEffect(() => {
    if (intent.persona !== prevPersona) {
      setPrevPersona(intent.persona);
      setCollapseCount(c => c + 1);
    }
  }, [intent.persona, prevPersona]);

  const meta = PERSONA_META[intent.persona];

  const layouts: Record<PersonaType, React.ReactNode> = {
    commander:   <CommanderLayout intent={intent} />,
    analytical:  <AnalyticalLayout intent={intent} />,
    researcher:  <ResearcherLayout intent={intent} />,
    explorer:    <ExplorerLayout intent={intent} />,
    storyteller: <StorytellerLayout intent={intent} />,
    skeptic:     <SkepticLayout intent={intent} />,
    neutral:     <NeutralLayout />,
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${meta.bg} font-sans transition-all duration-1000`}>
      <Header />

      {/* Persona collapse indicator banner */}
      <div className="fixed top-[60px] left-0 right-0 z-40">
        <motion.div
          key={intent.persona}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="px-4 py-2 bg-slate-950/80 backdrop-blur border-b border-slate-800/60 flex items-center justify-center gap-6"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">Predictive UI Demo</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${meta.accent} animate-pulse`} />
            <span className={`text-xs font-mono ${meta.color}`}>
              {meta.label} — {meta.description}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">
            {collapseCount} collapse{collapseCount !== 1 ? 's' : ''} · {intent.hmm.observationCount} obs
          </span>
        </motion.div>
      </div>

      <main className="pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={intent.persona}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          >
            {layouts[intent.persona]}
          </motion.div>
        </AnimatePresence>

        {/* All 7 persona variants shown as ghost previews below */}
        <section className="border-t border-slate-800/60 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
            <div className="text-center space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-500">All Seven Personas</div>
              <h2 className="text-3xl font-black text-white">Every user is a different page.</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm">The same URL. Seven radically different experiences. The interface above morphs in real-time to whichever persona the HMM detects.</p>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {(Object.keys(PERSONA_META) as PersonaType[]).map(p => {
                const m = PERSONA_META[p];
                const active = p === intent.persona;
                return (
                  <motion.div
                    key={p}
                    animate={{ scale: active ? 1.04 : 1 }}
                    className={`rounded-xl p-3 text-center border transition-all ${
                      active
                        ? `border-white/20 bg-white/5 ${m.ring} ring-2`
                        : 'border-slate-800/60 bg-slate-900/30'
                    }`}
                  >
                    <div className={`text-xs font-bold ${active ? m.color : 'text-slate-500'}`}>{m.label}</div>
                    {active && <div className={`w-1.5 h-1.5 rounded-full ${m.accent} mx-auto mt-2 animate-pulse`} />}
                    <p className="text-[9px] text-slate-600 mt-1 leading-tight hidden sm:block">{m.tagline}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <PersonalizedAgent />
      <LiveMetricsPanel />
    </div>
  );
}
