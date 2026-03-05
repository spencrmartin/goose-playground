# Goose 2.0 Component Playground

A comprehensive design system and component library for Goose 2.0, showcasing all UI components used in the desktop application.

## Overview
<img width="1585" height="969" alt="Screenshot 2026-03-05 at 12 28 16 PM" src="https://github.com/user-attachments/assets/699c1405-a7aa-45f2-aeec-d7e9c0840d80" />

This playground provides interactive previews of all components in the Goose 2.0 design system, including:

- **Full App Preview** — Complete mockups of the app at different viewport sizes
- **Typography** — Font scales, weights, and text styles
- **Colors** — Background, text, status, and accent colors
- **Buttons & Inputs** — Button variants, sizes, states, badges, and inputs
- **Tool Call Pills** — Status indicators for tool executions
- **Subagent Flow** — Gitflow-style visualization of parallel subagent delegation
- **Infinite Canvas** — Zoomable/pannable conversation space with thread selection
- **Thinking Block** — Collapsible AI reasoning display
- **Message Bubbles** — User and agent chat messages
- **Inline Pills** — Rich inline references (links, files, issues, code, commands)
- **Artifact Cards** — File trees, code blocks, and document outputs
- **App Cards** — Connected app status and data displays
- **Chat Input** — Message composition with model info and extensions
- **Session Tabs** — Tab bar with PixelBlast status backgrounds
- **Sidebar** — Navigation with condensed, tiles, and collapsed modes
- **Command Screen** — Spotlight-style command palette

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

## Key Components

### InfiniteCanvas

The InfiniteCanvas component provides a zoomable/pannable conversation space where:
- Main conversation thread runs vertically
- Subagent threads branch to the right as parallel columns
- Click threads to select/target them for chat input
- Auto-centers on selected thread
- Supports `hideControls` prop for mini preview mode

```tsx
<InfiniteCanvas
  messages={[...]}
  delegations={[...]}
  onSend={(msg, threadId) => {...}}
  selectedThread={selectedThread}
  onThreadSelect={setSelectedThread}
  hideControls={false}
/>
```

### SubagentFlow

Gitflow-style visualization showing parallel task delegation:

```tsx
<SubagentFlow
  instruction="Research and review in parallel"
  branches={[
    { id: 'research', name: 'Research', status: 'completed', tools: [...] },
    { id: 'review', name: 'Code Review', status: 'running', tools: [...] },
  ]}
  mergeStatus="running"
/>
```

### ChatInput

Message composition with optional model info and extension badges:

```tsx
<ChatInput
  modelName="Claude 3.5 Sonnet"
  tokenCount={1247}
  extensions={['developer', 'brian', 'pointa']}
  onSend={(msg) => {...}}
/>
```

## Design Tokens

The design system uses CSS custom properties for theming. Key tokens include:

- `--background`, `--card`, `--muted`, `--secondary` — Background colors
- `--foreground`, `--muted-foreground` — Text colors
- `--primary`, `--user-accent` — Accent colors
- `--status-success`, `--status-warning`, `--status-error`, `--status-info` — Status colors
- `--border`, `--ring` — Border and focus ring colors

## File Structure

```
src/
├── components/
│   ├── chat/           # Conversation components
│   │   ├── ChatInput.tsx
│   │   ├── InfiniteCanvas.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── SubagentFlow.tsx
│   │   ├── ToolCallPill.tsx
│   │   └── ...
│   ├── layout/         # App structure components
│   │   ├── Sidebar.tsx
│   │   ├── SessionTabs.tsx
│   │   ├── CommandScreen.tsx
│   │   └── ...
│   ├── ui/             # Base UI primitives
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   └── icons/          # Custom icons
├── lib/
│   └── utils.ts        # Utility functions (cn, etc.)
├── pages/
│   └── Playground.tsx  # Main playground page
├── stores/
│   └── uiStore.ts      # UI state management
└── index.css           # Global styles and tokens
```

## License

Internal Block use only.
