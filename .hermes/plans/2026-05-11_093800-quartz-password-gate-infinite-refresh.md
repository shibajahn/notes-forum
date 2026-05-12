# Plan: Quartz4 PasswordGate Infinite Refresh

## Goal

Diagnose and fix the infinite page refresh on the Quartz 4 login landing page so the user can type their username and password without interruption.

## Current Context / Assumptions

- **Project**: `~/workspace/quartz-website` (Quartz 4.5.2)
- **Authentication**: Custom `PasswordGate.tsx` component with SHA-256 hashed credentials stored client-side
- **SPA enabled**: Yes (`enableSPA: true` in config)
- **Landing page**: Uses `LandingPage.tsx` which returns `<PasswordGate />` for slug `index`, `<Content />` for all other pages
- **Not running locally now**: No Quartz dev server detected (`ps aux | grep quartz` showed nothing)
- **Single user configured**: `shibajahn` with a SHA-256 password hash
- **User reports**: "the login landing page refreshes indefinitely. I can't even type my username & password."

## Root Cause Analysis

The bug is in `PasswordGate.tsx`, specifically the `checkAuth()` function inside the `afterDOMLoaded` inline script:

```javascript
function checkAuth() {
  // ... auth check ...
  // If on a non-index page, redirect to index
  if (window.location.pathname !== "" && window.location.pathname !== "/") {
    window.location.replace("./")
    return false
  }
  return false
}
```

**The problem**: This function only considers `""` and `"/"` as valid index paths. If the site is served from any subdirectory (e.g., `shibajahn.github.io/notes/` for a GitHub Pages project site, or a local dev server with a path prefix), the index page's pathname would be something like `/notes/` or `/blog/`. The check fails, `window.location.replace("./")` fires, which navigates to `./` — resolving to the same subdirectory root — which then triggers `checkAuth()` again, creating an **infinite redirect loop**.

Additionally, this interacts with two other mechanisms:
1. The **SPA router** (`spa.inline.ts`) dispatches a `nav` event at the end of its initialization via `notifyNav(getFullSlug(window))`
2. The PasswordGate adds a `nav` event listener that calls `checkAuth()` on every SPA navigation
3. The PasswordGate also adds a `popstate` listener that calls `checkAuth()`

The combination means any SPA navigation or browser history change also triggers the redirect loop when the pathname check fails.

**Why the user can't type**: If the page is refreshing rapidly (even via SPA morphing rather than full reload), input focus is lost and the cursor cannot be placed in the form fields.

## Proposed Approach

### Fix: Make `checkAuth()` path-agnostic

The `checkAuth()` function should not hardcode `"/"` as the index path. Instead, it should:

1. **Option A (preferred)**: Check if the current pathname equals the index page's slug, using the same logic as `LandingPage.tsx`
2. **Option B**: Accept the base URL prefix as a parameter or derive it from `window.location.pathname`
3. **Option C**: Simplify by only hiding the gate when authenticated, and never redirecting on the index page regardless of its path

**Option C is the simplest and safest fix** because:
- The `checkAuth()` function's purpose is to (a) show/hide the gate, (b) prevent unauthenticated SPA navigation
- The redirect to index for non-index pages is a convenience feature that causes the bug
- When unauthenticated, the gate is always shown on the index page — the user can simply navigate to any note link, and the SPA click interceptor will block it (already implemented)
- Removing the redirect eliminates the infinite loop without introducing new logic

### Implementation Steps

1. **Remove the pathname redirect check** in `checkAuth()`:
   ```javascript
   function checkAuth() {
     if (sessionStorage.getItem("notes_auth") === "true") {
       var gate = document.getElementById("password-gate")
       if (gate) gate.style.display = "none"
       return true
     }
     var gate = document.getElementById("password-gate")
     if (gate) gate.style.display = "block"
     // Removed: never redirect to index — just show the gate and return false
     return false
   }
   ```

2. **Verify the SPA click interceptor** still works for unauthenticated users:
   - The capturing-phase click listener already blocks navigation to internal links when not authenticated
   - This means unauthenticated users stay on the index page with the gate visible — which is the desired behavior

3. **Rebuild and test**:
   - Run `npm run quartz build`
   - Start dev server: `npm run quartz -- --serve`
   - Verify the login form loads without refreshing
   - Verify typing in the form fields works
   - Submit correct credentials → verify gate hides and note content loads
   - Submit incorrect credentials → verify error message shows
   - Verify SPA navigation is blocked when unauthenticated

## Files Likely to Change

- **`~/workspace/quartz-website/quartz/components/PasswordGate.tsx`** — Remove the pathname redirect check in `checkAuth()`
- **`~/workspace/quartz-website/content/index.md`** — No change needed (just confirms index page content)

## Tests / Validation

1. [ ] Page loads without refreshing on index page
2. [ ] Can type username and password into the form fields
3. [ ] Submitting correct credentials hides the gate and shows note content
4. [ ] Submitting incorrect credentials shows error message and clears the password field
5. [ ] Unauthenticated users cannot navigate to note pages (SPA clicks blocked)
6. [ ] Authenticated users can navigate freely between pages via SPA
7. [ ] `sessionStorage` persists auth state across SPA navigations
8. [ ] Browser back/forward buttons work correctly with auth state

## Risks, Tradeoffs, and Open Questions

**Risks**:
- Removing the redirect means if a user bookmarks or deep-links to a note URL while unauthenticated, they'll get a blank page (the gate is only rendered on the index page via `LandingPage.tsx`). This is acceptable since the SPA click interceptor already prevents this.
- If the site is ever deployed to a subdirectory and the `LandingPage` component doesn't render on that path either, users would see nothing. Need to verify `LandingPage` is used for the subdirectory root.

**Tradeoffs**:
- Removing the redirect simplifies the code and eliminates the bug, but removes a "nice-to-have" auto-redirect feature
- The SPA click interceptor is the primary protection against unauthenticated access — it's robust and doesn't have the redirect bug

**Open Questions**:
- How is the site currently being deployed? (direct root path vs. subdirectory?)
- Is the user running locally or on a hosted deployment? (This affects whether the subdirectory theory applies)
- Should we add a `checkAuth()` call that handles the subdirectory case if we decide to keep the redirect?

## Verification Steps (post-fix)

1. `cd ~/workspace/quartz-website && npm run quartz build`
2. `npm run quartz -- --serve`
3. Open `http://localhost:3000` in browser
4. Confirm no infinite refresh — login form should be stable
5. Type username `shibajahn` and the correct password
6. Click "Unlock" — note content should appear
7. Navigate to another note — SPA transition should work
8. Open a new tab to `http://localhost:3000/some-note` — should show the login gate again
