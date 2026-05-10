# CLAUDE.md

이 파일은 Claude Code가 작업 시 따라야 할 프로젝트 컨텍스트와 룰을 정의합니다.

---

## Project Context

**Project**: ChatGPT History, Auto-Organized
**Type**: Portfolio case study (4-week redesign)
**Designer**: Chanhee Shin

### Thesis
유저는 정리하고 싶지 않다. 정리된 상태를 원한다.
AI는 유저를 학습한다. 그 학습된 자아를 유저에게 돌려준다.

### Two-Layer Solution
- **Layer 1 (Background)**: AI가 대화를 자동 그룹화. 유저는 정리 작업하지 않음.
- **Layer 2 (Foreground)**: 'My Identity' Dashboard — AI가 학습한 본인 모습을 유저에게 시각화.

### Persona
Jihyo Kim (24, Information Science Master's student) — heavy AI user, 
research/coding/writing context-switching, abandons organization due to high cost.

---

## Tech Stack

```
Frontend: Next.js 15 (App Router) + TypeScript + Tailwind 4
UI Base: shadcn/ui
State: Zustand
Animation: Framer Motion
Icons: lucide-react + custom SVGs (src/assets/icons/)

Data: Static JSON (synthetic dataset, 60-80 conversations)
Optional: OpenAI Embeddings + GPT-4 API for live demo

Tools: Claude Code, html.to.design (Figma import)
```

---

## Folder Structure

```
src/
├── assets/
│   └── icons/              # Figma export SVGs
├── components/
│   └── ui/                 # shadcn/ui base (Button, Dialog, etc.)
├── features/               # WORKZONE — feature-level pages
│   ├── auto-workspaces/    # Solution 1
│   │   ├── components/
│   │   ├── index.tsx
│   │   └── README.md
│   └── identity-dashboard/ # Solution 2
│       ├── components/
│       ├── index.tsx
│       └── README.md
├── lib/
│   ├── store.ts            # Zustand global state
│   ├── data.ts             # Data loaders
│   └── utils.ts
├── styles/
│   ├── tokens.css          # Design tokens (Figma-synced)
│   └── globals.css         # Global resets + base styles
├── data/
│   ├── conversations.json
│   ├── groups.json
│   └── user.json
├── types/
│   └── index.ts            # TypeScript types
└── App.tsx                 # Main routing
```

---

## Design System Rules

### Token Usage (CRITICAL)

**ALWAYS use semantic tokens** from `src/styles/tokens.css`:

```tsx
// ✅ Correct
<div style={{ color: 'var(--color-text-primary)' }}>
<button style={{ height: 'var(--button-height-default)' }}>

// ❌ Wrong — never hardcode
<div style={{ color: '#0D0D0D' }}>
<button style={{ height: '36px' }}>
```

**Token hierarchy**:
1. **Primitives** (`--color-grey-5`, `--height-36`) — only used to define semantic tokens
2. **Semantic** (`--color-text-primary`, `--button-height-default`) — use these in components

If a needed semantic token doesn't exist, **add it to tokens.css first**, then use it. 
Never inline hardcoded values.

### Colors
- Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
- Background: `--color-bg-default`, `--color-bg-sidebar`, `--color-bg-hover`
- Border: `--color-border-subtle`, `--color-border-default`, `--color-border-strong`

### Spacing
Use `--space-*` tokens (4, 8, 12, 16, 24...). Never hardcode `padding: 12px`.

### Typography
Use semantic sizes: `--text-caption`, `--text-body-sm`, `--text-body`, 
`--text-body-lg`, `--text-heading-sm`, `--text-heading`, `--text-heading-lg`.

---

## Code Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `WorkspaceCard.tsx`)
- shadcn/ui: `lowercase.tsx` (e.g., `button.tsx`) — keep shadcn convention
- Hooks: `useCamelCase.ts`
- Utils: `kebab-case.ts`

### Component Structure
- Functional components with hooks (no class components)
- TypeScript strict mode
- Props interface defined above component:

```tsx
interface WorkspaceCardProps {
  id: string;
  name: string;
  conversationCount: number;
}

export function WorkspaceCard({ id, name, conversationCount }: WorkspaceCardProps) {
  // ...
}
```

### Feature Organization

Each feature in `src/features/[name]/` has:
- `index.tsx` — main page component
- `components/` — feature-specific subcomponents
- `README.md` — feature purpose, key interactions, data dependencies

### State Management
- Local UI state: `useState`
- Cross-component state: Zustand (`src/lib/store.ts`)
- Server data: not applicable (static JSON only for this prototype)

---

## Data Strategy

This is a **prototype**, not production. Data is synthetic.

### Files
- `src/data/conversations.json` — 60-80 fake conversations (Jihyo persona)
- `src/data/groups.json` — pre-computed auto-grouping results
- `src/data/user.json` — persona metadata

### When generating fake data
- Conversations should reflect a realistic Master's student workflow
- Distribution: ~35% research/reading, ~25% coding, ~20% writing, ~20% misc
- Include intentional duplicates (same topic across multiple chats) — 
  this is the core pain point being designed for
- Date range: last 6 months, with realistic clustering (more recent = more dense)

### Optional Live API
A few demo points may use real OpenAI API:
- Embedding-based clustering (Search → group suggestion)
- GPT-4 summary generation (Workspace summary card)

Keep main demo flow on static data for stability.

---

## Interaction Design Principles

These come directly from the case study thesis. Follow them when building 
AI-suggestion components:

### 1. Ambient Intelligence
AI works in the background. Surface only at high-intent moments.
- New chat start
- Search action
- Workspace entry

### 2. Confidence Threshold
AI suggestions only appear at >80% confidence. Below that, stay silent.

### 3. User Sovereignty
Every AI suggestion must be:
- Dismissible (one click)
- Editable (user can adjust)
- Undoable (action can be reversed)

### 4. Transparency
For 'My Identity' Dashboard — every learned rule must show:
- What was learned
- When it was learned
- Edit / Delete / Toggle controls

User is the admin of their own AI memory.

---

## Workflow Notes

### When asked to build a new component
1. Check if a similar shadcn/ui base exists (`src/components/ui/`)
2. Check `src/styles/tokens.css` for needed tokens (add if missing)
3. Place in correct location:
   - Generic UI → `src/components/ui/`
   - Feature-specific → `src/features/[name]/components/`
4. Use semantic tokens, not primitives, not hardcoded values

### When asked to modify design
1. First check if it's a token change (color, spacing) — update tokens.css
2. Or a component change — update the specific component
3. Never duplicate token values across files

### When asked to add data
1. Update the relevant JSON in `src/data/`
2. Update TypeScript types in `src/types/index.ts` if structure changed
3. Verify data loader in `src/lib/data.ts` still works

---

## Out of Scope

This prototype intentionally excludes:
- Mobile responsive design (desktop-only for case study)
- Real ChatGPT API integration (synthetic data only)
- Authentication / accounts
- Enterprise / Team features
- Internationalization
- Production-level error handling

Don't add these unless explicitly requested.

---

## Communication Style

- Korean and English both OK in code comments
- Keep responses focused on what was asked
- If a request conflicts with these rules, raise it before proceeding
- Show changes as small focused diffs, not massive rewrites
