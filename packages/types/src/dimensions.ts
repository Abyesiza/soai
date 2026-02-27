export interface IntentDimensions {
    taskUrgency?: number;
    emotionalEngagement?: number;
    informationDensityPreference?: number;
    [key: string]: number | undefined;
}

export interface IntentVectorState {
    raw: IntentDimensions;
    smoothed: IntentDimensions;
    confidence: number;
    timestamp: number;
}
