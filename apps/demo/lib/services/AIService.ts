import { generateText } from 'ai';
import { getModel, type ModelProvider } from '@/lib/ai/models';

export class AIService {
    private provider: ModelProvider;

    constructor(provider: ModelProvider = 'groq') {
        this.provider = provider;
    }

    public async generatePersonaContext(persona: string, intentVelocity: number): Promise<string> {
        try {
            const { text } = await generateText({
                model: getModel(this.provider),
                system: `You are the AI Orchestrator for a Self-Optimizing Agentic Interface.
        The current user's detected persona is '${persona}' based on an interaction velocity of ${intentVelocity}.
        Provide a short personalized greeting or UI context based on this.`,
                prompt: `Hello, please generate the context.`,
            });
            return text;
        } catch (error) {
            console.error("AI Generation Error", error);
            return "Welcome to the site.";
        }
    }
}

export const aiService = new AIService();
