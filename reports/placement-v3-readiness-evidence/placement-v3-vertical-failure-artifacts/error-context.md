# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: placement-v3-vertical.spec.ts >> placement v3 end-to-end vertical >> runs UI client, session orchestrator, graders, recommender, results, and persistence
- Location: tests/e2e/placement-v3-vertical.spec.ts:34:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('textarea, input[placeholder*=\'Short answer\'], [role=\'textbox\'], [role=\'radio\']').first() to be visible

```

# Test source

```ts
  153 | }
  154 | 
  155 | function createDeps(stored: Stored): CoreDeps {
  156 |   let id = 1;
  157 |   const writingGrader = createHttpWritingGrader({
  158 |     functionBaseUrl: "https://placement-edge.test/functions/v1",
  159 |     serviceRoleKey: "service-role-test",
  160 |     fetchImpl: async (input, init) => {
  161 |       const url = String(input);
  162 |       stored.graderCalls.push(url.includes("placement-v3-mercy-conversation")
  163 |         ? "placement-v3-mercy-conversation"
  164 |         : "placement-v3-grade-writing");
  165 | 
  166 |       if (url.includes("placement-v3-mercy-conversation")) {
  167 |         const body = JSON.parse(String(init?.body ?? "{}")) as { transcript?: Parameters<typeof gradeConversation>[0] };
  168 |         return jsonResponse({ assessment: gradeConversation(body.transcript ?? []) });
  169 |       }
  170 | 
  171 |       const body = JSON.parse(String(init?.body ?? "{}")) as {
  172 |         promptId: string;
  173 |         taskText: string;
  174 |         userResponse: string;
  175 |         targetLanguage: "en";
  176 |         userId?: string;
  177 |       };
  178 |       const graded = await gradeWritingSample(body, {
  179 |         callAi: async () => ({
  180 |           ok: true,
  181 |           provider: "openai",
  182 |           model: "e2e-fixture",
  183 |           latencyMs: 240,
  184 |           raw: "{}",
  185 |           json: writingAiAssessment(),
  186 |         }),
  187 |       });
  188 |       return jsonResponse(graded);
  189 |     },
  190 |   });
  191 | 
  192 |   return {
  193 |     now: () => new Date(Date.UTC(2026, 4, 20, 12, id, 0)).toISOString(),
  194 |     newId: () => `placement-v3-e2e-${id++}`,
  195 |     loadLatestInProgress: async (userId) =>
  196 |       [...stored.sessions.values()].find((s) => s.user_id === userId && s.flow_state === "in_progress") ?? null,
  197 |     loadSession: async (sessionId, userId) => {
  198 |       const session = stored.sessions.get(sessionId);
  199 |       return session?.user_id === userId ? session : null;
  200 |     },
  201 |     loadResponses: async (sessionId) => stored.responses.get(sessionId) ?? [],
  202 |     loadCurrentProfile: async (sessionId, userId) => {
  203 |       const profile = stored.profiles.get(sessionId);
  204 |       return profile?.user_id === userId ? profile : null;
  205 |     },
  206 |     createSession: async (input) => {
  207 |       const session = makeSession({
  208 |         id: input.id ?? `placement-v3-e2e-${id++}`,
  209 |         userId: input.userId,
  210 |         now: input.now,
  211 |         prompt: input.firstPrompt,
  212 |         languagePair: input.languagePair,
  213 |       });
  214 |       stored.sessions.set(session.id, { ...session, total_tasks: input.totalTasks });
  215 |       stored.responses.set(session.id, []);
  216 |       return stored.sessions.get(session.id) ?? session;
  217 |     },
  218 |     updateSession: async (session) => {
  219 |       stored.sessions.set(session.id, session);
  220 |       return session;
  221 |     },
  222 |     insertResponse: async (response) => {
  223 |       const saved = { ...response, id: response.id ?? `response-${id++}` };
  224 |       stored.responses.set(response.session_id, [...(stored.responses.get(response.session_id) ?? []), saved]);
  225 |       return saved;
  226 |     },
  227 |     markProfilesNotCurrent: async (userId) => {
  228 |       for (const [key, profile] of stored.profiles) {
  229 |         if (profile.user_id === userId) stored.profiles.set(key, { ...profile, is_current: false });
  230 |       }
  231 |     },
  232 |     upsertProfile: async (profile) => {
  233 |       const saved = { ...profile, id: profile.id ?? `profile-${id++}` };
  234 |       stored.profiles.set(profile.session_id, saved);
  235 |       return saved;
  236 |     },
  237 |     grade: async (input) => ({ ok: true, assessment: heuristicAssessment(input), version: "e2e-non-writing-grader" }),
  238 |     writingGrader,
  239 |     recommendLessons: async (profile) => {
  240 |       stored.recommenderCalls += 1;
  241 |       return (await recommendLessons(profile)).slice(0, 6).map((lesson, index): Recommendation => ({
  242 |         lessonId: lesson.lessonId,
  243 |         reason: lesson.reason,
  244 |         priority: lesson.priority || 1 - index * 0.1,
  245 |       }));
  246 |     },
  247 |     log: () => undefined,
  248 |   };
  249 | }
  250 | 
  251 | async function answerCurrentTask(page: Page) {
  252 |   await page.waitForTimeout(100);
> 253 |   await page.locator("textarea, input[placeholder*='Short answer'], [role='textbox'], [role='radio']").first().waitFor({ state: "visible" });
      |                                                                                                                ^ Error: locator.waitFor: Test timeout of 60000ms exceeded.
  254 |   const filled = await page.evaluate((answer) => {
  255 |     const fields = [...document.querySelectorAll("main textarea, main input[placeholder*='Short answer']")]
  256 |       .filter((node) => {
  257 |         const el = node as HTMLElement;
  258 |         const box = el.getBoundingClientRect();
  259 |         return box.width > 0 && box.height > 0;
  260 |       });
  261 |     const el = fields.at(-1) as HTMLInputElement | HTMLTextAreaElement | null;
  262 |     if (!el) return false;
  263 |     const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  264 |     const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  265 |     setter?.call(el, answer);
  266 |     el.dispatchEvent(new Event("input", { bubbles: true }));
  267 |     el.dispatchEvent(new Event("change", { bubbles: true }));
  268 |     return true;
  269 |   }, LONG_PLACEMENT_ANSWER);
  270 |   if (filled) {
  271 |     return;
  272 |   }
  273 | 
  274 |   const firstRadio = page.getByRole("radio").first();
  275 |   await firstRadio.click();
  276 | }
  277 | 
  278 | function publicResult(result: OrchestratorResponse): unknown {
  279 |   if (!result.ok) return result;
  280 |   const progress = {
  281 |     current: result.session.current_task_index,
  282 |     total: result.session.total_tasks ?? 0,
  283 |     state: result.session.flow_state,
  284 |   };
  285 |   if (result.action === "start") {
  286 |     return {
  287 |       sessionId: result.session.id,
  288 |       currentTask: result.prompt,
  289 |       totalTasks: result.session.total_tasks ?? 0,
  290 |       progress,
  291 |       resumed: result.resumed ?? false,
  292 |     };
  293 |   }
  294 |   if (result.action === "respond") {
  295 |     if (result.profile) {
  296 |       return {
  297 |         type: "session_complete",
  298 |         profile: result.profile,
  299 |         recommendations: result.profile.recommended_lessons,
  300 |       };
  301 |     }
  302 |     return { type: "next_task", currentTask: result.prompt, progress };
  303 |   }
  304 |   if (result.action === "abandon") return { status: "abandoned" };
  305 |   if (result.action === "resume") {
  306 |     return {
  307 |       type: "resumed",
  308 |       sessionId: result.session.id,
  309 |       currentTask: result.prompt,
  310 |       progress,
  311 |     };
  312 |   }
  313 |   return {
  314 |     sessionState: result.session.flow_state,
  315 |     currentModality: result.session.current_modality,
  316 |     currentTask: result.prompt,
  317 |     progress,
  318 |     profile: result.profile,
  319 |   };
  320 | }
  321 | 
  322 | function writingAiAssessment() {
  323 |   return {
  324 |     overall: { level: "B1", confidence: 0.82 },
  325 |     subskills: {
  326 |       [CEFRSubskill.Grammar]: { level: "B1", confidence: 0.8, notes: "Mostly clear clauses with some article errors." },
  327 |       [CEFRSubskill.Vocabulary]: { level: "B1", confidence: 0.84, notes: "Work and learning vocabulary is controlled." },
  328 |       [CEFRSubskill.Coherence]: { level: "B1", confidence: 0.82, notes: "Ideas connect clearly." },
  329 |       [CEFRSubskill.TaskAchievement]: { level: "B1", confidence: 0.82, notes: "Answers the prompt with relevant detail." },
  330 |     },
  331 |     strengths: ["Explains goals and work context clearly."],
  332 |     gaps: ["Article control is inconsistent."],
  333 |     l1InterferenceFlags: [
  334 |       { pattern: "article-omission", severity: "med", examples: ["write email"] },
  335 |     ],
  336 |     recommendedFocusAreas: ["Practice articles in workplace sentences."],
  337 |   };
  338 | }
  339 | 
  340 | function heuristicAssessment(input: GraderInput) {
  341 |   const isChoice = /^[a-z]$/i.test(input.responseText.trim());
  342 |   return {
  343 |     overallLevel: isChoice ? "A2" as const : "B1" as const,
  344 |     confidence: isChoice ? 0.45 : 0.76,
  345 |     strengths: ["Provides enough language for diagnosis."],
  346 |     gaps: input.modality === "speaking" ? ["Final consonants need focused practice."] : [],
  347 |     l1InterferenceFlags: input.modality === "speaking"
  348 |       ? [{ patternId: "final-consonants", severity: "high" as const, evidence: "Typed transcript references final sounds." }]
  349 |       : [],
  350 |     metadata: { e2e: true },
  351 |   };
  352 | }
  353 | 
```