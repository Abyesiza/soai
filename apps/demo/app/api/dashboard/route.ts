import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getModel, type ModelProvider } from '@/lib/ai/models';

const DashboardSchema = z.object({
    title: z.string().describe('Dashboard title'),
    subtitle: z.string().describe('One-line dashboard subtitle'),
    metrics: z.array(z.object({
        label: z.string(),
        value: z.string().describe('Formatted display value, e.g. "$1.2M" or "94%"'),
        change: z.string().describe('Change text like "+12%" or "-3.2%" or "" if none'),
        changeDirection: z.enum(['up', 'down', 'flat']),
    })).min(3).max(6),
    charts: z.array(z.object({
        title: z.string(),
        type: z.enum(['bar', 'line', 'donut']),
        data: z.array(z.object({
            label: z.string(),
            value: z.number(),
        })).min(3).max(8),
    })).min(1).max(3),
    tables: z.array(z.object({
        title: z.string(),
        columns: z.array(z.object({
            key: z.string(),
            label: z.string(),
        })).min(2).max(6),
        rows: z.array(
            z.array(z.string()).describe('Cell values in the same order as columns')
        ).min(3).max(10),
    })).min(0).max(2),
});

const PERSONA_PROMPTS: Record<string, string> = {
    researcher: 'Generate a data-dense dashboard. Use 5-6 detailed metrics with precise numbers. Include 2-3 charts (prefer line charts with many data points). Include 1-2 tables with full column details and 8-10 rows. Use technical metric labels.',
    buyer: 'Generate an impact-focused dashboard. Use 3-4 large headline metrics with bold percentages and dollar amounts. Include 1 donut chart showing distribution. Minimize tables (0-1 with max 3 rows). Focus on ROI, revenue, and growth.',
    browser: 'Generate a balanced dashboard. Use 4 metrics with clean formatting. Include 2 charts (one bar, one line). Include 1 summary table with top 5 rows. Keep it scannable and informative.',
};

export async function POST(req: Request) {
    try {
        const { prompt, persona = 'browser', provider } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const personaHint = PERSONA_PROMPTS[persona] ?? PERSONA_PROMPTS.browser;
        const model = getModel(provider as ModelProvider | undefined);

        const { object } = await generateObject({
            model,
            schema: DashboardSchema,
            prompt: `You are a dashboard generator. Create a realistic, data-rich dashboard specification based on this user request:

"${prompt}"

${personaHint}

Generate realistic-looking sample data. Use plausible numbers, names, and percentages. Format metric values for display (e.g. "$2.4M", "12,847", "94.2%").
For tables, each row is an array of string values matching the columns array order.`,
        });

        return NextResponse.json({ dashboard: object });
    } catch (error) {
        console.error('Dashboard generation error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to generate dashboard', detail: message },
            { status: 500 }
        );
    }
}
