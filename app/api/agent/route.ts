import { aiService } from '@/lib/services/AIService';
import { databaseService } from '@/lib/services/DatabaseService';
import { NextResponse } from 'next/server';
import type { BehavioralMetrics, HMMModelState } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      persona:      string;
      velocity:     number;
      probability?: number;
      userId?:      string;
      hmm?:         HMMModelState;
      metrics?:     BehavioralMetrics;
    };

    const {
      persona,
      velocity,
      probability = 0.5,
      userId = 'anonymous-user-123',
      hmm,
      metrics,
    } = body;

    // 1. Generate personalized context using the full behavioral fingerprint
    const context = await aiService.generatePersonaContext(
      persona,
      velocity,
      probability,
      hmm,
      metrics
    );

    // 2. Persist the enriched persona DNA
    await databaseService.saveUserPersona(userId, persona, probability, hmm, metrics);

    return NextResponse.json({ context });
  } catch (error) {
    console.error('Agent route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate context or save profile' },
      { status: 500 }
    );
  }
}

