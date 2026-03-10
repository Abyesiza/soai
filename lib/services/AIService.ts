import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import type { BehavioralMetrics, HMMModelState } from '@/types';

/**
 * AI Orchestrator
 *
 * Generates context-aware UI responses by enriching the Gemini prompt with
 * the full set of HMM-derived behavioral signals:
 *   - HMM current state (ENGAGED / SCANNING / HESITANT) + posteriors
 *   - Shannon entropy (behavioral diversity)
 *   - λ₂ / Eigen₂ (temporal persistence)
 *   - PCHIP velocityPercentile (personalised baseline comparison)
 *   - Soft GMM persona membership probabilities
 *
 * This moves the model from a single-scalar (velocity) description to a
 * full multi-dimensional behavioral fingerprint.
 */
export class AIService {
  private modelName: string;

  constructor(modelName = 'gemini-2.5-flash') {
    this.modelName = modelName;
  }

  /**
   * Generates a personalized greeting / UI context string.
   *
   * @param persona          Collapsed persona label
   * @param intentVelocity   Raw mouse velocity (px/ms) at trigger time
   * @param probability      HMM-derived intent probability [0, 1]
   * @param hmm              Optional full HMM model snapshot
   * @param metrics          Optional statistical behavioral metrics
   */
  public async generatePersonaContext(
    persona:         string,
    intentVelocity:  number,
    probability?:    number,
    hmm?:            HMMModelState,
    metrics?:        BehavioralMetrics
  ): Promise<string> {
    const behaviorBlock = hmm && metrics
      ? this._buildBehaviorBlock(hmm, metrics)
      : `Interaction velocity: ${intentVelocity.toFixed(3)} px/ms.`;

    try {
      const { text } = await generateText({
        model: google(this.modelName),
        system: `You are the AI Orchestrator for a Self-Optimizing Agentic Interface (SOAI).
Your role is to generate a single concise personalised greeting or short UI context message
(2–3 sentences max) based on the user's inferred behavioral state.

Persona classification key:
  • analytical  — deliberate, fast movement; direct goal pursuit; prefers data and structure.
  • storyteller  — exploratory scrolling; slow, contemplative; prefers narrative and imagery.
  • neutral       — balanced or uncertain; may be transitioning between modes.

Do NOT mention the technical model internals. Write in plain, warm language.`,
        prompt: `
Current persona: ${persona} (probability ${(probability ?? 0.5).toFixed(2)})
${behaviorBlock}

Generate a short, personalised greeting that acknowledges this behavioral state
and subtly adapts the interface tone to serve this user best right now.`.trim(),
      });
      return text;
    } catch (error) {
      console.error('AIService generation error:', error);
      return 'Welcome. The interface is adapting to your browsing style.';
    }
  }

  /** Formats behavioral signals into a compact prompt block. */
  private _buildBehaviorBlock(hmm: HMMModelState, metrics: BehavioralMetrics): string {
    const state      = hmm.currentStateName;
    const [pe, ps, ph] = hmm.posteriors.map(p => (p * 100).toFixed(1));
    const entropy    = metrics.globalEntropy.toFixed(3);
    const eigen2     = metrics.eigen2.toFixed(3);
    const velPct     = (metrics.velocityPercentile * 100).toFixed(0);
    const [ma, ms2, mn] = metrics.personaMemberships.map(p => (p * 100).toFixed(1));

    return `
HMM behavioral state: ${state} (ENGAGED ${pe}% / SCANNING ${ps}% / HESITANT ${ph}%)
Shannon entropy H = ${entropy} bits (structural diversity of interaction sequence)
Spectral persistence λ₂ = ${eigen2} (close to 1 = lingering; close to 0 = fluid)
PCHIP velocity percentile: ${velPct}th (vs. this user's own baseline)
GMM soft persona membership: analytical ${ma}% / storyteller ${ms2}% / neutral ${mn}%
Observations collected: ${hmm.observationCount}`.trim();
  }
}

export const aiService = new AIService();

