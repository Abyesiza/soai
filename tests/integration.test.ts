/**
 * SOAI Integration Test Suite
 *
 * Tests the full pipeline: signals → intent → persona → agents → state
 * Run with: npx tsx tests/integration.test.ts
 */

import { Soai } from '../packages/core/src/Soai';
import { IntentEngine } from '../packages/intent/src/IntentEngine';
import { PersonaResolver } from '../packages/personas/src/PersonaResolver';
import { CollaborativeAgent } from '../packages/agent-collaborative/src/index';
import { FallbackMathEngine } from '../packages/math/src/fallback';
import { createTestKernel, mockSignals, fixtures } from '../packages/testing/src/index';
import type { SoaiEventMap, SoaiEvent } from '../packages/types/src/index';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
    if (condition) {
        passed++;
        console.log(`  ✓ ${message}`);
    } else {
        failed++;
        console.error(`  ✗ ${message}`);
    }
}

function section(name: string) {
    console.log(`\n━━━ ${name} ━━━`);
}

// Utility: wait for async middleware pipeline to settle
function tick(ms = 50): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
}

// ═══════════════════════════════════════════════
// TEST 1: Core Kernel — EventBus + Middleware
// ═══════════════════════════════════════════════
async function testCoreKernel() {
    section('Core Kernel: EventBus + Middleware');

    const kernel = new Soai({ debug: false });
    const received: string[] = [];

    // Wildcard listener
    kernel.events.on('*', ((event: any) => {
        received.push(event.type);
    }) as any);

    // Specific listener
    let personaPayload: any = null;
    kernel.events.on('persona:change', (payload) => {
        personaPayload = payload;
    });

    // Test direct bus emission
    kernel.events.emit('persona:change', {
        from: 'neutral',
        to: 'buyer',
        confidence: 0.8,
        timestamp: Date.now(),
    });

    assert(received.includes('persona:change'), 'Wildcard handler received persona:change');
    assert(personaPayload !== null, 'Specific handler received persona:change');
    assert(personaPayload?.to === 'buyer', 'Payload.to is correct');
    assert(personaPayload?.confidence === 0.8, 'Payload.confidence is correct');

    // Test unsubscribe
    const unsub = kernel.events.on('persona:stable', () => {
        personaPayload = 'should not update';
    });
    unsub();
    kernel.events.emit('persona:stable', {
        persona: 'buyer',
        stableSince: Date.now(),
        durationMs: 5000,
    });
    assert(personaPayload?.to === 'buyer', 'Unsubscribed handler not called');

    // Test middleware blocking
    let middlewareBlocked = false;
    const kernel2 = new Soai({ debug: false });
    kernel2.middleware((event, next) => {
        if (event.type === 'signal:mouse') {
            middlewareBlocked = true;
            // Don't call next() — block the event
            return;
        }
        next();
    });

    let mouseReceived = false;
    kernel2.events.on('signal:mouse', () => {
        mouseReceived = true;
    });

    kernel2.emit('signal:mouse', {
        x: 100, y: 100, velocity: 1, straightness: 1, timestamp: Date.now(),
    });
    await tick();

    assert(middlewareBlocked, 'Middleware intercepted signal:mouse');
    assert(!mouseReceived, 'Blocked event did not reach EventBus');

    // Test middleware pass-through
    let lifecycleReceived = false;
    kernel2.events.on('lifecycle:init', () => {
        lifecycleReceived = true;
    });
    kernel2.emit('lifecycle:init', {});
    await tick();
    assert(lifecycleReceived, 'Non-blocked event passed through middleware');
}

// ═══════════════════════════════════════════════
// TEST 2: Math Engine — EWMA + Classification
// ═══════════════════════════════════════════════
async function testMathEngine() {
    section('Math Engine: EWMA + Centroid Classification');

    const math = new FallbackMathEngine();

    // EWMA smoothing
    const current = new Float64Array([1.0, 0.0, 0.5]);
    const previous = new Float64Array([0.0, 1.0, 0.5]);
    const alpha = 0.5;
    const smoothed = math.ewma(current, previous, alpha);

    assert(Math.abs(smoothed[0] - 0.5) < 0.001, `EWMA[0]: ${smoothed[0]} ≈ 0.5`);
    assert(Math.abs(smoothed[1] - 0.5) < 0.001, `EWMA[1]: ${smoothed[1]} ≈ 0.5`);
    assert(Math.abs(smoothed[2] - 0.5) < 0.001, `EWMA[2]: ${smoothed[2]} ≈ 0.5`);

    // Centroid distance
    const v = new Float64Array([0.5, 0.5, 0.5]);
    const c = new Float64Array([1.0, 0.0, 0.5]);
    const dist = math.centroidDistance(v, c);
    const expected = Math.sqrt(0.25 + 0.25 + 0); // 0.707...
    assert(Math.abs(dist - expected) < 0.001, `Centroid distance: ${dist.toFixed(4)} ≈ ${expected.toFixed(4)}`);

    // Persona classification with ecommerce centroids
    const centroids = new Map<string, Float64Array>();
    centroids.set('buyer', new Float64Array([0.9, 0.3, 0.7]));
    centroids.set('researcher', new Float64Array([0.6, 0.9, 0.8]));
    centroids.set('browser', new Float64Array([0.2, 0.5, 0.3]));

    // Neutral vector [0.5, 0.5, 0.5] should be closest to 'browser'
    const neutralResult = math.classifyPersona(new Float64Array([0.5, 0.5, 0.5]), centroids);
    assert(neutralResult.persona === 'browser', `Neutral vector → ${neutralResult.persona} (expected browser)`);
    assert(neutralResult.confidence > 0 && neutralResult.confidence <= 1, `Confidence in valid range: ${neutralResult.confidence.toFixed(3)}`);

    // High urgency vector should be closest to 'buyer'
    const urgentResult = math.classifyPersona(new Float64Array([0.95, 0.25, 0.75]), centroids);
    assert(urgentResult.persona === 'buyer', `Urgent vector → ${urgentResult.persona} (expected buyer)`);

    // High engagement vector should be closest to 'researcher'
    const engagedResult = math.classifyPersona(new Float64Array([0.55, 0.95, 0.85]), centroids);
    assert(engagedResult.persona === 'researcher', `Engaged vector → ${engagedResult.persona} (expected researcher)`);
}

// ═══════════════════════════════════════════════
// TEST 3: IntentEngine — Signal → Vector
// ═══════════════════════════════════════════════
async function testIntentEngine() {
    section('IntentEngine: Signal → Intent Vector');

    const kernel = createTestKernel({
        plugins: [new IntentEngine()],
    });

    await kernel.start();
    await tick();

    // Emit a sequence of high-velocity mouse signals
    for (let i = 0; i < 5; i++) {
        kernel.emit('signal:mouse', {
            x: i * 200,
            y: i * 50,
            velocity: 4.5 + i * 0.5,
            straightness: 0.9,
            timestamp: Date.now() + i * 50,
        });
        await tick(20);
    }

    // Emit scroll signals too
    for (let i = 0; i < 3; i++) {
        kernel.emit('signal:scroll', {
            y: i * 500,
            velocity: 3.0 + i * 0.5,
            direction: 'down' as const,
            timestamp: Date.now() + 300 + i * 50,
        });
        await tick(20);
    }

    await tick(100);

    const intentEvents = kernel.events.emitted('intent:update');
    assert(intentEvents.length > 0, `IntentEngine emitted ${intentEvents.length} intent:update events`);

    if (intentEvents.length > 0) {
        const latest = intentEvents[intentEvents.length - 1].payload;
        assert('smoothed' in latest, 'intent:update has smoothed field');
        assert('raw' in latest, 'intent:update has raw field');

        const smoothed = latest.smoothed;
        assert(typeof smoothed.taskUrgency === 'number', `taskUrgency computed: ${smoothed.taskUrgency?.toFixed(3)}`);
        assert(typeof smoothed.emotionalEngagement === 'number', `emotionalEngagement computed: ${smoothed.emotionalEngagement?.toFixed(3)}`);
        assert(typeof smoothed.informationDensityPreference === 'number', `informationDensityPreference computed: ${smoothed.informationDensityPreference?.toFixed(3)}`);

        // With high velocity, taskUrgency should be elevated
        assert((smoothed.taskUrgency ?? 0) > 0.3, `High velocity → taskUrgency > 0.3 (got ${smoothed.taskUrgency?.toFixed(3)})`);
    }

    await kernel.stop();
}

// ═══════════════════════════════════════════════
// TEST 4: PersonaResolver — Vector → Persona
// ═══════════════════════════════════════════════
async function testPersonaResolver() {
    section('PersonaResolver: Vector → Persona Classification');

    // Test with ecommerce centroids
    const resolver = new PersonaResolver({
        centroids: {
            buyer: { taskUrgency: 0.9, emotionalEngagement: 0.3, informationDensityPreference: 0.7 },
            researcher: { taskUrgency: 0.6, emotionalEngagement: 0.9, informationDensityPreference: 0.8 },
            browser: { taskUrgency: 0.2, emotionalEngagement: 0.5, informationDensityPreference: 0.3 },
        },
        minStableMs: 100, // Shortened for testing
        switchConfidenceThreshold: 0.2,
    });

    const kernel = createTestKernel({
        plugins: [new IntentEngine(), resolver],
    });

    await kernel.start();
    await tick(50);

    // Check initial persona — should be 'browser' (closest to neutral vector)
    const initialPersona = kernel.getState<string>('persona');
    assert(initialPersona === 'browser', `Initial persona: ${initialPersona} (expected browser)`);

    const initialChanges = kernel.events.emitted('persona:change');
    assert(initialChanges.length > 0, `Initial persona:change emitted (${initialChanges.length} events)`);
    if (initialChanges.length > 0) {
        assert(initialChanges[0].payload.to === 'browser', `Initial change to: ${initialChanges[0].payload.to}`);
    }

    // Now send sustained high-velocity signals to push toward 'buyer'
    for (let round = 0; round < 10; round++) {
        kernel.emit('signal:mouse', {
            x: round * 100, y: round * 20,
            velocity: 5.0, straightness: 0.95,
            timestamp: Date.now() + round * 50,
        });
        kernel.emit('signal:scroll', {
            y: round * 300, velocity: 4.0,
            direction: 'down' as const,
            timestamp: Date.now() + round * 50 + 10,
        });
        kernel.emit('signal:click', {
            x: round * 100, y: round * 20,
            target: 'button', frequency: 2.0,
            timestamp: Date.now() + round * 50 + 20,
        });
        await tick(120); // > minStableMs to allow hysteresis to pass
    }

    await tick(200);

    const allChanges = kernel.events.emitted('persona:change');
    const finalPersona = kernel.getState<string>('persona');
    console.log(`    Total persona:change events: ${allChanges.length}`);
    console.log(`    Final persona: ${finalPersona}`);
    for (const evt of allChanges) {
        console.log(`    → ${evt.payload.from} → ${evt.payload.to} (confidence: ${evt.payload.confidence.toFixed(3)})`);
    }

    assert(allChanges.length >= 1, 'At least one persona:change event emitted');

    await kernel.stop();
}

// ═══════════════════════════════════════════════
// TEST 5: CollaborativeAgent — Suggestions
// ═══════════════════════════════════════════════
async function testCollaborativeAgent() {
    section('CollaborativeAgent: Suggestion Lifecycle');

    const agent = new CollaborativeAgent({
        cooldownMs: 100,
        maxDismissals: 2,
        confidenceGate: 0.3,
    });

    const kernel = createTestKernel({ plugins: [agent] });
    await kernel.start();
    await tick();

    // Simulate a persona:change with sufficient confidence
    kernel.emit('persona:change', {
        from: 'neutral',
        to: 'buyer',
        confidence: 0.7,
        timestamp: Date.now(),
    });
    await tick();

    const suggestions = kernel.events.emitted('agent:suggestion');
    assert(suggestions.length === 1, `First persona:change → 1 suggestion (got ${suggestions.length})`);
    if (suggestions.length > 0) {
        assert(suggestions[0].payload.suggestedPersona === 'buyer', `Suggestion for persona: ${suggestions[0].payload.suggestedPersona}`);
        assert(suggestions[0].payload.message.includes('buyer'), 'Suggestion message mentions persona');
    }

    // Second persona:change should NOT trigger (hasSuggestedThisSession = true)
    kernel.emit('persona:change', {
        from: 'buyer',
        to: 'researcher',
        confidence: 0.8,
        timestamp: Date.now(),
    });
    await tick();

    assert(kernel.events.emitted('agent:suggestion').length === 1, 'No duplicate suggestion on second change');

    // Dismiss → should allow retry after cooldown
    kernel.emit('user:dismiss', { suggestionType: 'persona-switch' });
    await tick(150); // Wait for cooldown

    kernel.emit('persona:change', {
        from: 'researcher',
        to: 'browser',
        confidence: 0.65,
        timestamp: Date.now(),
    });
    await tick();

    assert(kernel.events.emitted('agent:suggestion').length === 2, `After dismiss + cooldown: 2 suggestions (got ${kernel.events.emitted('agent:suggestion').length})`);

    // Two more dismissals → agent should disable
    kernel.emit('user:dismiss', { suggestionType: 'persona-switch' });
    await tick(150);

    // This should NOT trigger — agent disabled after 2 dismissals
    kernel.emit('persona:change', {
        from: 'browser',
        to: 'buyer',
        confidence: 0.9,
        timestamp: Date.now(),
    });
    await tick();

    assert(kernel.events.emitted('agent:suggestion').length === 2, `Agent disabled after maxDismissals: still 2 suggestions (got ${kernel.events.emitted('agent:suggestion').length})`);

    await kernel.stop();
}

// ═══════════════════════════════════════════════
// TEST 6: Testing Harness — Fixtures
// ═══════════════════════════════════════════════
async function testFixtures() {
    section('Testing Harness: Signal Fixtures');

    const kernel = createTestKernel({
        plugins: [new IntentEngine()],
    });
    await kernel.start();
    await tick();

    await mockSignals(kernel, 'fast-scan');
    await tick(100);

    const afterFast = kernel.events.emitted('intent:update');
    assert(afterFast.length > 0, `fast-scan fixture → ${afterFast.length} intent:update events`);

    await kernel.stop();

    // Test slow-read fixture
    const kernel2 = createTestKernel({
        plugins: [new IntentEngine()],
    });
    await kernel2.start();
    await tick();

    await mockSignals(kernel2, 'slow-read');
    await tick(100);

    const afterSlow = kernel2.events.emitted('intent:update');
    assert(afterSlow.length > 0, `slow-read fixture → ${afterSlow.length} intent:update events`);

    await kernel2.stop();
}

// ═══════════════════════════════════════════════
// TEST 7: Full Pipeline — Signal → Persona (E2E)
// ═══════════════════════════════════════════════
async function testFullPipeline() {
    section('Full Pipeline: Signal → Intent → Persona → Agent (E2E)');

    const kernel = createTestKernel({
        plugins: [
            new IntentEngine(),
            new PersonaResolver({
                centroids: {
                    buyer: { taskUrgency: 0.9, emotionalEngagement: 0.3, informationDensityPreference: 0.7 },
                    researcher: { taskUrgency: 0.6, emotionalEngagement: 0.9, informationDensityPreference: 0.8 },
                    browser: { taskUrgency: 0.2, emotionalEngagement: 0.5, informationDensityPreference: 0.3 },
                },
                minStableMs: 50,
                switchConfidenceThreshold: 0.2,
            }),
            new CollaborativeAgent({
                cooldownMs: 100,
                maxDismissals: 3,
                confidenceGate: 0.25,
            }),
        ],
    });

    await kernel.start();
    await tick(50);

    console.log(`    Initial persona: ${kernel.getState('persona')}`);

    // Send sustained high-velocity signals (buyer behavior)
    for (let i = 0; i < 15; i++) {
        kernel.emit('signal:mouse', {
            x: i * 80, y: i * 20,
            velocity: 5.5, straightness: 0.92,
            timestamp: Date.now() + i * 30,
        });
        kernel.emit('signal:scroll', {
            y: i * 400, velocity: 4.5,
            direction: 'down' as const,
            timestamp: Date.now() + i * 30 + 10,
        });
        kernel.emit('signal:click', {
            x: i * 80, y: i * 20,
            target: 'cta', frequency: 2.0,
            timestamp: Date.now() + i * 30 + 20,
        });
        await tick(80);
    }

    await tick(200);

    const intentEvents = kernel.events.emitted('intent:update');
    const personaChanges = kernel.events.emitted('persona:change');
    const suggestions = kernel.events.emitted('agent:suggestion');

    console.log(`    Intent updates: ${intentEvents.length}`);
    console.log(`    Persona changes: ${personaChanges.length}`);
    console.log(`    Agent suggestions: ${suggestions.length}`);

    assert(intentEvents.length > 0, 'Pipeline produced intent:update events');
    assert(personaChanges.length >= 1, 'Pipeline produced persona:change events');

    // Log full pipeline trace
    const allEvents = kernel.events.all();
    const eventTypes = new Set(allEvents.map(e => e.type));
    console.log(`    Unique event types seen: ${[...eventTypes].join(', ')}`);

    assert(eventTypes.has('lifecycle:init'), 'lifecycle:init emitted');
    assert(eventTypes.has('lifecycle:ready'), 'lifecycle:ready emitted');
    assert(eventTypes.has('signal:mouse'), 'signal:mouse recorded');
    assert(eventTypes.has('intent:update'), 'intent:update in pipeline');
    assert(eventTypes.has('persona:change'), 'persona:change in pipeline');

    await kernel.stop();
}

// ═══════════════════════════════════════════════
// TEST 8: Plugin Dependency Resolution
// ═══════════════════════════════════════════════
async function testPluginDependencies() {
    section('Plugin Manager: Dependency Resolution');

    const installOrder: string[] = [];

    const pluginA = {
        name: 'plugin-a',
        version: '1.0.0',
        dependencies: ['plugin-b'],
        install: () => { installOrder.push('plugin-a'); },
    };

    const pluginB = {
        name: 'plugin-b',
        version: '1.0.0',
        install: () => { installOrder.push('plugin-b'); },
    };

    const kernel = new Soai({ debug: false });
    // Register in reverse order — PluginManager should still install B before A
    kernel.use(pluginA);
    kernel.use(pluginB);
    await kernel.start();

    assert(installOrder.indexOf('plugin-b') < installOrder.indexOf('plugin-a'),
        `plugin-b installed before plugin-a: [${installOrder.join(', ')}]`);

    await kernel.stop();
}

// ═══════════════════════════════════════════════
// TEST 9: createSoai Meta-Package
// ═══════════════════════════════════════════════
async function testCreateSoai() {
    section('Meta-Package: createSoai()');

    const { createSoai } = await import('../packages/soai/src/index');

    const soai = createSoai({ preset: 'ecommerce', debug: false });
    assert(soai !== null && typeof soai === 'object' && typeof soai.start === 'function', 'createSoai returns Soai-like instance');

    // Start and check initial state
    await soai.start();
    await tick(100);

    const persona = soai.getState<string>('persona');
    console.log(`    Initial ecommerce persona: ${persona}`);
    assert(persona === 'browser', `Ecommerce initial persona: ${persona} (expected browser)`);

    await soai.stop();
}

// ═══════════════════════════════════════════════
// Run all tests
// ═══════════════════════════════════════════════
async function main() {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║   SOAI Integration Test Suite             ║');
    console.log('╚═══════════════════════════════════════════╝');

    try {
        await testCoreKernel();
        await testMathEngine();
        await testIntentEngine();
        await testPersonaResolver();
        await testCollaborativeAgent();
        await testFixtures();
        await testFullPipeline();
        await testPluginDependencies();
        await testCreateSoai();
    } catch (err) {
        console.error('\n  FATAL ERROR:', err);
        failed++;
    }

    console.log('\n═══════════════════════════════════════════');
    console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
    console.log('═══════════════════════════════════════════');

    if (failed > 0) {
        process.exit(1);
    }
}

main();
