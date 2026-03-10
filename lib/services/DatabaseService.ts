import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { BehavioralMetrics, HMMModelState } from '@/types';

/**
 * Database service for persisting user persona DNA.
 *
 * Stores the full HMM model snapshot and behavioral metrics alongside the
 * persona label so that returning users resume with their calibrated model
 * rather than starting from the uninformed prior.
 */
export class DatabaseService {
  private client: SupabaseClient | null = null;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

    if (supabaseUrl && supabaseKey) {
      this.client = createClient(supabaseUrl, supabaseKey);
    } else {
      console.warn('Supabase credentials missing — DatabaseService in offline mode.');
    }
  }

  /**
   * Upserts the user's behavioral DNA record.
   *
   * @param userId      User identifier
   * @param persona     Collapsed persona label
   * @param probability HMM-derived intent probability
   * @param hmm         Full HMM model snapshot (serialised as JSON)
   * @param metrics     Statistical behavioral metrics snapshot
   */
  public async saveUserPersona(
    userId:      string,
    persona:     string,
    probability: number,
    hmm?:        HMMModelState,
    metrics?:    BehavioralMetrics
  ): Promise<boolean> {
    if (!this.client) return false;

    try {
      const { error } = await this.client
        .from('user_dna')
        .upsert(
          {
            user_id:      userId,
            persona,
            probability,
            hmm_state:    hmm     ? JSON.stringify(hmm)     : undefined,
            metrics:      metrics ? JSON.stringify(metrics) : undefined,
            last_updated: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('DatabaseService error:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();

