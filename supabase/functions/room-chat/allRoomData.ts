// Bundled room data - ensures all JSON is included in edge function deployment
// This file imports all room JSON files to guarantee they're available at runtime

import abdominalPain from './data/abdominal_pain.json' with { type: 'json' };
import addiction from './data/addiction.json' with { type: 'json' };
import ai from './data/AI-2.json' with { type: 'json' };
import autoimmune from './data/autoimmune_diseases-2.json' with { type: 'json' };
import burnout from './data/burnout-2.json' with { type: 'json' };
import businessNegotiation from './data/business_negotiation_compass.json' with { type: 'json' };
import businessStrategy from './data/business_strategy-2.json' with { type: 'json' };
import cancerSupport from './data/cancer_support-2.json' with { type: 'json' };
import cardiovascular from './data/cardiovascular-2.json' with { type: 'json' };
import childHealth from './data/child_health-2.json' with { type: 'json' };
import cholesterol from './data/cholesterol2.json' with { type: 'json' };
import chronicFatigue from './data/chronic_fatigue-2.json' with { type: 'json' };
import cough from './data/cough-2.json' with { type: 'json' };
import crypto from './data/crypto.json' with { type: 'json' };
import depression from './data/depression.json' with { type: 'json' };
import diabetes from './data/diabetes.json' with { type: 'json' };
import digestive from './data/digestive_system.json' with { type: 'json' };
import elderlyCare from './data/elderly_care.json' with { type: 'json' };
import endocrine from './data/endocrine_system.json' with { type: 'json' };
import exerciseMedicine from './data/exercise_medicine.json' with { type: 'json' };
import fever from './data/fever.json' with { type: 'json' };
import finance from './data/finance.json' with { type: 'json' };
import fitness from './data/fitness_room.json' with { type: 'json' };
import foodNutrition from './data/food_and_nutrition.json' with { type: 'json' };
import grief from './data/grief.json' with { type: 'json' };
import gutBrain from './data/gut_brain_axis.json' with { type: 'json' };
import headache from './data/headache.json' with { type: 'json' };
import soulMate from './data/how_to_find_your_soul_mate.json' with { type: 'json' };
import husbandDealing from './data/husband_dealing.json' with { type: 'json' };
import hypertension from './data/hypertension.json' with { type: 'json' };
import immuneSystem from './data/immune_system.json' with { type: 'json' };
import immunityBoost from './data/immunity_boost.json' with { type: 'json' };
import injuryBleeding from './data/injury_and_bleeding.json' with { type: 'json' };
import matchmaker from './data/matchmaker_traits.json' with { type: 'json' };
import menHealth from './data/men_health.json' with { type: 'json' };
import mentalHealth from './data/mental_health.json' with { type: 'json' };
import mindfulMovement from './data/mindful_movement.json' with { type: 'json' };
import mindfulnessHealing from './data/mindfulness_and_healing.json' with { type: 'json' };
import nutritionBasics from './data/nutrition_basics.json' with { type: 'json' };
import obesity from './data/obesity.json' with { type: 'json' };
import officeSurvival from './data/office_survival.json' with { type: 'json' };
import painManagement from './data/pain_management.json' with { type: 'json' };
import philosophy from './data/philosophy.json' with { type: 'json' };
import phobia from './data/phobia.json' with { type: 'json' };
import rareDiseases from './data/rare_diseases.json' with { type: 'json' };
import renalHealth from './data/renal_health.json' with { type: 'json' };
import reproductive from './data/reproductive_health.json' with { type: 'json' };
import respiratory from './data/respiratory_system.json' with { type: 'json' };
import screening from './data/screening_and_prevention.json' with { type: 'json' };
import sexuality from './data/sexuality_and_intimacy.json' with { type: 'json' };
import skinHealth from './data/skin_health.json' with { type: 'json' };
import sleepHealth from './data/sleep_health.json' with { type: 'json' };
import socialConnection from './data/social_connection.json' with { type: 'json' };
import speakingCrowd from './data/speaking_crowd.json' with { type: 'json' };
import stoicism from './data/stoicism.json' with { type: 'json' };
import stressAnxiety from './data/stress_and_anxiety.json' with { type: 'json' };
import teen from './data/teen.json' with { type: 'json' };
import toddler from './data/toddler.json' with { type: 'json' };
import trainBrain from './data/train_brain_memory.json' with { type: 'json' };
import trauma from './data/trauma.json' with { type: 'json' };
import wifeDealing from './data/wife_dealing.json' with { type: 'json' };
import womenHealth from './data/women_health.json' with { type: 'json' };

// Map room IDs to their data
export const roomDataMap: Record<string, any> = {
  'abdominal-pain': abdominalPain,
  'addiction': addiction,
  'ai': ai,
  'autoimmune': autoimmune,
  'burnout': burnout,
  'business-negotiation': businessNegotiation,
  'business-strategy': businessStrategy,
  'cancer-support': cancerSupport,
  'cardiovascular': cardiovascular,
  'child-health': childHealth,
  'cholesterol': cholesterol,
  'chronic-fatigue': chronicFatigue,
  'cough': cough,
  'crypto': crypto,
  'depression': depression,
  'diabetes': diabetes,
  'digestive': digestive,
  'elderly-care': elderlyCare,
  'endocrine': endocrine,
  'exercise-medicine': exerciseMedicine,
  'fever': fever,
  'finance': finance,
  'fitness': fitness,
  'food-nutrition': foodNutrition,
  'grief': grief,
  'gut-brain': gutBrain,
  'headache': headache,
  'soul-mate': soulMate,
  'husband-dealing': husbandDealing,
  'hypertension': hypertension,
  'immune-system': immuneSystem,
  'immunity-boost': immunityBoost,
  'injury-bleeding': injuryBleeding,
  'matchmaker': matchmaker,
  'mens-health': menHealth,
  'mental-health': mentalHealth,
  'mindful-movement': mindfulMovement,
  'mindfulness-healing': mindfulnessHealing,
  'nutrition-basics': nutritionBasics,
  'obesity': obesity,
  'office-survival': officeSurvival,
  'pain-management': painManagement,
  'philosophy': philosophy,
  'phobia': phobia,
  'rare-diseases': rareDiseases,
  'renal-health': renalHealth,
  'reproductive': reproductive,
  'respiratory': respiratory,
  'screening': screening,
  'sexuality': sexuality,
  'skin-health': skinHealth,
  'sleep-health': sleepHealth,
  'social-connection': socialConnection,
  'speaking-crowd': speakingCrowd,
  'stoicism': stoicism,
  'stress-anxiety': stressAnxiety,
  'teen': teen,
  'toddler': toddler,
  'train-brain': trainBrain,
  'trauma': trauma,
  'wife-dealing': wifeDealing,
  'womens-health': womenHealth,
};

export function getRoomData(roomId: string): any | null {
  return roomDataMap[roomId] || null;
}
