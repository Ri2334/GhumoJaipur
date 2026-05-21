# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright.spec.js >> Dashboard transport flow >> unauthenticated users are redirected on search
- Location: tests/playwright.spec.js:7:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('text=Where do you want to go next?') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:import-analysis] Failed to resolve import \"react-icons/fa\" from \"src/components/TransportCard.jsx\". Does the file exist?"
  - generic [ref=e5]: /Users/rishijoshi/GhumoJaipur/frontend/src/components/TransportCard.jsx:2:63
  - generic [ref=e6]: "16 | } 17 | import React from \"react\"; 18 | import { FaBus, FaTrain, FaCar, FaWalking, FaMotorcycle } from \"react-icons/fa\"; | ^ 19 | const toneClass = { 20 | best: \"border-emerald-200 bg-emerald-50 text-emerald-700\","
  - generic [ref=e7]: at formatError (file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:44066:46) at TransformContext.error (file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:44062:19) at normalizeUrl (file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:41845:33) at process.processTicksAndRejections (node:internal/process/task_queues:104:5) at async file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:41999:47 at async Promise.all (index 4) at async TransformContext.transform (file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:41915:13) at async Object.transform (file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:44356:30) at async loadAndTransform (file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:55088:29) at async viteTransformMiddleware (file:///Users/rishijoshi/GhumoJaipur/frontend/node_modules/vite/dist/node/chunks/dep-827b23df.js:64699:32
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.js.
```

# Test source

```ts
  1  | /* Playwright test for dashboard transport flow
  2  |  * Requires Playwright to be installed (`npm i -D playwright @playwright/test`) and `npx playwright test` to run.
  3  |  */
  4  | import { test, expect } from '@playwright/test';
  5  | 
  6  | test.describe('Dashboard transport flow', () => {
  7  |   test('unauthenticated users are redirected on search', async ({ page }) => {
  8  |     await page.goto('/dashboard');
> 9  |     await page.click('button:has-text("Find route")');
     |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  10 |     await expect(page).toHaveURL(/\/login/);
  11 |   });
  12 | 
  13 |   test('authenticated user sees transport results', async ({ page }) => {
  14 |     // Mock auth
  15 |     await page.goto('about:blank');
  16 |     await page.evaluate(() => {
  17 |       localStorage.setItem('ghumo_token', 'test-token');
  18 |       localStorage.setItem('ghumo_user', JSON.stringify({ id: 'u1', name: 'Tester' }));
  19 |     });
  20 |     await page.goto('/dashboard');
  21 |     await page.fill('input[placeholder="Current location"]', 'Jaipur Railway Station');
  22 |     await page.fill('input[placeholder="Destination"]', 'Badi Chopar');
  23 |     await page.click('button:has-text("Find route")');
  24 |     // Wait for distance badge
  25 |     await page.waitForSelector('text=Distance', { timeout: 10000 });
  26 |     const dist = await page.locator('text=Distance').first().innerText();
  27 |     expect(dist).toMatch(/\d+(\.\d+)? km/);
  28 |     // Expect at least 3 recommendation cards
  29 |     const cards = await page.locator('[data-transport-card]').count();
  30 |     expect(cards).toBeGreaterThanOrEqual(3);
  31 |   });
  32 | });
  33 | 
```