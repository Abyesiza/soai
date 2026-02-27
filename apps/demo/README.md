# SOAI Demo Application

This is the official showcase application for the **SOAI (Self-Optimizing Agentic Interface)** microkernel architecture.

## 🌟 Features

- **Microkernel Integration**: Powered by `@soai/core` and linked via `@soai/react`.
- **Adaptive UI**: Uses `AdaptiveContainer` to dynamically switch between Analytical, Storyteller, and Neutral views based on real-time behavior.
- **Real-time Sense**: Connects to browser sensors (Mouse, Scroll) via `@soai/sensors`.
- **DevTools**: Integrated `@soai/react-devtools` for inspecting the intent vector and event stream.
- **Server-Side Agents**: Connects to `@soai/transport` for server-orchestrated reasoning (Gemini, Mercury).

## 🚀 Getting Started

From the root of the monorepo, run:

```bash
pnpm dev --filter demo
```

Visit `http://localhost:3000` to interact with the system.

### Debugging

Look for the **SOAI DevTools** icon in the bottom-right corner of the application to inspect the underlying behavioral intelligence pipeline.

## 🧱 Key Components

- `app/layout.tsx`: Configures the `SoaiShell` (Client-side provider).
- `app/page.tsx`: Implements the `AdaptiveContainer` for the main hero section.
- `lib/soai.ts`: Exports the pre-configured SOAI kernel instance.
- `components/soai-shell.tsx`: Handles the non-serializable kernel instance for React context.
