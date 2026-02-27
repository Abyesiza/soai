import { IntentDimensions } from './dimensions';

export interface PersonaCentroid {
    dimensions: IntentDimensions;
}

export type PersonaType = string;

export interface PersonaConfig {
    centroids: Map<PersonaType, PersonaCentroid>;
}
