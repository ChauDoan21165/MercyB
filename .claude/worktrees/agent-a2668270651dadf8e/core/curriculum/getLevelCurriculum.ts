// core/curriculum/getLevelCurriculum.ts

import level1 from "./level_1.json";
import level2 from "./level_2.json";
import { LevelCurriculum } from "../types/curriculum";

const curriculumMap: Record<number, LevelCurriculum> = {
  1: level1 as LevelCurriculum,
  2: level2 as LevelCurriculum,
};

export function getLevelCurriculum(level: number): LevelCurriculum {
  return curriculumMap[level];
}