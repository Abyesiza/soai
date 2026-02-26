import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * Class representing the AI Orchestrator.
 * Responsible for interacting with Vercel AI SDK and Gemini to generate dynamic context.
 */
export class AIService {
    private modelName: string;

    constructor(modelName: string = 'gemini-2.5-flash') {
        this.modelName = modelName;
    }

    /**
     * Generates a context-aware response based on the calculated user persona.
     */
    public async generatePersonaContext(persona: string, intentVelocity: number): Promise<string> {
        try {
            const { text } = await generateText({
                model: google(this.modelName),
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
