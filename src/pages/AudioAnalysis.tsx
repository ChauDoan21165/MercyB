import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Music, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioStatus {
  jsonFile: string;
  totalAudioRefs: number;
  missingAudio: string[];
  foundAudio: string[];
}

export default function AudioAnalysis() {
  const [results, setResults] = useState<AudioStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMp3Files, setAllMp3Files] = useState<string[]>([]);

  useEffect(() => {
    analyzeAudioFiles();
  }, []);

  const analyzeAudioFiles = async () => {
    setLoading(true);
    
    // List of JSON files to check (based on known patterns)
    const jsonPatterns = [
      // ADHD Support
      'ADHD_Support_free.json', 'ADHD_Support_vip1.json', 'ADHD_Support_vip2.json', 'ADHD_Support_vip3.json',
      // AI
      'AI_free.json', 'AI_VIP1.json', 'AI_VIP2.json', 'AI_VIP3.json',
      // Anxiety
      'Anxiety_Relief_Free.json', 'Anxiety_Relief_VIP1.json', 'Anxiety_Relief_VIP2.json', 'Anxiety_Relief_VIP3.json',
      // Bipolar
      'Bipolar_Support_free.json', 'Bipolar_Support_vip1.json', 'Bipolar_Support_vip2.json', 'Bipolar_Support_vip3.json',
      // Burnout
      'Burnout_Recovery_Free.json', 'Burnout_Recovery_VIP1.json', 'Burnout_Recovery_VIP2.json', 'Burnout_Recovery_VIP3.json',
      // Chronic Pain
      'Chronic_Pain_free.json', 'Chronic_Pain_vip1.json', 'Chronic_Pain_vip2.json', 'Chronic_Pain_vip3.json',
      // Confidence
      'Confidence_Free.json', 'Confidence_VIP1.json', 'Confidence_VIP2.json', 'Confidence_VIP3.json',
      // Depression
      'Depression_Support_Free.json', 'Depression_Support_VIP1.json', 'Depression_Support_VIP2.json', 'Depression_Support_VIP3.json',
      // God With Us
      'God_With_Us_Free.json', 'God_With_Us_VIP1.json', 'God_With_Us_VIP2.json', 'God_With_Us_VIP3.json',
      // Grief
      'Grief_Support_Free.json', 'Grief_Support_VIP1.json', 'Grief_Support_VIP2.json', 'Grief_Support_VIP3.json',
      // Human Rights
      'Human_Right_Free.json', 'Human_Right_VIP1.json', 'Human_Right_VIP2.json', 'Human_Right_VIP3.json',
      // Meaning of Life
      'Meaning_Of_Life_Free.json', 'Meaning_Of_Life_VIP1.json', 'Meaning_Of_Life_VIP2.json', 'Meaning_Of_Life_VIP3.json',
      // Mental Health
      'Mental_Health_Free.json', 'Mental_Health_VIP1.json', 'Mental_Health_VIP2.json', 'Mental_Health_VIP3.json',
      // Mental Sharpness
      'Mental_Sharpness_Free.json', 'Mental_Sharpness_VIP1.json', 'Mental_Sharpness_VIP2.json', 'Mental_Sharpness_VIP3.json',
      // Mindfulness
      'Mindfulness_Free.json', 'Mindfulness_VIP1.json', 'Mindfulness_VIP2.json', 'Mindfulness_VIP3.json',
      // Nutrition
      'Nutrition_Free.json', 'Nutrition_VIP1.json', 'Nutrition_VIP2.json', 'Nutrition_VIP3.json',
      // OCD
      'Ocd_Support_free.json', 'Ocd_Support_vip1.json', 'Ocd_Support_vip2.json', 'Ocd_Support_vip3.json',
      // Philosophy
      'Philosophy_Of_Everyday_Free.json', 'Philosophy_Of_Everyday_VIP1.json', 'Philosophy_Of_Everyday_VIP2.json', 'Philosophy_Of_Everyday_VIP3.json',
      // PTSD
      'Ptsd_Support_Free.json', 'Ptsd_Support_VIP1.json', 'Ptsd_Support_VIP2.json', 'Ptsd_Support_VIP3.json',
      // Shadow Work
      'Shadow_Work_Free.json', 'Shadow_Work_VIP1.json', 'Shadow_Work_VIP2.json', 'Shadow_Work_VIP3.json',
      // Sleep
      'Sleep_Free.json', 'Sleep_VIP1.json', 'Sleep_VIP2.json', 'Sleep_VIP3.json',
      // Social Anxiety
      'Social_Anxiety_Free.json', 'Social_Anxiety_VIP1.json', 'Social_Anxiety_VIP2.json', 'Social_Anxiety_VIP3.json',
      // Soulmate
      'Soulmate_Free.json', 'Soulmate_VIP1.json', 'Soulmate_VIP2.json', 'Soulmate_VIP3.json',
      // Stoicism
      'Stoicism_Free.json', 'Stoicism_VIP1.json', 'Stoicism_VIP2.json', 'Stoicism_VIP3.json',
      // Stress
      'Stress_Free.json', 'Stress_VIP1.json', 'Stress_VIP2.json', 'Stress_VIP3.json',
      // Weight Loss
      'Weight_Loss_And_Fitness_Free.json', 'Weight_Loss_And_Fitness_VIP1.json', 'Weight_Loss_And_Fitness_VIP2.json', 'Weight_Loss_And_Fitness_VIP3.json',
      // Women's Health
      'Women_Health_Free.json', 'Women_Health_VIP1.json', 'Women_Health_VIP2.json', 'Women_Health_VIP3.json',
    ];

    const foundMp3s: Set<string> = new Set();
    const analysisResults: AudioStatus[] = [];

    for (const jsonFile of jsonPatterns) {
      try {
        const res = await fetch(`/${jsonFile}`);
        if (!res.ok) continue;

        const data = await res.json();
        const missingAudio: string[] = [];
        const foundAudio: string[] = [];

        const entries = data.entries || [];
        for (const entry of entries) {
          let audioPath = '';
          
          // Extract audio path from various formats
          if (typeof entry.audio === 'string') {
            audioPath = entry.audio;
          } else if (entry.audio?.en) {
            audioPath = entry.audio.en;
          }

          if (audioPath) {
            // Clean the path
            const cleanPath = audioPath.replace(/^\//, '').replace(/^audio\/(en|vi)\//, '');
            
            // Check if MP3 exists
            try {
              const audioRes = await fetch(`/${cleanPath}`, { method: 'HEAD' });
              if (audioRes.ok) {
                foundAudio.push(cleanPath);
                foundMp3s.add(cleanPath);
              } else {
                missingAudio.push(cleanPath);
              }
            } catch {
              missingAudio.push(cleanPath);
            }
          }
        }

        if (missingAudio.length > 0) {
          analysisResults.push({
            jsonFile,
            totalAudioRefs: missingAudio.length + foundAudio.length,
            missingAudio,
            foundAudio
          });
        }
      } catch (error) {
        // File doesn't exist or invalid JSON - skip
      }
    }

    // Sort by most missing first
    analysisResults.sort((a, b) => b.missingAudio.length - a.missingAudio.length);
    
    setResults(analysisResults);
    setAllMp3Files(Array.from(foundMp3s).sort());
    setLoading(false);
  };

  const uniqueMissingFiles = [...new Set(results.flatMap(r => r.missingAudio))].sort();
  const totalMissing = uniqueMissingFiles.length;

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Audio Files Analysis</h1>
        <p className="text-muted-foreground">
          Analysis of all JSON files and their audio file references
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={analyzeAudioFiles} disabled={loading}>
          {loading ? "Scanning..." : "Refresh Analysis"}
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">Analyzing all JSON files and audio references...</div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Card */}
          <Card className={totalMissing > 0 ? "border-orange-200 dark:border-orange-800" : "border-green-200 dark:border-green-800"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {totalMissing > 0 ? (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                Summary
              </CardTitle>
              <CardDescription>
                Found {allMp3Files.length} unique MP3 files • {results.length} JSON files with missing audio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalMissing > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <p className="text-sm font-medium">
                      {totalMissing} unique MP3 file(s) are missing
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Missing MP3 Files:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {uniqueMissingFiles.map((file, i) => (
                        <code key={i} className="text-xs bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-2 rounded block">
                          {file}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    All JSON files have their audio files! 🎉
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">JSON Files with Missing Audio</h2>
              {results.map((result, idx) => (
                <Card key={idx} className="border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{result.jsonFile}</CardTitle>
                        <CardDescription>
                          {result.totalAudioRefs} audio references • {result.foundAudio.length} found • {result.missingAudio.length} missing
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {result.missingAudio.length} Missing
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Missing Audio Files ({result.missingAudio.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        {result.missingAudio.map((audio, i) => (
                          <code key={i} className="pl-6 text-red-700 dark:text-red-300 block">
                            ❌ {audio}
                          </code>
                        ))}
                      </div>
                    </div>

                    {result.foundAudio.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Found Audio Files ({result.foundAudio.length})
                        </h4>
                        <div className="grid grid-cols-1 gap-1 text-xs max-h-32 overflow-y-auto">
                          {result.foundAudio.map((audio, i) => (
                            <code key={i} className="pl-6 text-green-700 dark:text-green-300 block">
                              ✓ {audio}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
