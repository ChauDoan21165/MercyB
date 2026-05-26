// FILE: PlacementScreen.tsx
// PATH: src/screens/PlacementScreen.tsx
//
// Purpose:
// - Simple MVP placement test that can (optionally) set currentLevelId (1..9)
// - Saves result into repo (UserProgress) and routes to TrainHome
//
// What it does:
// 1) Collect quick self-report (confidence + weekly time)
// 2) Run a tiny quiz (6 questions)
// 3) Compute suggestedLevelId (1..9)
// 4) User chooses: Apply level OR keep current
//
// Notes:
// - This is deliberately lightweight + deterministic.
// - Later you can swap the quiz for real adaptive testing without changing the screen contract.

import React, { useMemo, useState } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity } from "react-native";

import type { UserProgress } from "../core/types/session";
import type { SkillId } from "../core/types/curriculum";

import { loadUserProgress, saveUserProgress } from "../core/storage/repo";

type PlacementParams = {
  userId?: string;
};

interface Props {
  route: { params?: PlacementParams };
  navigation: any;
}

type QuizQ = {
  id: string;
  skill: SkillId;
  prompt: string;
  choices: { id: string; label: string; correct: boolean }[];
};

const QUIZ: QuizQ[] = [
  {
    id: "q1_vocab",
    skill: "vocabulary",
    prompt: 'Choose the best meaning of "reliable".',
    choices: [
      { id: "a", label: "Can be trusted", correct: true },
      { id: "b", label: "Very expensive", correct: false },
      { id: "c", label: "Hard to understand", correct: false },
      { id: "d", label: "Very fast", correct: false },
    ],
  },
  {
    id: "q2_grammar",
    skill: "grammar",
    prompt: "Choose the correct sentence.",
    choices: [
      { id: "a", label: "She don't like coffee.", correct: false },
      { id: "b", label: "She doesn't like coffee.", correct: true },
      { id: "c", label: "She doesn't likes coffee.", correct: false },
      { id: "d", label: "She not like coffee.", correct: false },
    ],
  },
  {
    id: "q3_reading",
    skill: "reading",
    prompt: "Reading: If something is 'optional', it is…",
    choices: [
      { id: "a", label: "Required", correct: false },
      { id: "b", label: "Chosen if you want", correct: true },
      { id: "c", label: "Dangerous", correct: false },
      { id: "d", label: "Very slow", correct: false },
    ],
  },
  {
    id: "q4_pron",
    skill: "pronunciation",
    prompt: "Which word has the same vowel sound as 'see'?",
    choices: [
      { id: "a", label: "sit", correct: false },
      { id: "b", label: "seat", correct: true },
      { id: "c", label: "set", correct: false },
      { id: "d", label: "sat", correct: false },
    ],
  },
  {
    id: "q5_listening",
    skill: "listening",
    prompt: "Listening strategy: If you miss a word, you should…",
    choices: [
      { id: "a", label: "Stop and replay immediately every time", correct: false },
      { id: "b", label: "Panic and quit", correct: false },
      { id: "c", label: "Keep going; catch the main idea", correct: true },
      { id: "d", label: "Ignore everything", correct: false },
    ],
  },
  {
    id: "q6_writing",
    skill: "writing",
    prompt: "Choose the best punctuation.",
    choices: [
      { id: "a", label: "However I went anyway.", correct: false },
      { id: "b", label: "However, I went anyway.", correct: true },
      { id: "c", label: "However; I went anyway.", correct: false },
      { id: "d", label: "However: I went anyway.", correct: false },
    ],
  },
];

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function nowISO(): string {
  return new Date().toISOString();
}

function ensureUserId(existing?: string | null): string {
  const t = (existing ?? "").trim();
  if (t) return t;
  return `user_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function computeSuggestedLevel(args: {
  correctCount: number;
  confidence0to4: number; // 0..4
  weeklyMinutesBucket: number; // 0..3
}): number {
  // Base score from quiz (0..6)
  const quiz = clamp(args.correctCount, 0, QUIZ.length);

  // Convert to 1..9 baseline:
  // 0-1 -> 1, 2 -> 2, 3 -> 3, 4 -> 4, 5 -> 5, 6 -> 6 (then add modifiers)
  let level = 1 + quiz;

  // Confidence nudges (0..4)
  // low confidence -> -1, mid -> 0, high -> +1
  if (args.confidence0to4 <= 1) level -= 1;
  if (args.confidence0to4 >= 3) level += 1;

  // Time commitment nudges (0..3)
  // more time can sustain a higher starting point (small nudge)
  if (args.weeklyMinutesBucket >= 2) level += 1;

  return clamp(level, 1, 9);
}

function ChoicePill(props: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 999,
        marginRight: 10,
        marginTop: 10,
        opacity: props.selected ? 1 : 0.75,
      }}
    >
      <Text style={{ fontWeight: props.selected ? "800" : "600" }}>{props.label}</Text>
    </TouchableOpacity>
  );
}

export default function PlacementScreen({ route, navigation }: Props) {
  const stored = useMemo(() => loadUserProgress(), []);
  const userId = useMemo(
    () => ensureUserId(route?.params?.userId ?? stored?.userId),
    [route?.params?.userId, stored?.userId]
  );

  // Stepper
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");

  // Self-report
  const [confidence0to4, setConfidence0to4] = useState<number>(2); // 0..4
  const [weeklyMinutesBucket, setWeeklyMinutesBucket] = useState<number>(1); // 0..3

  // Quiz answers: questionId -> choiceId
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Result
  const result = useMemo(() => {
    const correctCount = QUIZ.reduce((sum, q) => {
      const picked = answers[q.id];
      const isCorrect = q.choices.find((c) => c.id === picked)?.correct ?? false;
      return sum + (isCorrect ? 1 : 0);
    }, 0);

    const suggestedLevelId = computeSuggestedLevel({
      correctCount,
      confidence0to4,
      weeklyMinutesBucket,
    });

    return { correctCount, suggestedLevelId };
  }, [answers, confidence0to4, weeklyMinutesBucket]);

  function canFinishQuiz(): boolean {
    return QUIZ.every((q) => Boolean(answers[q.id]));
  }

  function applySuggestedLevel() {
    const p = loadUserProgress();

    const base: UserProgress =
      p ??
      ({
        userId,
        currentLevelId: 1,
        mastery: {} as any,
        attemptsInCurrentLevel: 0,
        completedDrillIds: [],
      } as UserProgress);

    const updated: UserProgress = {
      ...base,
      userId,
      currentLevelId: result.suggestedLevelId,
      // Reset attempts when changing starting level so gating math is sane.
      attemptsInCurrentLevel: 0,
      // Optional metadata (kept as any so you don’t have to expand types yet)
      ...( {
        placement: {
          takenAtISO: nowISO(),
          correctCount: result.correctCount,
          total: QUIZ.length,
          confidence0to4,
          weeklyMinutesBucket,
          suggestedLevelId: result.suggestedLevelId,
        },
      } as any ),
    };

    saveUserProgress(updated);

    navigation.reset?.({
      index: 0,
      routes: [{ name: "TrainHome", params: { userId } }],
    });
    navigation.navigate("TrainHome", { userId });
  }

  function keepCurrentLevel() {
    // still store placement record (optional), but don’t change level
    const p = loadUserProgress();
    if (p) {
      saveUserProgress({
        ...p,
        ...( {
          placement: {
            takenAtISO: nowISO(),
            correctCount: result.correctCount,
            total: QUIZ.length,
            confidence0to4,
            weeklyMinutesBucket,
            suggestedLevelId: result.suggestedLevelId,
            applied: false,
          },
        } as any ),
      });
    }

    navigation.navigate("TrainHome", { userId });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Placement</Text>
      <Text style={{ marginTop: 10, fontSize: 15, opacity: 0.85 }}>
        Quick calibration. Not perfect—good enough to start training.
      </Text>

      {/* INTRO */}
      {step === "intro" && (
        <>
          <View style={{ marginTop: 18, padding: 16, borderWidth: 1, borderRadius: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "800" }}>Confidence</Text>
            <Text style={{ marginTop: 6, opacity: 0.8 }}>
              How confident are you in English right now?
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <ChoicePill label="0: New" selected={confidence0to4 === 0} onPress={() => setConfidence0to4(0)} />
              <ChoicePill label="1: Low" selected={confidence0to4 === 1} onPress={() => setConfidence0to4(1)} />
              <ChoicePill label="2: Medium" selected={confidence0to4 === 2} onPress={() => setConfidence0to4(2)} />
              <ChoicePill label="3: High" selected={confidence0to4 === 3} onPress={() => setConfidence0to4(3)} />
              <ChoicePill label="4: Very High" selected={confidence0to4 === 4} onPress={() => setConfidence0to4(4)} />
            </View>
          </View>

          <View style={{ marginTop: 14, padding: 16, borderWidth: 1, borderRadius: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "800" }}>Weekly time</Text>
            <Text style={{ marginTop: 6, opacity: 0.8 }}>
              How much can you train per week?
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <ChoicePill
                label="0: <30 min"
                selected={weeklyMinutesBucket === 0}
                onPress={() => setWeeklyMinutesBucket(0)}
              />
              <ChoicePill
                label="1: 30–90 min"
                selected={weeklyMinutesBucket === 1}
                onPress={() => setWeeklyMinutesBucket(1)}
              />
              <ChoicePill
                label="2: 2–4 hours"
                selected={weeklyMinutesBucket === 2}
                onPress={() => setWeeklyMinutesBucket(2)}
              />
              <ChoicePill
                label="3: 5+ hours"
                selected={weeklyMinutesBucket === 3}
                onPress={() => setWeeklyMinutesBucket(3)}
              />
            </View>
          </View>

          <View style={{ marginTop: 18 }}>
            <Button title="Start Quiz" onPress={() => setStep("quiz")} />
            <View style={{ height: 12 }} />
            <Button title="Skip for now" onPress={() => navigation.navigate("TrainHome", { userId })} />
          </View>
        </>
      )}

      {/* QUIZ */}
      {step === "quiz" && (
        <>
          <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "800" }}>
            Mini Quiz ({Object.keys(answers).length}/{QUIZ.length})
          </Text>

          {QUIZ.map((q, idx) => (
            <View
              key={q.id}
              style={{ marginTop: 14, padding: 16, borderWidth: 1, borderRadius: 12 }}
            >
              <Text style={{ fontWeight: "800" }}>{idx + 1}. {q.prompt}</Text>
              <Text style={{ marginTop: 6, opacity: 0.7 }}>Skill: {q.skill}</Text>

              <View style={{ marginTop: 10 }}>
                {q.choices.map((c) => {
                  const selected = answers[q.id] === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: c.id }))}
                      style={{
                        padding: 12,
                        borderWidth: 1,
                        borderRadius: 12,
                        marginTop: 10,
                        opacity: selected ? 1 : 0.8,
                      }}
                    >
                      <Text style={{ fontWeight: selected ? "800" : "600" }}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={{ marginTop: 18 }}>
            <Button
              title={canFinishQuiz() ? "See Result" : "Answer all questions"}
              onPress={() => canFinishQuiz() && setStep("result")}
              disabled={!canFinishQuiz()}
            />
            <View style={{ height: 12 }} />
            <Button title="Back" onPress={() => setStep("intro")} />
          </View>
        </>
      )}

      {/* RESULT */}
      {step === "result" && (
        <>
          <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "900" }}>Result</Text>
            <Text style={{ marginTop: 8 }}>
              Correct: <Text style={{ fontWeight: "800" }}>{result.correctCount}</Text> / {QUIZ.length}
            </Text>
            <Text style={{ marginTop: 8, fontSize: 22, fontWeight: "900" }}>
              Suggested Level: {result.suggestedLevelId}
            </Text>

            <Text style={{ marginTop: 10, opacity: 0.8 }}>
              You can apply this now, or keep your current level and adjust later.
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Button title={`Apply & Start Level ${result.suggestedLevelId}`} onPress={applySuggestedLevel} />
            <View style={{ height: 12 }} />
            <Button title="Keep current level" onPress={keepCurrentLevel} />
            <View style={{ height: 12 }} />
            <Button title="Retake" onPress={() => setStep("quiz")} />
          </View>
        </>
      )}

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}