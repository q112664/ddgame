---
name: code-first-ui-clone
description: Recreate UI blocks or pages by inspecting the target site's real DOM, classes, and CSS first, then mapping exact style tokens into the current project. Use when the user asks to 仿制, 还原, 复刻, or match a visual effect/page from a reference URL or screenshot.
---

# Code-First UI Clone

## Core Rule

- Treat screenshots as secondary references.
- Treat target page DOM and CSS as source of truth.

## Workflow

1. Capture target source
- Open the target page and locate the target block.
- Read the DOM chain and class names for the card shell and key children.
- Extract computed styles for: `background`, `border`, `border-radius`, `box-shadow`, `padding`, and `gap`.
- If browser automation is blocked, fetch HTML and linked CSS files, then resolve class rules directly.

2. Extract authoritative style values
- Prefer explicit class utilities and CSS variable-backed values over visual guessing.
- Record exact values before editing local code.
- Keep inferred values minimal and only where source values are unavailable.

3. Apply locally with minimal scope
- Update the local component styles first; avoid changing content structure unless requested.
- Start from container shell styles (bg/border/radius/shadow), then adjust spacing rhythm.
- Keep existing project design system tokens when they can represent the same value.

4. Report provenance clearly
- State which target classes/rules were used.
- State which local classes/values were changed.
- Explicitly label any inferred fallback values as inferred.

## Quality Checks

- Verify desktop and mobile layout still loads correctly.
- Run local type/lint checks when available.
- Avoid adding decorative custom styles that are not backed by target code.
