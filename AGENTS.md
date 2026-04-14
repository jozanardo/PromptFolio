# PromptFolio Design Operating Guide

This file is the visual and interaction source of truth for PromptFolio.

Future prompts, UI changes, refactors, and design decisions should follow this guide unless the user explicitly asks to change the direction. When in doubt, preserve coherence over novelty.

This document is intentionally prescriptive. It is meant to help future agents make strong design decisions quickly and consistently.

## 1. Product Thesis

PromptFolio is not a generic portfolio website and it is not a theatrical fake terminal.

PromptFolio should feel like:

- a personal command archive
- a calm, authored workspace
- a precise, thoughtful artifact built by an engineer
- an editorial interface where reading and interaction coexist naturally

PromptFolio should not feel like:

- a hacker movie terminal
- a neon command line demo
- a gamer UI
- a startup landing page with terminal styling
- a decorative shell that sacrifices clarity

The single clearest design sentence for the product is:

`PromptFolio should feel like opening a personal command archive authored by a thoughtful engineer.`

## 2. Emotional Target

The first five seconds matter.

When someone opens PromptFolio, the experience should feel:

- calm
- authored
- precise
- inviting
- quietly memorable

The interface must communicate that this is a personal, command-driven portfolio without making the visitor guess how to use it.

The emotional target is not "impressive through effects." It is "memorable through restraint, clarity, and care."

## 3. Signature Moment

The most memorable moment in the product is the first reveal of the shell.

That reveal should feel like the shell is settling into place, not like an app is loading.

The reveal choreography should follow this order:

1. The fixed top bar is already present.
2. The main shell enters with a very light fade and slight upward movement.
3. The header, onboarding content, chips, and prompt appear with subtle staggered timing.
4. The prompt receives focus automatically after the reveal completes.

This reveal must stay:

- soft
- short
- elegant
- non-theatrical

Avoid:

- dramatic zooms
- long staged animations
- spring-heavy motion
- delayed usability

## 4. Core Design Character

PromptFolio uses a restrained aesthetic with authored details.

The project should be:

- central and spacious rather than dense
- text-led rather than card-led
- terminal-inspired rather than terminal-obsessed
- minimal but not sterile
- polished but not flashy

The right design balance is:

- more authored than generic
- more human than mechanical
- more editorial than dashboard-like
- more authored-workspace-like than software-panel-like

## 5. Signature Elements

These are the recurring identity anchors of the interface:

### 5.1 The fixed top bar

The top bar behaves like a quiet command deck:

- fixed to the top of the viewport
- spans full width
- branding aligned left
- utility controls aligned right
- present on desktop and mobile

It should feel stable and calm, not promotional.

### 5.2 The shell as object

The main shell is the central artifact:

- a clearly defined object over the page background
- calm, solid, and editorial
- separated from the page through surface, subtle border, and soft shadow

It should never dissolve into the background or look like a full-bleed app canvas.

### 5.3 The prompt as living center

The prompt is the main point of interaction. It should feel alive, but very subtly:

- always ready for input
- visually integrated with the reading flow
- more like a live command line than a text field

### 5.4 Fine lines and markers

PromptFolio uses a quiet signature language of thin lines and precise markers.

This language should appear only in structural moments, such as:

- help sections
- markdown framing
- shell separators
- subtle prompt emphasis

Do not spread line motifs everywhere. They should organize reading, not become decoration.

### 5.5 Near-invisible atmosphere

The page may use barely perceptible texture and soft tonal atmosphere to support the calm archival atmosphere.

If texture is used, it must be:

- extremely subtle
- atmospheric
- almost invisible at first glance

It must never read as a visual effect layer.

## 6. Visual Thesis in Practical Terms

The design direction is:

`editorial terminal minimalism with a personal archive feel`

In practice, that means:

- the terminal metaphor remains visible but softened
- typography and spacing do most of the work
- the accent color is functional, not decorative
- motion is used to improve feel, not to show off
- content hierarchy is built through rhythm, contrast, and measure

## 7. Palette Policy

The current palette is the official baseline.

Future agents should treat the current color system as stable and only make fine adjustments unless the user explicitly requests a broader palette redesign.

That means:

- do not casually swap the accent family
- do not introduce secondary competing accents
- do not radically increase contrast for style alone
- do not reopen light vs dark direction without user intent

### 7.1 Light theme baseline

Current official light tokens:

- `--bg: #f6f4ef`
- `--surface: #fbfaf7`
- `--surface-2: #f0ede6`
- `--surface-overlay: rgba(251, 250, 247, 0.88)`
- `--text: #1f2328`
- `--text-muted: #5f6773`
- `--text-soft: #7a828e`
- `--border: #ddd7cc`
- `--border-strong: #c9c1b4`
- `--accent: #058549`
- `--accent-soft: #d8ebe4`
- `--success: #2f6b4f`
- `--error: #a34a3d`
- `--focus: #058549`
- `--wash-1: rgba(122, 130, 142, 0.24)`
- `--wash-2: rgba(31, 35, 40, 0.1)`
- `--shadow-shell: 0 24px 80px rgba(31, 35, 40, 0.2)`
- `--selection-bg: #cfe0d9`
- `--selection-text: #1f2328`

Interpretation:

- warm paper, not white canvas
- calm green accent with enough authority to remain legible
- soft borders, low noise, subtle elevation

### 7.2 Dark theme baseline

Current official dark tokens:

- `--bg: #111315`
- `--surface: #171a1d`
- `--surface-2: #1d2125`
- `--surface-overlay: rgba(23, 26, 29, 0.88)`
- `--text: #ece8df`
- `--text-muted: #b0a99c`
- `--text-soft: #8f897d`
- `--border: #2a2f34`
- `--border-strong: #3a4148`
- `--accent: #7ec0a9`
- `--accent-soft: #1f322d`
- `--success: #7ab78f`
- `--error: #d08b7d`
- `--focus: #7ec0a9`
- `--wash-1: rgba(126, 192, 169, 0.08)`
- `--wash-2: rgba(17, 19, 21, 0.22)`
- `--shadow-shell: 0 28px 90px rgba(0, 0, 0, 0.32)`
- `--selection-bg: #29433c`
- `--selection-text: #ece8df`

Interpretation:

- charcoal editorial depth, not black neon contrast
- soft green accent tuned for dark surfaces
- atmospheric, but never theatrical

### 7.3 Accent usage rules

Accent exists to guide the eye.

Accent should primarily appear on:

- the prompt glyph `>`
- active controls
- highlighted command tokens in history
- links
- very small instructional emphasis moments

Accent should not be used for:

- large decorative surfaces
- broad color flooding
- multiple simultaneous emphasis areas

## 8. Theme System Rules

PromptFolio uses semantic theme tokens mapped through Tailwind.

Future UI changes should prefer semantic tokens such as:

- `bg-canvas`
- `bg-surface`
- `bg-surface-2`
- `text-primary`
- `text-muted`
- `text-soft`
- `border-subtle`
- `border-subtle-strong`
- `text-accent`
- `bg-accent-soft`
- `ring-focus`

Do not introduce component-level hard-coded colors in JSX unless there is no reasonable alternative.

Do not reintroduce theme-specific naming like:

- dracula
- neon
- hacker
- cyber

## 9. Typography

`IBM Plex Mono` is the official typographic signature of PromptFolio.

It should remain the primary typeface across the product.

Rules:

- keep the mono identity across the entire experience
- do not add a second typeface by default
- do not replace the current type system casually
- let rhythm, weight, and spacing create character before considering font changes

The reason this matters is that PromptFolio should feel authored and technical without turning into a visual gimmick.

## 10. Spatial Composition

PromptFolio should feel centered, breathable, and intentional.

The layout should not feel:

- cramped
- edge-to-edge
- dashboard-like
- over-optimized for density

The layout should feel:

- well framed
- spacious
- stable
- easy to read for several minutes

### 10.1 Shell width

On large screens, the shell should maintain a well-defined editorial max width.

Preferred shell max width:

- between `1200px` and `1280px`

Do not allow the shell to grow indefinitely on wide screens.

### 10.2 Outer spacing

The current responsive outer padding is part of the design baseline:

- `px-[6%]` by default
- `md:px-[10%]`
- `xl:px-[15%]`

This should remain generous.

### 10.3 Reading measure

PromptFolio should use differentiated reading widths:

- the header should be more text-contained
- the history can use more horizontal freedom

This supports the intended balance:

- header as editorial orientation
- history as active terminal content

### 10.4 Vertical rhythm

The vertical rhythm should be wide and calm.

This applies to spacing between:

- top bar and shell
- header sections
- history groups
- prompt and prior output

Dense spacing is the wrong default for this product.

## 11. Scroll Model

The page should own the scroll.

That means:

- the whole page scrolls naturally
- the shell grows with the content
- the top bar remains the only fixed element

Do not introduce inner shell scrolling as the default behavior. It makes the product feel more like an app panel and less like a continuous personal archive.

## 12. Top Bar Rules

The top bar is not a hero. It is a utility strip with identity.

Rules:

- fixed at top
- full width
- calm translucent surface
- subtle bottom border
- quiet backdrop blur
- brand left, controls right

Current copy rules:

- English: `PromptFolio powered by João Zanardo`
- Portuguese: `PromptFolio por João Zanardo`

Color rules:

- `PromptFolio` uses primary text color
- `João Zanardo` uses primary text color
- `powered by` / `por` uses accent color

This distinction is deliberate and should be preserved.

### 12.1 Mobile top bar

On mobile, the full brand text must remain intact.

When horizontal space becomes tight:

- place the brand on the first line
- place controls on the second line

Do not truncate the identity by default.

## 13. Header and Onboarding Rules

The header exists to orient quickly and then get out of the way.

It is not a manifesto block and it is not a hero banner.

Its job is to:

- explain what PromptFolio is
- remove first-visit confusion
- suggest how to begin
- transition attention toward the history and prompt

### 13.1 Copy tone

Header and onboarding copy should be:

- precise
- calm
- direct

Avoid:

- marketing language
- exaggerated self-promotion
- overly playful copy
- dense technical language for its own sake

### 13.2 Hierarchy inside header

The hierarchy is:

1. welcome and explanation
2. onboarding guidance
3. quick-start chips
4. inline prompt hint

The text leads. The chips support.

Quick-start chips must not visually overtake the explanatory copy.

### 13.3 Header persistence

The onboarding block should remain stable after the first command.

Do not collapse, fade back, or structurally retreat the header by default.

The history should naturally take over as it grows.

## 14. Quick-Start Chip Rules

Quick-start chips are:

- useful
- supportive
- discreet

They are not the main navigation.

Their behavior should preserve the terminal metaphor.

When activated, a quick-start chip should:

- fill the prompt with the corresponding command
- move focus to the input

It should not execute the command automatically by default.

That behavior keeps the authored terminal feeling intact while still improving usability for first-time visitors.

## 15. History Rules

The history is the core of the experience.

It should feel like:

- continuous reading
- a terminal record being built over time
- a calm command-driven conversation

It should not feel like:

- stacked cards
- a list of widgets
- a dashboard feed

### 15.1 General history rhythm

The history should read as one continuous flow with clear pacing between entries.

Use spacing, indentation, weight, and subtle structural cues instead of heavy visual containers.

### 15.2 Command emphasis

Command tokens inside history should receive functional, subtle emphasis:

- accent color
- slightly stronger weight

Do not over-style them.

### 15.3 Error treatment

Errors should be:

- clear
- contained
- readable

They should not become loud or alarming.

### 15.4 Help treatment

Help output should use thin structural cues and grouping so it reads as organized reference material rather than decorative UI.

### 15.5 Markdown treatment

Markdown blocks should feel like attached pages inside the shell.

They may be more structured than plain output, but they must still belong to the same visual world.

They should not look like imported blog cards or a separate article layout.

## 16. Prompt Rules

The prompt is the live center of the interface.

Rules:

- keep it borderless by default
- keep the background transparent in the resting state
- preserve the feeling of typing directly into the terminal flow
- avoid turning it into a standard input control

### 16.1 Focus behavior

When active, the prompt should gain:

- a very soft wash behind the active line
- slightly increased presence of the `>` prompt glyph
- a clear but elegant sense of readiness

The wash must remain subtle enough that the prompt does not read as a boxed field.

### 16.2 Initial focus

After the shell reveal, the prompt should receive focus automatically.

The product should feel immediately ready.

## 17. Motion Language

Outside the initial shell reveal, motion should be minimal and quiet.

Default motion behavior:

- subtle microinteractions
- short durations
- low visual drama
- clear purpose

Motion is allowed to:

- confirm interaction
- improve perceived polish
- strengthen continuity

Motion is not allowed to:

- perform for attention
- dominate the interface
- delay usability

### 17.1 Theme switching

Theme changes should use a short, refined transition.

It should feel:

- smooth
- brief
- controlled

It should not feel:

- dramatic
- cinematic
- slow

### 17.2 Hover behavior

Hover should stay near-minimal.

Its purpose is to confirm interactivity, not to become part of the spectacle.

## 18. Light and Dark Mode Parity

Light and dark mode must behave like the same product in different conditions.

Do not allow:

- one mode to become visually experimental while the other stays safe
- different structural hierarchies between themes
- different component personalities between themes

Both themes must preserve:

- the archive metaphor
- the same reading rhythm
- the same spacing logic
- the same interaction language

## 19. Mobile Behavior

Mobile should preserve the same identity, not become a different product.

The mobile version should:

- keep the same calm tone
- keep the same shell metaphor
- keep the same top bar identity
- keep the same prompt-first interaction model

### 19.1 Mobile priorities

On mobile, prioritize:

- clarity
- breathing room
- intact identity
- clean wrapping behavior

### 19.2 Mobile top bar

When needed:

- brand on first row
- controls on second row

### 19.3 Mobile content rules

On smaller screens:

- chips must wrap cleanly
- markdown should remain attached to the archive feel
- prompt should stay immediate and touch-friendly
- spacing may compress slightly, but not enough to lose calmness

## 20. Texture and Atmosphere

The current background already uses soft atmospheric washes.

Future atmospheric refinement is allowed only if it remains nearly invisible.

Allowed direction:

- subtle paper-like depth
- barely noticeable grain
- soft tonal atmosphere

Not allowed:

- obvious texture overlays
- visible paper simulation
- grain as decoration
- visual noise competing with text

## 21. Accessibility and Robustness

The visual system must preserve the existing quality baseline:

- localized `aria-label` values
- `aria-pressed` on segmented controls
- no layout shift in active toggles
- theme applied before first paint
- guarded access to storage and `matchMedia`
- calm contrast without sacrificing readability

Future visual changes must keep or improve these guarantees.

## 22. Localization Rules

PromptFolio supports English and Portuguese.

This applies to both visible copy and accessibility text.

Requirements:

- branding text must localize correctly
- theme labels must localize correctly
- interactive labels must follow the active locale
- onboarding meaning must stay parallel across languages

Do not localize visible copy while leaving support text behind in English.

## 23. Policy for Future Visual Additions

This is the most important future-facing rule in the document:

No new visual element should be added unless it clearly improves at least one of the following:

- reading
- fluency
- identity

Beauty alone is not enough.

Every new visual addition should justify itself in terms of:

- comprehension
- interaction quality
- emotional coherence
- archive identity

If an element does not clearly improve one of those areas, it should not be added.

## 24. Default Anti-Patterns

Avoid these by default:

- neon accents
- purple-heavy palettes
- glowing borders
- gamer or hacker aesthetics
- exaggerated hero sections
- highly clickable landing-page chips
- internal panel scrolling
- boxed prompt inputs
- overly strong hover states
- multiple competing accent colors
- loud textures
- decorative symbols repeated everywhere
- broad use of line motifs outside structural moments

## 25. Evaluation Checklist for Future UI Changes

Before accepting a visual change, ask:

1. Does this make PromptFolio feel more like a personal command archive?
2. Does this improve reading or fluency?
3. Does this preserve the calm, authored tone?
4. Does this keep the shell as the central object?
5. Does this preserve light and dark parity?
6. Does this avoid turning the prompt into a conventional form field?
7. Does this keep the top bar useful but quiet?
8. Does this maintain subtlety in motion and hover?
9. Does this use accent color functionally instead of decoratively?
10. Would this still feel coherent on mobile?

If the answer to several of these is no, the change is probably moving away from the product's design thesis.

## 26. Implementation Anchors

The main files that define or express this visual system are:

- `src/assets/App.css`
- `tailwind.config.cjs`
- `index.html`
- `src/context/ThemeContext.tsx`
- `src/context/LanguageContext.tsx`
- `src/App.tsx`
- `src/components/TopBar.tsx`
- `src/components/Header.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/History.tsx`
- `src/components/InputPrompt.tsx`
- `src/components/MarkdownRenderer.tsx`
- `src/i18n/index.ts`

Future agents should read those files before making meaningful visual changes.

## 27. Final Operating Summary

PromptFolio is a bilingual, theme-aware, editorial terminal portfolio whose deepest design metaphor is a personal command archive.

Its defining traits are:

- calm first impression
- memorable shell reveal
- fixed top bar as a quiet command deck
- spacious central shell
- header that orients quickly
- continuous archive-like history flow
- markdown as attached pages
- a borderless live prompt
- subtle line-based structural language
- near-invisible atmosphere
- minimal motion
- minimal hover
- official stable palette baseline

The simplest summary rule for future prompts is:

`Make PromptFolio more readable, more fluid, and more authored - never louder.`
