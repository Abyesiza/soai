import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Class handling database operations for user DNA and persona persistence.
 */
export class DatabaseService {
    private client: SupabaseClient | null = null;

    constructor() {
        // These would normally be required, but we allow empty for basic initialization
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

        if (supabaseUrl && supabaseKey) {
            this.client = createClient(supabaseUrl, supabaseKey);
        } else {
            console.warn("Supabase URL or Key is missing. DatabaseService initialized in offline mode.");
        }
    }

    /**
     * Stores the calculated persona vector for a user to maintain session persistence.
     */
    public async saveUserPersona(userId: string, persona: string, probability: number): Promise<boolean> {
        if (!this.client) return false;

        try {
            const { error } = await this.client
                .from('user_dna')
                .upsert(
                    { user_id: userId, persona, probability, last_updated: new Date().toISOString() },
                    { onConflict: 'user_id' }
                );

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Database Error:', error);
            return false;
        }
    }
}

export const databaseService = new DatabaseService();
