// Writing Quality Scorer - Compute quality metrics for room content

import type { RoomJson, QualityScore } from './roomMasterTypes';

export function scoreWritingQuality(room: RoomJson): QualityScore {
  let claritySum = 0;
  let densitySum = 0;
  let sentimentSum = 0;
  let repetitionSum = 0;
  let count = 0;

  // Score intro
  if (room.content?.en) {
    const score = scoreText(room.content.en);
    claritySum += score.clarity;
    densitySum += score.density;
    sentimentSum += score.sentiment;
    repetitionSum += score.repetition;
    count++;
  }

  // Score entries
  room.entries?.forEach(entry => {
    if (entry.copy?.en) {
      const score = scoreText(entry.copy.en);
      claritySum += score.clarity;
      densitySum += score.density;
      sentimentSum += score.sentiment;
      repetitionSum += score.repetition;
      count++;
    }
  });

  if (count === 0) {
    return { clarity: 0, density: 0, sentiment: 0, repetition: 0, overall: 0 };
  }

  const clarity = claritySum / count;
  const density = densitySum / count;
  const sentiment = sentimentSum / count;
  const repetition = repetitionSum / count;

  // Overall score: weighted average
  const overall = (clarity * 0.3 + density * 0.2 + (sentiment + 1) * 50 * 0.3 + (100 - repetition) * 0.2);

  return {
    clarity,
    density,
    sentiment,
    repetition,
    overall: Math.round(overall),
  };
}

interface TextScore {
  clarity: number; // 0-100
  density: number; // 0-100
  sentiment: number; // -1 to 1
  repetition: number; // 0-100 (lower is better)
}

function scoreText(text: string): TextScore {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
  
  // Clarity: prefer shorter sentences
  const avgSentenceLength = words.length / Math.max(sentences.length, 1);
  const clarity = Math.max(0, 100 - avgSentenceLength * 2); // Penalty for long sentences

  // Density: prefer moderate word length
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1);
  const density = Math.max(0, 100 - Math.abs(avgWordLength - 6) * 10);

  // Sentiment: detect positive/negative words
  const sentiment = detectSentiment(text);

  // Repetition: detect repeated words
  const repetition = detectRepetition(words);

  return { clarity, density, sentiment, repetition };
}

function detectSentiment(text: string): number {
  const positive = ['good', 'great', 'excellent', 'wonderful', 'amazing', 'happy', 'joy', 'hope', 'love', 'calm', 'peace', 'safe', 'warm', 'gentle'];
  const negative = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'fear', 'anger', 'hate', 'pain', 'hurt', 'danger', 'crisis'];

  const lowerText = text.toLowerCase();
  
  const positiveCount = positive.filter(word => lowerText.includes(word)).length;
  const negativeCount = negative.filter(word => lowerText.includes(word)).length;

  const total = positiveCount + negativeCount;
  if (total === 0) return 0;

  return (positiveCount - negativeCount) / total;
}

function detectRepetition(words: string[]): number {
  const freq = new Map<string, number>();
  
  words.forEach(word => {
    freq.set(word, (freq.get(word) || 0) + 1);
  });

  const repeated = [...freq.values()].filter(count => count > 1).length;
  const repetitionRatio = repeated / Math.max(words.length, 1);

  return Math.min(100, repetitionRatio * 200);
}