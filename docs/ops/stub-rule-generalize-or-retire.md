# Stub-rule decision support: generalize or retire (3 run-on rules)

Three correction rules in `src/lib/tutor/correctionRules/en.ts` are single-demo
stubs that **cannot be Pattern-B golden-locked** (a golden fixture needs a
real input→output family; these have ~one input each). This is read-only
decision support for **Lane A** — it changes no rule. Every input→output below
was captured from the live engine (`correctWithTutorRules(input, "en")`).

**Summary recommendation: RETIRE all three.** One of them
(`en-hat-biking-summer-runon`) is not merely inert — it **over-fires on realistic
inputs and fabricates content**, so retiring it also removes an active FP.

| Rule | Matches | Probe verdict | Recommend |
|------|---------|---------------|-----------|
| en-hat-biking-summer-runon | broad keyword combo → **canned** output | over-fires + **fabricates** (bicycle→hat) | **RETIRE** (also an FP) |
| en-morning-routine-subject-carryover | one exact `^…$` literal | fires only on the literal | **RETIRE** |
| en-runon-morning-routine-punctuation | one exact `^…$` literal | fires only on the literal | **RETIRE** |

---

## 1. en-hat-biking-summer-runon

### What it matches
Not a single literal — a multi-keyword combination (`isHatBikingSummerRunOn`):
`(i|they) (bought|buy)` **and** `yesterday` **and** `(hat|bicycle|bike)` **and**
one of `(summer|canada|sunny|hot)` / a bike-plan phrase / `someone's coming` /
`summer sucks coming`; with a `(do not|don't|not|no) plan to bike` negative
guard. **But the repair (`repairHatBikingSummerRunOn`) returns one of ~6
hand-written canned sentences** chosen by which keywords are present — it does
not transform the learner's actual words.

### Probe (live engine)
| Input | Output | Problem |
|-------|--------|---------|
| `I bought a hat yesterday because it is sunny.` | `I bought a hat yesterday because summer is coming, and it is very sunny.` | not a run-on; **fabricates** "summer is coming" |
| `I bought a bike yesterday, summer is hot.` | `I bought a **hat** yesterday because summer is coming, and it is very sunny.` | input is a **bike**; output says **hat**, drops "hot" |
| `They bought a bicycle yesterday in Canada.` | `I bought a **hat** yesterday because summer is coming, and it is very sunny in Canada.` | wrong subject (they→I), wrong object (bicycle→hat), fabricated clause |
| `Yesterday I bought a nice hat, it was very hot.` | `I bought a hat yesterday because summer is coming, and it is very sunny.` | drops "nice", rewrites "hot"→"sunny", fabricates content |
| `I do not plan to bike this summer.` | _unchanged_ | negative guard holds |

### Case for GENERALIZE
To genuinely help, the rule would need to **parse and restructure** a real
run-on (split clauses, repair punctuation) while **preserving the learner's
content**. That is a real run-on/clause-splitting feature — substantial, and
high FP risk (run-on detection is hard; this matcher already fires on plausible
**non-run-on** single sentences). The canned-output design cannot be generalized
at all — it is a keyword→fixed-string lookup, not a transformation.

### Case for RETIRE
The matcher is simultaneously **too broad** (fires on realistic, grammatical
single sentences a learner could type) and **wrong** (emits a fixed sentence that
fabricates/replaces the input's meaning — bicycle becomes hat). It is a demo
artifact built around a few hand-authored example sentences.

### Recommendation: **RETIRE.**
It is the most urgent of the three — it actively mis-corrects real input, so it
also belongs on the FP/rollback list, not just the stub list. If run-on
correction is a goal, build a content-preserving clause-splitter as new Lane A
work; do not generalize this lookup.

---

## 2. en-morning-routine-subject-carryover

### What it matches
One exact, fully-anchored literal:
`^in the morning,? i wake up and they have a breakfast and coffee and then i go to my office[.?!]?$`

### Probe (live engine)
| Input | Output | Fires? |
|-------|--------|--------|
| `In the morning, I wake up and they have a breakfast and coffee and then I go to my office.` | `In the morning, I wake up, have breakfast and coffee, and then go to my office.` | ✅ the one literal |
| `In the morning, I wake up and I have breakfast and coffee and then I go to my office.` (they→I) | _unchanged_ | ❌ |
| `In the morning I wake up and they have a breakfast and then I go to work.` (shorter, "to work") | _unchanged_ | ❌ |

### Case for GENERALIZE
The underlying error is a **subject carryover** (`I wake up and **they** have
breakfast` — wrong subject). Catching that generally is a coreference /
subject-consistency task with high FP risk — well beyond a regex.

### Case for RETIRE
**No realistic input beyond the single demo literal hits it** — any change to
subject, food, or destination breaks the anchor. It is an inert single-sentence
stub.

### Recommendation: **RETIRE.** Generalizing means a new coreference feature; out
of scope for a literal stub.

---

## 3. en-runon-morning-routine-punctuation

### What it matches
One exact, fully-anchored literal:
`^what do you usually do in the morning\s+nice that sounds like a clear morning routine\s+what do you do after that[.?!]?$`

### Probe (live engine)
| Input | Output | Fires? |
|-------|--------|--------|
| `What do you usually do in the morning nice that sounds like a clear morning routine what do you do after that` | `What do you usually do in the morning? Nice, that sounds like a clear morning routine. What do you do after that?` | ✅ the one literal |
| `What do you usually do in the morning? That sounds like a clear routine. What do you do after?` (already punctuated) | _unchanged_ | ❌ |
| `What do you do in the morning that sounds clear what after that` (paraphrase) | `…after that?` (only `en-question-form-final-mark`) | ❌ this rule |

### Case for GENERALIZE
General run-on **sentence-boundary punctuation** insertion is a genuine NLP task
(where to split, what punctuation) with high FP risk on legitimate long
sentences. Not a regex generalization.

### Case for RETIRE
**Only the one exact literal fires**; paraphrases and pre-punctuated variants do
not. Inert single-sentence stub.

### Recommendation: **RETIRE.** Real run-on punctuation is a separate feature, not
a generalization of this literal.

---

## What Lane A owes back
A generalize-or-retire decision per rule. The evidence above supports **retire
all three**; only `en-hat-biking-summer-runon` carries active harm (it
mis-corrects realistic input), so it is the priority. None can be Pattern-B
golden-locked as-is, which is why they were excluded from the confusable-stress
fixture coverage.
