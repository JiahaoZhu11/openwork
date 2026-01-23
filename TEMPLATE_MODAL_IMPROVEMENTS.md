# Template Modal Improvements

This document describes the improvements made to the template modal feature. Use this as a reference for re-implementing these changes on a fresh branch.

## Context

**Original Branch:** `claude/add-recommendation-feature-9Y1Qg`

**Why New Session:** The original branch became deprecated/stale, but the changes are still needed. This document preserves the implementation details so they can be re-applied cleanly.

**Current State:**
- Original branch has all changes implemented and working
- The latest dev branch (synced with upstream) does not have these changes
- Need to create a new branch from the latest dev branch and re-implement

## Session Name Suggestion
`template-modal-improvements` or `fix-template-modal-ux`

## Summary of Changes

### 1. Shared Session Filtering Logic (Foundation)

**Files:** `packages/app/src/app/utils/index.ts`, `packages/app/src/app/app.tsx`

Add a utility function to filter sessions by workspace, then use it consistently across all components.

**utils/index.ts** - Add after `normalizeDirectoryPath`:
```typescript
/**
 * Filter sessions to only include those from the specified workspace.
 * This is the shared filter logic used by Sessions page, Dashboard, and Template modal.
 */
export function filterSessionsByWorkspace<T extends { directory?: string }>(
  sessions: T[],
  workspaceRoot: string | null | undefined,
): T[] {
  const normalizedRoot = normalizeDirectoryPath(workspaceRoot);
  if (!normalizedRoot) return sessions;
  return sessions.filter((s) => normalizeDirectoryPath(s.directory) === normalizedRoot);
}
```

**app.tsx** - Add import and create memo:
```typescript
// Import
import { filterSessionsByWorkspace, ... } from "./utils";

// Create memo (after activePermissionMemo)
const workspaceFilteredSessions = createMemo(() =>
  filterSessionsByWorkspace(activeSessions(), workspaceStore.activeWorkspaceRoot())
);

// Update all session usages to use workspaceFilteredSessions():
// - dashboardProps.sessions
// - SessionView sessions prop
// - TemplateModal sessions prop
```

### 2. Template Modal State Management (app.tsx)

Add signals for tracking session selection and loading state:

```typescript
const [templateSessionLoading, setTemplateSessionLoading] = createSignal(false);
const [templateSelectedSessionId, setTemplateSelectedSessionId] = createSignal("");
```

Update `openTemplateModal` in dashboardProps to reset selection:
```typescript
openTemplateModal: () => {
  setTemplateSelectedSessionId("");
  openTemplateModal();
},
```

Update `saveSessionAsTemplate` to also reset selection at the start.

Implement `onSelectSession` handler with:
- Store previous state for rollback on error
- Set selection immediately
- Load messages async, then set title + prompt together after load completes
- Handle errors with rollback (reset to previous state)
- Clear prompt to empty string if no first user message

### 3. Template Modal Props (template-modal.tsx)

Add new props to `TemplateModalProps`:
```typescript
loadingSession: boolean;
selectedSessionId: string;
developerMode: boolean;
```

Update the component to:
- Use controlled `selectedSessionId` for the select element
- Show loading state when `loadingSession` is true
- Reset select when user manually edits title/description/prompt inputs
- Add floating debug panel (visible only in developer mode)

### 4. Styling Updates (template-modal.tsx)

**Auto-run toggle:** Change from sliding switch to On/Off button style (like Settings page)
```typescript
<button
  type="button"
  class={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
    props.autoRun
      ? "bg-gray-12 text-gray-1"
      : "bg-gray-4 text-gray-11 hover:bg-gray-5"
  }`}
  onClick={() => props.onAutoRunChange(!props.autoRun)}
>
  {props.autoRun ? "On" : "Off"}
</button>
```

**Session selector:** Make compact (single line, smaller height like workspace selector)

### 5. Bug Fixes

**template-state.ts** - Parse `autoRun` when loading templates:
```typescript
// In parseTemplateContent, add autoRun parsing:
autoRun: typeof meta.autoRun === "boolean" ? meta.autoRun : true,
```

**text-input.tsx** - Fix reactivity using `splitProps`:
```typescript
export default function TextInput(props: TextInputProps) {
  const [local, rest] = splitProps(props, ["label", "hint", "class"]);
  // Use local.label, local.hint, local.class
  // Spread {...rest} on the input element
}
```

**context/workspace.ts** - Load templates for all workspace types:
Remove the condition that only loaded templates for remote workspaces. Change from:
```typescript
if (context?.workspaceType === "remote" && targetRoot) {
```
to:
```typescript
if (targetRoot) {
```

## Debug Panel (Developer Mode Only)

Add a floating panel in template-modal.tsx that shows:
- selectedSessionId
- title
- prompt (truncated)
- loading state
- error

```typescript
<Show when={props.developerMode}>
  <div class="fixed bottom-4 right-4 bg-gray-2 border border-gray-6 rounded-lg p-3 text-xs font-mono space-y-1 max-w-xs z-50">
    <div class="font-semibold text-gray-11">Template Modal Debug</div>
    <div><span class="text-gray-10">selectedSessionId:</span> {props.selectedSessionId || "(none)"}</div>
    <div><span class="text-gray-10">title:</span> {props.title || "(empty)"}</div>
    <div><span class="text-gray-10">prompt:</span> {props.prompt?.slice(0, 50) || "(empty)"}{props.prompt?.length > 50 ? "..." : ""}</div>
    <div><span class="text-gray-10">loading:</span> {String(props.loadingSession)}</div>
    <div><span class="text-gray-10">error:</span> {props.error || "(none)"}</div>
  </div>
</Show>
```

## Reset Select on Manual Edit

In template-modal.tsx, add handlers that reset the select when user manually edits:

```typescript
const handleManualTitleChange = (value: string) => {
  props.onTitleChange(value);
  if (props.selectedSessionId) {
    props.onSelectSession("");
  }
};
// Similar for description and prompt
```

## Files Changed Summary

1. `packages/app/src/app/utils/index.ts` - Add `filterSessionsByWorkspace`
2. `packages/app/src/app/app.tsx` - Add signals, memo, update props
3. `packages/app/src/app/components/template-modal.tsx` - UI updates, new props, debug panel
4. `packages/app/src/app/template-state.ts` - Parse autoRun
5. `packages/app/src/app/components/text-input.tsx` - Fix reactivity with splitProps
6. `packages/app/src/app/context/workspace.ts` - Load templates for all workspace types
