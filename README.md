# SOAI: Self-Optimizing Agentic Interface

SOAI is a **behavioral intelligence runtime** — a pipeline that reads a user's digital body language (mouse velocity, scroll patterns, touch pressure, click frequency), computes a multi-dimensional intent vector, classifies the user into a persona, and automatically adapts the UI into the optimal experience.

## 🏗️ Architecture: The Microkernel

SOAI is built as a microkernel. The core (`@soai/core`) is a lightweight runtime that provides an event bus, a middleware pipeline, and a plugin system. Everything else — sensors, reasoning engines, agents, and persistence — are pluggable modules.

### The Pipeline
```
Browser Events → Sensors → Signal Stream → Intent Engine → Persona Resolver → [Agents, UI Adapters, Persistence]
                                              ↕ middleware pipeline ↕
```

## 📦 Package Map

| Package | Layer | Description |
|---|---|---|
| [`@soai/core`](packages/core) | 0 | Event bus + Middleware + Plugin manager |
| [`@soai/types`](packages/types) | 0 | Type-safe event contracts and shared interfaces |
| [`@soai/math`](packages/math) | 1 | Rust/WASM optimized signal processing with TS fallback |
| [`@soai/sensors`](packages/sensors) | 2 | 8+ browser sensors (Mouse, Scroll, Dwell, etc.) |
| [`@soai/intent`](packages/intent) | 3 | Multi-dimensional intent vector computation |
| [`@soai/personas`](packages/personas) | 3 | Persona classification with hysteresis |
| [`@soai/agents`](packages/agents) | 4 | Agent protocol, arbitration, and composition |
| [`@soai/react`](packages/react) | 7 | Framework bindings (Provider, AdaptiveContainer, Hooks) |
| [`@soai/react-devtools`](packages/react-devtools) | 7 | Real-time inspector and vector visualizer |
| [`@soai/cli`](packages/cli) | 8 | Project scaffolding and DX tooling |
| [`soai`](packages/soai) | - | Meta-package: auto-configured default kernel |

## 🚀 Quickstart

Install the meta-package:
```bash
npm install soai
```

Wrap your application in the `SoaiProvider`:

```tsx
// app/layout.tsx
import { SoaiProvider } from '@soai/react';
import { soai } from 'soai';

export default function Layout({ children }) {
  return (
    <SoaiProvider instance={soai}>
      {children}
    </SoaiProvider>
  );
}
```

Implement an adaptive component:

```tsx
// app/page.tsx
import { AdaptiveContainer } from '@soai/react';
import { lazy } from 'react';

const AnalyticalView = lazy(() => import('./views/Analytical'));
const StorytellerView = lazy(() => import('./views/Storyteller'));

export default function Home() {
  return (
    <AdaptiveContainer
      id="hero"
      variants={{
        analytical: AnalyticalView,
        storyteller: StorytellerView,
      }}
    />
  );
}
```

## 🛠️ Development

This is a monorepo managed by `pnpm` and `turbo`.

### Build
```bash
pnpm build
```

### Run Demo
```bash
pnpm dev --filter demo
```

## 📜 License

MIT
