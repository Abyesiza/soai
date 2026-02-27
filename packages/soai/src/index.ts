import { Soai } from '@soai/core';
import { logger } from '@soai/core';
import { MouseSensor, ScrollSensor, TouchSensor, ClickSensor, DwellSensor, IdleSensor, VisibilitySensor, ViewportSensor } from '@soai/sensors';
import { IntentEngine } from '@soai/intent';
import { PersonaResolver } from '@soai/personas';
import { CollaborativeAgent } from '@soai/agent-collaborative';
import { LocalPersistPlugin } from '@soai/persist-local';

export interface CreateSoaiConfig {
    debug?: boolean;
    preset?: 'ecommerce' | 'media' | 'saas' | 'documentation';
    personas?: Record<string, Record<string, number>>;
    plugins?: any[];
}

/**
 * Create a fully-configured SOAI kernel with sensible defaults.
 */
export function createSoai(config: CreateSoaiConfig = {}): Soai {
    const kernel = new Soai({ debug: config.debug ?? false });

    // Middleware
    if (config.debug) {
        kernel.middleware(logger());
    }

    // Sensors
    kernel.use(new MouseSensor());
    kernel.use(new ScrollSensor());
    kernel.use(new TouchSensor());
    kernel.use(new ClickSensor());
    kernel.use(new DwellSensor());
    kernel.use(new IdleSensor());
    kernel.use(new ViewportSensor());
    kernel.use(new VisibilitySensor());

    // Intent
    kernel.use(new IntentEngine());

    // Personas
    const personaConfig = config.personas
        ? { centroids: config.personas }
        : getPresetCentroids(config.preset);
    kernel.use(new PersonaResolver(personaConfig as any));

    // Collaborative agent
    kernel.use(new CollaborativeAgent());

    // Persistence
    kernel.use(new LocalPersistPlugin());

    // Additional plugins
    if (config.plugins) {
        for (const plugin of config.plugins) {
            kernel.use(plugin);
        }
    }

    return kernel;
}

function getPresetCentroids(preset?: string) {
    switch (preset) {
        case 'ecommerce':
            return {
                centroids: {
                    buyer: { taskUrgency: 0.9, emotionalEngagement: 0.3, informationDensityPreference: 0.7 },
                    researcher: { taskUrgency: 0.6, emotionalEngagement: 0.9, informationDensityPreference: 0.8 },
                    browser: { taskUrgency: 0.2, emotionalEngagement: 0.5, informationDensityPreference: 0.3 },
                },
            };
        case 'media':
            return {
                centroids: {
                    skimmer: { taskUrgency: 0.8, emotionalEngagement: 0.2, informationDensityPreference: 0.3 },
                    reader: { taskUrgency: 0.3, emotionalEngagement: 0.8, informationDensityPreference: 0.6 },
                    engager: { taskUrgency: 0.4, emotionalEngagement: 0.9, informationDensityPreference: 0.5 },
                },
            };
        case 'saas':
            return {
                centroids: {
                    evaluator: { taskUrgency: 0.7, emotionalEngagement: 0.6, informationDensityPreference: 0.9 },
                    explorer: { taskUrgency: 0.4, emotionalEngagement: 0.7, informationDensityPreference: 0.5 },
                    decider: { taskUrgency: 0.9, emotionalEngagement: 0.3, informationDensityPreference: 0.8 },
                },
            };
        case 'documentation':
            return {
                centroids: {
                    scanner: { taskUrgency: 0.8, emotionalEngagement: 0.2, informationDensityPreference: 0.4 },
                    learner: { taskUrgency: 0.3, emotionalEngagement: 0.8, informationDensityPreference: 0.7 },
                    implementer: { taskUrgency: 0.9, emotionalEngagement: 0.4, informationDensityPreference: 0.9 },
                },
            };
        default:
            return undefined; // PersonaResolver uses its own defaults
    }
}

// Pre-configured default instance
export const soai = createSoai();
