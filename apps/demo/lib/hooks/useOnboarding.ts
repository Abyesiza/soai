'use client';

import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'soai:onboarding_complete';

export function useOnboarding() {
    // null = hydrating (SSR), false = first visit, true = returning
    const [hasCompleted, setHasCompleted] = useState<boolean | null>(null);

    useEffect(() => {
        setHasCompleted(localStorage.getItem(ONBOARDING_KEY) === 'true');
    }, []);

    const completeOnboarding = useCallback(() => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setHasCompleted(true);
    }, []);

    const resetOnboarding = useCallback(() => {
        localStorage.removeItem(ONBOARDING_KEY);
        setHasCompleted(false);
    }, []);

    return { hasCompleted, completeOnboarding, resetOnboarding };
}
