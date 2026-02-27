import { aiService } from '@/lib/services/AIService';
import { databaseService } from '@/lib/services/DatabaseService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { persona, velocity, probability, userId = 'anonymous-user-123' } = await req.json();

        // 1. Generate personalized context via the AIService
        const context = await aiService.generatePersonaContext(persona, velocity);

        // 2. Persist the persona DNA so they get the same experience on return
        await databaseService.saveUserPersona(userId, persona, probability);

        return NextResponse.json({ context });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate context or save profile' }, { status: 500 });
    }
}
