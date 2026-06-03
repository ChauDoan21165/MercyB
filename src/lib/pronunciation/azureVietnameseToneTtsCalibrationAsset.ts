// Generated from Azure vi-VN Neural TTS as TTS-proxy calibration data.
// Contains derived f0 contours and metadata only; raw audio is not persisted.

import type { VietnameseToneReferenceIngestionResult } from "./vietnameseToneReferenceIngestion";
import type { SupportedVietnameseToneCalibrationContour } from "./vietnameseToneCalibration";

export const azureVietnameseToneTtsCalibrationAsset = {
  "source": "azure-tts-proxy",
  "locale": "vi-VN",
  "generatedAt": "2026-06-03T01:56:49.638Z",
  "voices": [
    {
      "shortName": "vi-VN-HoaiMyNeural",
      "gender": "Female"
    },
    {
      "shortName": "vi-VN-NamMinhNeural",
      "gender": "Male"
    }
  ],
  "recordingCount": 24,
  "acceptedRecordingCount": 13,
  "droppedRecordingCount": 11,
  "acceptedByTone": {
    "sac": 4,
    "huyen": 2,
    "ngang": 1,
    "hoi": 2,
    "nga": 2,
    "nang": 2
  },
  "droppedByReason": {
    "unexpected_contour": 3,
    "unsupported_low_quality": 6,
    "low_voicing": 2
  },
  "speakerMedianF0Hz": {
    "vi-VN-HoaiMyNeural": 202.925,
    "vi-VN-NamMinhNeural": 134.86
  },
  "acceptedRecordings": [
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ma-sac",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "sac",
      "target": {
        "syllable": "má",
        "tone": "sac",
        "expectedContour": "rising"
      },
      "observedContour": "rising",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0
          },
          {
            "timeMs": 40,
            "f0Hz": 1.137,
            "confidence": 0.87
          },
          {
            "timeMs": 60,
            "f0Hz": 1.136,
            "confidence": 0.92
          },
          {
            "timeMs": 80,
            "f0Hz": 1.14,
            "confidence": 0.92
          },
          {
            "timeMs": 100,
            "f0Hz": 1.167,
            "confidence": 0.79
          },
          {
            "timeMs": 120,
            "f0Hz": 1.147,
            "confidence": 0.91
          },
          {
            "timeMs": 140,
            "f0Hz": 1.147,
            "confidence": 0.9
          },
          {
            "timeMs": 160,
            "f0Hz": 1.154,
            "confidence": 0.89
          },
          {
            "timeMs": 180,
            "f0Hz": 1.17,
            "confidence": 0.89
          },
          {
            "timeMs": 200,
            "f0Hz": 1.187,
            "confidence": 0.89
          },
          {
            "timeMs": 220,
            "f0Hz": 1.224,
            "confidence": 0.89
          },
          {
            "timeMs": 240,
            "f0Hz": 1.254,
            "confidence": 0.92
          },
          {
            "timeMs": 260,
            "f0Hz": 1.298,
            "confidence": 0.91
          },
          {
            "timeMs": 280,
            "f0Hz": 1.386,
            "confidence": 0.89
          },
          {
            "timeMs": 300,
            "f0Hz": 1.477,
            "confidence": 0.88
          },
          {
            "timeMs": 320,
            "f0Hz": null,
            "confidence": 0
          },
          {
            "timeMs": 340,
            "f0Hz": null,
            "confidence": 0
          },
          {
            "timeMs": 360,
            "f0Hz": null,
            "confidence": 0
          },
          {
            "timeMs": 380,
            "f0Hz": null,
            "confidence": 0
          }
        ],
        "durationMs": 402.69,
        "voicedRatio": 0.74,
        "medianF0Hz": 1.169,
        "extractionConfidence": 0.84,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ma-huyen",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "huyen",
      "target": {
        "syllable": "mà",
        "tone": "huyen",
        "expectedContour": "falling"
      },
      "observedContour": "falling",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.127,
            "confidence": 0.72
          },
          {
            "timeMs": 40,
            "f0Hz": 1.09,
            "confidence": 0.89
          },
          {
            "timeMs": 60,
            "f0Hz": 1.086,
            "confidence": 0.92
          },
          {
            "timeMs": 80,
            "f0Hz": 1.088,
            "confidence": 0.92
          },
          {
            "timeMs": 100,
            "f0Hz": 1.131,
            "confidence": 0.83
          },
          {
            "timeMs": 120,
            "f0Hz": 1.078,
            "confidence": 0.84
          },
          {
            "timeMs": 140,
            "f0Hz": 1.062,
            "confidence": 0.88
          },
          {
            "timeMs": 160,
            "f0Hz": 1.046,
            "confidence": 0.87
          },
          {
            "timeMs": 180,
            "f0Hz": 1.025,
            "confidence": 0.86
          },
          {
            "timeMs": 200,
            "f0Hz": 1.006,
            "confidence": 0.85
          },
          {
            "timeMs": 220,
            "f0Hz": 0.981,
            "confidence": 0.86
          },
          {
            "timeMs": 240,
            "f0Hz": 0.966,
            "confidence": 0.85
          },
          {
            "timeMs": 260,
            "f0Hz": 0.945,
            "confidence": 0.86
          },
          {
            "timeMs": 280,
            "f0Hz": 0.944,
            "confidence": 0.86
          },
          {
            "timeMs": 300,
            "f0Hz": 0.925,
            "confidence": 0.84
          },
          {
            "timeMs": 320,
            "f0Hz": 0.93,
            "confidence": 0.87
          },
          {
            "timeMs": 340,
            "f0Hz": 0.919,
            "confidence": 0.82
          },
          {
            "timeMs": 360,
            "f0Hz": 0.891,
            "confidence": 0.8
          },
          {
            "timeMs": 380,
            "f0Hz": null,
            "confidence": 0.5777182049271339
          }
        ],
        "durationMs": 410,
        "voicedRatio": 0.95,
        "medianF0Hz": 1.015,
        "extractionConfidence": 0.92,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ma-hoi",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "hoi",
      "target": {
        "syllable": "mả",
        "tone": "hoi",
        "expectedContour": "unsupported"
      },
      "observedContour": "level",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.098,
            "confidence": 0.75
          },
          {
            "timeMs": 40,
            "f0Hz": 1.08,
            "confidence": 0.88
          },
          {
            "timeMs": 60,
            "f0Hz": 1.076,
            "confidence": 0.91
          },
          {
            "timeMs": 80,
            "f0Hz": 1.087,
            "confidence": 0.92
          },
          {
            "timeMs": 100,
            "f0Hz": 1.165,
            "confidence": 0.73
          },
          {
            "timeMs": 120,
            "f0Hz": 1.038,
            "confidence": 0.76
          },
          {
            "timeMs": 140,
            "f0Hz": 1.022,
            "confidence": 0.83
          },
          {
            "timeMs": 160,
            "f0Hz": 0.99,
            "confidence": 0.77
          },
          {
            "timeMs": 180,
            "f0Hz": null,
            "confidence": 0.6409974557389805
          },
          {
            "timeMs": 200,
            "f0Hz": 0.897,
            "confidence": 0.7
          },
          {
            "timeMs": 220,
            "f0Hz": 0.85,
            "confidence": 0.7
          },
          {
            "timeMs": 240,
            "f0Hz": 0.824,
            "confidence": 0.74
          },
          {
            "timeMs": 260,
            "f0Hz": 0.82,
            "confidence": 0.83
          },
          {
            "timeMs": 280,
            "f0Hz": 0.826,
            "confidence": 0.8
          },
          {
            "timeMs": 300,
            "f0Hz": 0.836,
            "confidence": 0.79
          },
          {
            "timeMs": 320,
            "f0Hz": 0.889,
            "confidence": 0.69
          },
          {
            "timeMs": 340,
            "f0Hz": 0.967,
            "confidence": 0.87
          },
          {
            "timeMs": 360,
            "f0Hz": 1.078,
            "confidence": 0.84
          },
          {
            "timeMs": 380,
            "f0Hz": 1.163,
            "confidence": 0.89
          },
          {
            "timeMs": 400,
            "f0Hz": 1.228,
            "confidence": 0.87
          },
          {
            "timeMs": 420,
            "f0Hz": 1.224,
            "confidence": 0.78
          }
        ],
        "durationMs": 454.13,
        "voicedRatio": 0.95,
        "medianF0Hz": 1.03,
        "extractionConfidence": 0.91,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ma-nga",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "nga",
      "target": {
        "syllable": "mã",
        "tone": "nga",
        "expectedContour": "unsupported"
      },
      "observedContour": "falling",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.157,
            "confidence": 0.75
          },
          {
            "timeMs": 40,
            "f0Hz": 1.109,
            "confidence": 0.91
          },
          {
            "timeMs": 60,
            "f0Hz": 1.109,
            "confidence": 0.92
          },
          {
            "timeMs": 80,
            "f0Hz": 1.13,
            "confidence": 0.91
          },
          {
            "timeMs": 100,
            "f0Hz": null,
            "confidence": 0.6704715117140037
          },
          {
            "timeMs": 120,
            "f0Hz": 1.067,
            "confidence": 0.88
          },
          {
            "timeMs": 140,
            "f0Hz": 1.043,
            "confidence": 0.82
          },
          {
            "timeMs": 160,
            "f0Hz": 1.01,
            "confidence": 0.8
          },
          {
            "timeMs": 180,
            "f0Hz": 0.969,
            "confidence": 0.78
          },
          {
            "timeMs": 200,
            "f0Hz": 0.946,
            "confidence": 0.72
          },
          {
            "timeMs": 220,
            "f0Hz": 0.894,
            "confidence": 0.83
          },
          {
            "timeMs": 240,
            "f0Hz": 0.881,
            "confidence": 0.81
          },
          {
            "timeMs": 260,
            "f0Hz": 0.881,
            "confidence": 0.85
          },
          {
            "timeMs": 280,
            "f0Hz": 0.9,
            "confidence": 0.82
          },
          {
            "timeMs": 300,
            "f0Hz": 0.933,
            "confidence": 0.85
          },
          {
            "timeMs": 320,
            "f0Hz": 0.954,
            "confidence": 0.86
          },
          {
            "timeMs": 340,
            "f0Hz": 0.891,
            "confidence": 0.82
          },
          {
            "timeMs": 360,
            "f0Hz": 0.935,
            "confidence": 0.75
          },
          {
            "timeMs": 380,
            "f0Hz": null,
            "confidence": 0.5580043542094226
          }
        ],
        "durationMs": 404.75,
        "voicedRatio": 0.89,
        "medianF0Hz": 0.954,
        "extractionConfidence": 0.89,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ma-nang",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "nang",
      "target": {
        "syllable": "mạ",
        "tone": "nang",
        "expectedContour": "unsupported"
      },
      "observedContour": "falling",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.128,
            "confidence": 0.75
          },
          {
            "timeMs": 40,
            "f0Hz": 1.09,
            "confidence": 0.91
          },
          {
            "timeMs": 60,
            "f0Hz": 1.09,
            "confidence": 0.92
          },
          {
            "timeMs": 80,
            "f0Hz": 1.106,
            "confidence": 0.92
          },
          {
            "timeMs": 100,
            "f0Hz": null,
            "confidence": 0.6353452962760869
          },
          {
            "timeMs": 120,
            "f0Hz": 1.065,
            "confidence": 0.89
          },
          {
            "timeMs": 140,
            "f0Hz": 1.041,
            "confidence": 0.84
          },
          {
            "timeMs": 160,
            "f0Hz": 1.013,
            "confidence": 0.86
          },
          {
            "timeMs": 180,
            "f0Hz": 0.981,
            "confidence": 0.78
          },
          {
            "timeMs": 200,
            "f0Hz": 0.945,
            "confidence": 0.76
          },
          {
            "timeMs": 220,
            "f0Hz": 0.918,
            "confidence": 0.84
          },
          {
            "timeMs": 240,
            "f0Hz": 0.897,
            "confidence": 0.81
          },
          {
            "timeMs": 260,
            "f0Hz": 0.884,
            "confidence": 0.86
          },
          {
            "timeMs": 280,
            "f0Hz": 0.912,
            "confidence": 0.85
          },
          {
            "timeMs": 300,
            "f0Hz": 0.936,
            "confidence": 0.87
          },
          {
            "timeMs": 320,
            "f0Hz": 0.861,
            "confidence": 0.82
          },
          {
            "timeMs": 340,
            "f0Hz": 0.838,
            "confidence": 0.77
          },
          {
            "timeMs": 360,
            "f0Hz": null,
            "confidence": 0.38417993457825717
          }
        ],
        "durationMs": 380,
        "voicedRatio": 0.89,
        "medianF0Hz": 0.963,
        "extractionConfidence": 0.89,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ba-sac",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "sac",
      "target": {
        "syllable": "bá",
        "tone": "sac",
        "expectedContour": "rising"
      },
      "observedContour": "rising",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0.662648852024046
          },
          {
            "timeMs": 40,
            "f0Hz": 1.161,
            "confidence": 0.88
          },
          {
            "timeMs": 60,
            "f0Hz": null,
            "confidence": 0.4976904765246494
          },
          {
            "timeMs": 80,
            "f0Hz": 1.124,
            "confidence": 0.89
          },
          {
            "timeMs": 100,
            "f0Hz": 1.131,
            "confidence": 0.87
          },
          {
            "timeMs": 120,
            "f0Hz": 1.154,
            "confidence": 0.87
          },
          {
            "timeMs": 140,
            "f0Hz": 1.18,
            "confidence": 0.89
          },
          {
            "timeMs": 160,
            "f0Hz": 1.2,
            "confidence": 0.88
          },
          {
            "timeMs": 180,
            "f0Hz": 1.227,
            "confidence": 0.91
          },
          {
            "timeMs": 200,
            "f0Hz": 1.261,
            "confidence": 0.89
          },
          {
            "timeMs": 220,
            "f0Hz": 1.321,
            "confidence": 0.85
          },
          {
            "timeMs": 240,
            "f0Hz": 1.405,
            "confidence": 0.88
          },
          {
            "timeMs": 260,
            "f0Hz": 1.489,
            "confidence": 0.84
          },
          {
            "timeMs": 280,
            "f0Hz": 1.529,
            "confidence": 0.8
          },
          {
            "timeMs": 300,
            "f0Hz": null,
            "confidence": 0.6625745541879215
          },
          {
            "timeMs": 320,
            "f0Hz": null,
            "confidence": 0.2763929141715942
          }
        ],
        "durationMs": 351.19,
        "voicedRatio": 0.75,
        "medianF0Hz": 1.214,
        "extractionConfidence": 0.84,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ba-huyen",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "huyen",
      "target": {
        "syllable": "bà",
        "tone": "huyen",
        "expectedContour": "falling"
      },
      "observedContour": "falling",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0.5303221718781976
          },
          {
            "timeMs": 40,
            "f0Hz": 1.07,
            "confidence": 0.84
          },
          {
            "timeMs": 60,
            "f0Hz": 1.103,
            "confidence": 0.92
          },
          {
            "timeMs": 80,
            "f0Hz": null,
            "confidence": 0.5874898594366784
          },
          {
            "timeMs": 100,
            "f0Hz": 1.065,
            "confidence": 0.76
          },
          {
            "timeMs": 120,
            "f0Hz": 1.046,
            "confidence": 0.86
          },
          {
            "timeMs": 140,
            "f0Hz": 1.043,
            "confidence": 0.87
          },
          {
            "timeMs": 160,
            "f0Hz": 1.028,
            "confidence": 0.87
          },
          {
            "timeMs": 180,
            "f0Hz": 1.008,
            "confidence": 0.86
          },
          {
            "timeMs": 200,
            "f0Hz": 0.981,
            "confidence": 0.84
          },
          {
            "timeMs": 220,
            "f0Hz": 0.954,
            "confidence": 0.86
          },
          {
            "timeMs": 240,
            "f0Hz": 0.939,
            "confidence": 0.86
          },
          {
            "timeMs": 260,
            "f0Hz": 0.928,
            "confidence": 0.86
          },
          {
            "timeMs": 280,
            "f0Hz": 0.942,
            "confidence": 0.85
          },
          {
            "timeMs": 300,
            "f0Hz": 0.93,
            "confidence": 0.84
          },
          {
            "timeMs": 320,
            "f0Hz": 0.883,
            "confidence": 0.83
          },
          {
            "timeMs": 340,
            "f0Hz": 0.843,
            "confidence": 0.74
          },
          {
            "timeMs": 360,
            "f0Hz": null,
            "confidence": 0.31823944020650263
          }
        ],
        "durationMs": 382.69,
        "voicedRatio": 0.83,
        "medianF0Hz": 0.981,
        "extractionConfidence": 0.87,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ba-hoi",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "hoi",
      "target": {
        "syllable": "bả",
        "tone": "hoi",
        "expectedContour": "unsupported"
      },
      "observedContour": "rising",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0.6499791594137647
          },
          {
            "timeMs": 40,
            "f0Hz": 1.078,
            "confidence": 0.9
          },
          {
            "timeMs": 60,
            "f0Hz": 1.163,
            "confidence": 0.77
          },
          {
            "timeMs": 80,
            "f0Hz": null,
            "confidence": 0.33873681495940655
          },
          {
            "timeMs": 100,
            "f0Hz": 1.032,
            "confidence": 0.83
          },
          {
            "timeMs": 120,
            "f0Hz": 0.996,
            "confidence": 0.84
          },
          {
            "timeMs": 140,
            "f0Hz": 0.971,
            "confidence": 0.79
          },
          {
            "timeMs": 160,
            "f0Hz": 0.916,
            "confidence": 0.71
          },
          {
            "timeMs": 180,
            "f0Hz": null,
            "confidence": 0.6616339885819706
          },
          {
            "timeMs": 200,
            "f0Hz": 0.838,
            "confidence": 0.71
          },
          {
            "timeMs": 220,
            "f0Hz": 0.803,
            "confidence": 0.74
          },
          {
            "timeMs": 240,
            "f0Hz": 0.799,
            "confidence": 0.81
          },
          {
            "timeMs": 260,
            "f0Hz": 0.816,
            "confidence": 0.71
          },
          {
            "timeMs": 280,
            "f0Hz": 0.83,
            "confidence": 0.72
          },
          {
            "timeMs": 300,
            "f0Hz": null,
            "confidence": 0.6770251117286069
          },
          {
            "timeMs": 320,
            "f0Hz": 0.997,
            "confidence": 0.85
          },
          {
            "timeMs": 340,
            "f0Hz": 1.128,
            "confidence": 0.86
          },
          {
            "timeMs": 360,
            "f0Hz": 1.227,
            "confidence": 0.87
          },
          {
            "timeMs": 380,
            "f0Hz": 1.262,
            "confidence": 0.9
          },
          {
            "timeMs": 400,
            "f0Hz": 1.407,
            "confidence": 0.72
          },
          {
            "timeMs": 420,
            "f0Hz": null,
            "confidence": 0
          }
        ],
        "durationMs": 454.19,
        "voicedRatio": 0.76,
        "medianF0Hz": 0.997,
        "extractionConfidence": 0.82,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ba-nga",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "nga",
      "target": {
        "syllable": "bã",
        "tone": "nga",
        "expectedContour": "unsupported"
      },
      "observedContour": "rising",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0.621378479295775
          },
          {
            "timeMs": 40,
            "f0Hz": 1.103,
            "confidence": 0.9
          },
          {
            "timeMs": 60,
            "f0Hz": 1.169,
            "confidence": 0.74
          },
          {
            "timeMs": 80,
            "f0Hz": null,
            "confidence": 0.6244565476193
          },
          {
            "timeMs": 100,
            "f0Hz": 1.031,
            "confidence": 0.84
          },
          {
            "timeMs": 120,
            "f0Hz": 1.009,
            "confidence": 0.82
          },
          {
            "timeMs": 140,
            "f0Hz": 0.971,
            "confidence": 0.78
          },
          {
            "timeMs": 160,
            "f0Hz": 0.927,
            "confidence": 0.71
          },
          {
            "timeMs": 180,
            "f0Hz": null,
            "confidence": 0.6449493049145842
          },
          {
            "timeMs": 200,
            "f0Hz": 0.843,
            "confidence": 0.8
          },
          {
            "timeMs": 220,
            "f0Hz": 0.831,
            "confidence": 0.82
          },
          {
            "timeMs": 240,
            "f0Hz": 0.845,
            "confidence": 0.8
          },
          {
            "timeMs": 260,
            "f0Hz": 0.869,
            "confidence": 0.72
          },
          {
            "timeMs": 280,
            "f0Hz": 0.933,
            "confidence": 0.81
          },
          {
            "timeMs": 300,
            "f0Hz": 0.998,
            "confidence": 0.8
          },
          {
            "timeMs": 320,
            "f0Hz": 1.117,
            "confidence": 0.87
          },
          {
            "timeMs": 340,
            "f0Hz": 1.209,
            "confidence": 0.87
          },
          {
            "timeMs": 360,
            "f0Hz": 1.231,
            "confidence": 0.87
          },
          {
            "timeMs": 380,
            "f0Hz": 1.244,
            "confidence": 0.77
          }
        ],
        "durationMs": 414.75,
        "voicedRatio": 0.84,
        "medianF0Hz": 1.003,
        "extractionConfidence": 0.86,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ba-nang",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "nang",
      "target": {
        "syllable": "bạ",
        "tone": "nang",
        "expectedContour": "unsupported"
      },
      "observedContour": "falling",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0.6132359699667569
          },
          {
            "timeMs": 40,
            "f0Hz": 1.073,
            "confidence": 0.9
          },
          {
            "timeMs": 60,
            "f0Hz": 1.108,
            "confidence": 0.89
          },
          {
            "timeMs": 80,
            "f0Hz": null,
            "confidence": 0.495233671732098
          },
          {
            "timeMs": 100,
            "f0Hz": 1.034,
            "confidence": 0.85
          },
          {
            "timeMs": 120,
            "f0Hz": 1.02,
            "confidence": 0.84
          },
          {
            "timeMs": 140,
            "f0Hz": 1,
            "confidence": 0.88
          },
          {
            "timeMs": 160,
            "f0Hz": 0.974,
            "confidence": 0.81
          },
          {
            "timeMs": 180,
            "f0Hz": 0.939,
            "confidence": 0.81
          },
          {
            "timeMs": 200,
            "f0Hz": 0.908,
            "confidence": 0.83
          },
          {
            "timeMs": 220,
            "f0Hz": 0.877,
            "confidence": 0.82
          },
          {
            "timeMs": 240,
            "f0Hz": 0.863,
            "confidence": 0.86
          },
          {
            "timeMs": 260,
            "f0Hz": 0.865,
            "confidence": 0.83
          },
          {
            "timeMs": 280,
            "f0Hz": 0.903,
            "confidence": 0.86
          },
          {
            "timeMs": 300,
            "f0Hz": 0.898,
            "confidence": 0.82
          },
          {
            "timeMs": 320,
            "f0Hz": 0.841,
            "confidence": 0.83
          },
          {
            "timeMs": 340,
            "f0Hz": null,
            "confidence": 0.614236690381196
          }
        ],
        "durationMs": 377.38,
        "voicedRatio": 0.82,
        "medianF0Hz": 0.924,
        "extractionConfidence": 0.87,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ma",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "ngang",
      "target": {
        "syllable": "ma",
        "tone": "ngang",
        "expectedContour": "level"
      },
      "observedContour": "level",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0.4113536477356907
          },
          {
            "timeMs": 40,
            "f0Hz": 0.995,
            "confidence": 0.76
          },
          {
            "timeMs": 60,
            "f0Hz": 1,
            "confidence": 0.8
          },
          {
            "timeMs": 80,
            "f0Hz": null,
            "confidence": 0.6377204272813086
          },
          {
            "timeMs": 100,
            "f0Hz": 1.012,
            "confidence": 0.75
          },
          {
            "timeMs": 120,
            "f0Hz": 1.013,
            "confidence": 0.77
          },
          {
            "timeMs": 140,
            "f0Hz": 1.008,
            "confidence": 0.75
          },
          {
            "timeMs": 160,
            "f0Hz": 1.006,
            "confidence": 0.75
          },
          {
            "timeMs": 180,
            "f0Hz": 1.001,
            "confidence": 0.74
          },
          {
            "timeMs": 200,
            "f0Hz": 0.999,
            "confidence": 0.76
          },
          {
            "timeMs": 220,
            "f0Hz": 0.993,
            "confidence": 0.73
          },
          {
            "timeMs": 240,
            "f0Hz": 0.973,
            "confidence": 0.77
          },
          {
            "timeMs": 260,
            "f0Hz": 0.963,
            "confidence": 0.72
          },
          {
            "timeMs": 280,
            "f0Hz": null,
            "confidence": 0.6696237281875324
          },
          {
            "timeMs": 300,
            "f0Hz": null,
            "confidence": 0.6537860330527321
          },
          {
            "timeMs": 320,
            "f0Hz": null,
            "confidence": 0.6480968487503204
          }
        ],
        "durationMs": 356.19,
        "voicedRatio": 0.69,
        "medianF0Hz": 1,
        "extractionConfidence": 0.77,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ma-sac",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "sac",
      "target": {
        "syllable": "má",
        "tone": "sac",
        "expectedContour": "rising"
      },
      "observedContour": "rising",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": null,
            "confidence": 0.35950210682411354
          },
          {
            "timeMs": 40,
            "f0Hz": 0.99,
            "confidence": 0.79
          },
          {
            "timeMs": 60,
            "f0Hz": 0.982,
            "confidence": 0.77
          },
          {
            "timeMs": 80,
            "f0Hz": null,
            "confidence": 0.5899303159363929
          },
          {
            "timeMs": 100,
            "f0Hz": 0.974,
            "confidence": 0.77
          },
          {
            "timeMs": 120,
            "f0Hz": 0.962,
            "confidence": 0.73
          },
          {
            "timeMs": 140,
            "f0Hz": 0.97,
            "confidence": 0.76
          },
          {
            "timeMs": 160,
            "f0Hz": 0.981,
            "confidence": 0.77
          },
          {
            "timeMs": 180,
            "f0Hz": 0.999,
            "confidence": 0.78
          },
          {
            "timeMs": 200,
            "f0Hz": 1.031,
            "confidence": 0.72
          },
          {
            "timeMs": 220,
            "f0Hz": 1.079,
            "confidence": 0.7
          },
          {
            "timeMs": 240,
            "f0Hz": 1.122,
            "confidence": 0.79
          },
          {
            "timeMs": 260,
            "f0Hz": 1.18,
            "confidence": 0.72
          },
          {
            "timeMs": 280,
            "f0Hz": 1.237,
            "confidence": 0.83
          },
          {
            "timeMs": 300,
            "f0Hz": 1.288,
            "confidence": 0.77
          },
          {
            "timeMs": 320,
            "f0Hz": null,
            "confidence": 0.5034363811837446
          }
        ],
        "durationMs": 353.56,
        "voicedRatio": 0.81,
        "medianF0Hz": 0.999,
        "extractionConfidence": 0.83,
        "reason": "ok"
      }
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ba-sac",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "sac",
      "target": {
        "syllable": "bá",
        "tone": "sac",
        "expectedContour": "rising"
      },
      "observedContour": "rising",
      "normalizedContour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.186,
            "confidence": 0.7
          },
          {
            "timeMs": 40,
            "f0Hz": null,
            "confidence": 0.6503307802642481
          },
          {
            "timeMs": 60,
            "f0Hz": null,
            "confidence": 0.233709046192083
          },
          {
            "timeMs": 80,
            "f0Hz": null,
            "confidence": 0.5399459427457531
          },
          {
            "timeMs": 100,
            "f0Hz": 0.927,
            "confidence": 0.72
          },
          {
            "timeMs": 120,
            "f0Hz": null,
            "confidence": 0.6771912792184551
          },
          {
            "timeMs": 140,
            "f0Hz": 0.946,
            "confidence": 0.75
          },
          {
            "timeMs": 160,
            "f0Hz": 0.961,
            "confidence": 0.71
          },
          {
            "timeMs": 180,
            "f0Hz": 0.996,
            "confidence": 0.73
          },
          {
            "timeMs": 200,
            "f0Hz": 1.024,
            "confidence": 0.73
          },
          {
            "timeMs": 220,
            "f0Hz": null,
            "confidence": 0.577601698792266
          },
          {
            "timeMs": 240,
            "f0Hz": 1.192,
            "confidence": 0.73
          },
          {
            "timeMs": 260,
            "f0Hz": 1.239,
            "confidence": 0.71
          },
          {
            "timeMs": 280,
            "f0Hz": 1.355,
            "confidence": 0.76
          },
          {
            "timeMs": 300,
            "f0Hz": 1.413,
            "confidence": 0.8
          },
          {
            "timeMs": 320,
            "f0Hz": 1.431,
            "confidence": 0.69
          }
        ],
        "durationMs": 358.88,
        "voicedRatio": 0.69,
        "medianF0Hz": 1.186,
        "extractionConfidence": 0.76,
        "reason": "ok"
      }
    }
  ],
  "droppedRecordings": [
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ma",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "ngang",
      "reason": "unexpected_contour"
    },
    {
      "id": "tts-proxy-vi-VN-HoaiMyNeural-ba",
      "speakerId": "vi-VN-HoaiMyNeural",
      "tone": "ngang",
      "reason": "unexpected_contour"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ma-huyen",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "huyen",
      "reason": "unexpected_contour"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ma-hoi",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "hoi",
      "reason": "unsupported_low_quality"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ma-nga",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "nga",
      "reason": "unsupported_low_quality"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ma-nang",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "nang",
      "reason": "unsupported_low_quality"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ba",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "ngang",
      "reason": "low_voicing"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ba-huyen",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "huyen",
      "reason": "low_voicing"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ba-hoi",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "hoi",
      "reason": "unsupported_low_quality"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ba-nga",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "nga",
      "reason": "unsupported_low_quality"
    },
    {
      "id": "tts-proxy-vi-VN-NamMinhNeural-ba-nang",
      "speakerId": "vi-VN-NamMinhNeural",
      "tone": "nang",
      "reason": "unsupported_low_quality"
    }
  ],
  "perToneReferenceContours": {
    "sac": {
      "samples": [
        {
          "timeMs": 0,
          "f0Hz": 1.119,
          "confidence": 0.81
        },
        {
          "timeMs": 70,
          "f0Hz": 1.067,
          "confidence": 0.81
        },
        {
          "timeMs": 140,
          "f0Hz": 1.051,
          "confidence": 0.81
        },
        {
          "timeMs": 210,
          "f0Hz": 1.083,
          "confidence": 0.81
        },
        {
          "timeMs": 280,
          "f0Hz": 1.161,
          "confidence": 0.81
        },
        {
          "timeMs": 350,
          "f0Hz": 1.291,
          "confidence": 0.81
        },
        {
          "timeMs": 420,
          "f0Hz": 1.431,
          "confidence": 0.81
        }
      ],
      "durationMs": 420,
      "voicedRatio": 0.75,
      "medianF0Hz": 1.119,
      "extractionConfidence": 0.82,
      "reason": "ok"
    },
    "huyen": {
      "samples": [
        {
          "timeMs": 0,
          "f0Hz": 1.099,
          "confidence": 0.85
        },
        {
          "timeMs": 70,
          "f0Hz": 1.081,
          "confidence": 0.85
        },
        {
          "timeMs": 140,
          "f0Hz": 1.055,
          "confidence": 0.85
        },
        {
          "timeMs": 210,
          "f0Hz": 1.005,
          "confidence": 0.85
        },
        {
          "timeMs": 280,
          "f0Hz": 0.949,
          "confidence": 0.85
        },
        {
          "timeMs": 350,
          "f0Hz": 0.931,
          "confidence": 0.85
        },
        {
          "timeMs": 420,
          "f0Hz": 0.867,
          "confidence": 0.85
        }
      ],
      "durationMs": 420,
      "voicedRatio": 0.89,
      "medianF0Hz": 1.005,
      "extractionConfidence": 0.9,
      "reason": "ok"
    },
    "ngang": {
      "samples": [
        {
          "timeMs": 0,
          "f0Hz": 0.995,
          "confidence": 0.75
        },
        {
          "timeMs": 70,
          "f0Hz": 1.005,
          "confidence": 0.75
        },
        {
          "timeMs": 140,
          "f0Hz": 1.013,
          "confidence": 0.75
        },
        {
          "timeMs": 210,
          "f0Hz": 1.007,
          "confidence": 0.75
        },
        {
          "timeMs": 280,
          "f0Hz": 1,
          "confidence": 0.75
        },
        {
          "timeMs": 350,
          "f0Hz": 0.99,
          "confidence": 0.75
        },
        {
          "timeMs": 420,
          "f0Hz": 0.963,
          "confidence": 0.75
        }
      ],
      "durationMs": 420,
      "voicedRatio": 0.69,
      "medianF0Hz": 1,
      "extractionConfidence": 0.77,
      "reason": "ok"
    }
  },
  "calibrationReferences": [
    {
      "id": "reference-sac",
      "kind": "clean_supported",
      "target": {
        "syllable": "má",
        "tone": "sac",
        "expectedContour": "rising"
      },
      "expectedContour": "rising",
      "contour": {
        "samples": [
          {
            "timeMs": 0,
            "f0Hz": 1.119,
            "confidence": 0.81
          },
          {
            "timeMs": 70,
            "f0Hz": 1.067,
            "confidence": 0.81
          },
          {
            "timeMs": 140,
            "f0Hz": 1.051,
            "confidence": 0.81
          },
          {
            "timeMs": 210,
            "f0Hz": 1.083,
            "confidence": 0.81
          },
          {
            "timeMs": 280,
            "f0Hz": 1.161,
            "confidence": 0.81
          },
          {
            "timeMs": 350,
            "f0Hz": 1.291,
            "confidence": 0.81
          },
          {
            "timeMs": 420,
            "f0Hz": 1.431,
            "confidence": 0.81
          }
        ],
        "durationMs": 420,
        "voicedRatio": 0.75,
        "medianF0Hz": 1.119,
        "extractionConfidence": 0.82,
        "reason": "ok"
      }
    },
    {
      "id": "reference-huyen",
      "kind": "clean_supported",
      "target": {
        "syllable": "mà",
        "tone": "huyen",
        "expectedContour": "falling"
      },
      "expectedContour": "falling",
      "contour": {
        "samples": [
          {
            "timeMs": 0,
            "f0Hz": 1.099,
            "confidence": 0.85
          },
          {
            "timeMs": 70,
            "f0Hz": 1.081,
            "confidence": 0.85
          },
          {
            "timeMs": 140,
            "f0Hz": 1.055,
            "confidence": 0.85
          },
          {
            "timeMs": 210,
            "f0Hz": 1.005,
            "confidence": 0.85
          },
          {
            "timeMs": 280,
            "f0Hz": 0.949,
            "confidence": 0.85
          },
          {
            "timeMs": 350,
            "f0Hz": 0.931,
            "confidence": 0.85
          },
          {
            "timeMs": 420,
            "f0Hz": 0.867,
            "confidence": 0.85
          }
        ],
        "durationMs": 420,
        "voicedRatio": 0.89,
        "medianF0Hz": 1.005,
        "extractionConfidence": 0.9,
        "reason": "ok"
      }
    },
    {
      "id": "reference-ngang",
      "kind": "clean_supported",
      "target": {
        "syllable": "ma",
        "tone": "ngang",
        "expectedContour": "level"
      },
      "expectedContour": "level",
      "contour": {
        "samples": [
          {
            "timeMs": 0,
            "f0Hz": 0.995,
            "confidence": 0.75
          },
          {
            "timeMs": 70,
            "f0Hz": 1.005,
            "confidence": 0.75
          },
          {
            "timeMs": 140,
            "f0Hz": 1.013,
            "confidence": 0.75
          },
          {
            "timeMs": 210,
            "f0Hz": 1.007,
            "confidence": 0.75
          },
          {
            "timeMs": 280,
            "f0Hz": 1,
            "confidence": 0.75
          },
          {
            "timeMs": 350,
            "f0Hz": 0.99,
            "confidence": 0.75
          },
          {
            "timeMs": 420,
            "f0Hz": 0.963,
            "confidence": 0.75
          }
        ],
        "durationMs": 420,
        "voicedRatio": 0.69,
        "medianF0Hz": 1,
        "extractionConfidence": 0.77,
        "reason": "ok"
      }
    },
    {
      "id": "unsupported-hoi",
      "kind": "unsupported",
      "target": {
        "syllable": "mả",
        "tone": "hoi",
        "expectedContour": "unsupported"
      },
      "contour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.098,
            "confidence": 0.75
          },
          {
            "timeMs": 40,
            "f0Hz": 1.08,
            "confidence": 0.88
          },
          {
            "timeMs": 60,
            "f0Hz": 1.076,
            "confidence": 0.91
          },
          {
            "timeMs": 80,
            "f0Hz": 1.087,
            "confidence": 0.92
          },
          {
            "timeMs": 100,
            "f0Hz": 1.165,
            "confidence": 0.73
          },
          {
            "timeMs": 120,
            "f0Hz": 1.038,
            "confidence": 0.76
          },
          {
            "timeMs": 140,
            "f0Hz": 1.022,
            "confidence": 0.83
          },
          {
            "timeMs": 160,
            "f0Hz": 0.99,
            "confidence": 0.77
          },
          {
            "timeMs": 180,
            "f0Hz": null,
            "confidence": 0.6409974557389805
          },
          {
            "timeMs": 200,
            "f0Hz": 0.897,
            "confidence": 0.7
          },
          {
            "timeMs": 220,
            "f0Hz": 0.85,
            "confidence": 0.7
          },
          {
            "timeMs": 240,
            "f0Hz": 0.824,
            "confidence": 0.74
          },
          {
            "timeMs": 260,
            "f0Hz": 0.82,
            "confidence": 0.83
          },
          {
            "timeMs": 280,
            "f0Hz": 0.826,
            "confidence": 0.8
          },
          {
            "timeMs": 300,
            "f0Hz": 0.836,
            "confidence": 0.79
          },
          {
            "timeMs": 320,
            "f0Hz": 0.889,
            "confidence": 0.69
          },
          {
            "timeMs": 340,
            "f0Hz": 0.967,
            "confidence": 0.87
          },
          {
            "timeMs": 360,
            "f0Hz": 1.078,
            "confidence": 0.84
          },
          {
            "timeMs": 380,
            "f0Hz": 1.163,
            "confidence": 0.89
          },
          {
            "timeMs": 400,
            "f0Hz": 1.228,
            "confidence": 0.87
          },
          {
            "timeMs": 420,
            "f0Hz": 1.224,
            "confidence": 0.78
          }
        ],
        "durationMs": 454.13,
        "voicedRatio": 0.95,
        "medianF0Hz": 1.03,
        "extractionConfidence": 0.91,
        "reason": "ok"
      }
    },
    {
      "id": "unsupported-nga",
      "kind": "unsupported",
      "target": {
        "syllable": "mã",
        "tone": "nga",
        "expectedContour": "unsupported"
      },
      "contour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.157,
            "confidence": 0.75
          },
          {
            "timeMs": 40,
            "f0Hz": 1.109,
            "confidence": 0.91
          },
          {
            "timeMs": 60,
            "f0Hz": 1.109,
            "confidence": 0.92
          },
          {
            "timeMs": 80,
            "f0Hz": 1.13,
            "confidence": 0.91
          },
          {
            "timeMs": 100,
            "f0Hz": null,
            "confidence": 0.6704715117140037
          },
          {
            "timeMs": 120,
            "f0Hz": 1.067,
            "confidence": 0.88
          },
          {
            "timeMs": 140,
            "f0Hz": 1.043,
            "confidence": 0.82
          },
          {
            "timeMs": 160,
            "f0Hz": 1.01,
            "confidence": 0.8
          },
          {
            "timeMs": 180,
            "f0Hz": 0.969,
            "confidence": 0.78
          },
          {
            "timeMs": 200,
            "f0Hz": 0.946,
            "confidence": 0.72
          },
          {
            "timeMs": 220,
            "f0Hz": 0.894,
            "confidence": 0.83
          },
          {
            "timeMs": 240,
            "f0Hz": 0.881,
            "confidence": 0.81
          },
          {
            "timeMs": 260,
            "f0Hz": 0.881,
            "confidence": 0.85
          },
          {
            "timeMs": 280,
            "f0Hz": 0.9,
            "confidence": 0.82
          },
          {
            "timeMs": 300,
            "f0Hz": 0.933,
            "confidence": 0.85
          },
          {
            "timeMs": 320,
            "f0Hz": 0.954,
            "confidence": 0.86
          },
          {
            "timeMs": 340,
            "f0Hz": 0.891,
            "confidence": 0.82
          },
          {
            "timeMs": 360,
            "f0Hz": 0.935,
            "confidence": 0.75
          },
          {
            "timeMs": 380,
            "f0Hz": null,
            "confidence": 0.5580043542094226
          }
        ],
        "durationMs": 404.75,
        "voicedRatio": 0.89,
        "medianF0Hz": 0.954,
        "extractionConfidence": 0.89,
        "reason": "ok"
      }
    },
    {
      "id": "unsupported-nang",
      "kind": "unsupported",
      "target": {
        "syllable": "mạ",
        "tone": "nang",
        "expectedContour": "unsupported"
      },
      "contour": {
        "samples": [
          {
            "timeMs": 20,
            "f0Hz": 1.128,
            "confidence": 0.75
          },
          {
            "timeMs": 40,
            "f0Hz": 1.09,
            "confidence": 0.91
          },
          {
            "timeMs": 60,
            "f0Hz": 1.09,
            "confidence": 0.92
          },
          {
            "timeMs": 80,
            "f0Hz": 1.106,
            "confidence": 0.92
          },
          {
            "timeMs": 100,
            "f0Hz": null,
            "confidence": 0.6353452962760869
          },
          {
            "timeMs": 120,
            "f0Hz": 1.065,
            "confidence": 0.89
          },
          {
            "timeMs": 140,
            "f0Hz": 1.041,
            "confidence": 0.84
          },
          {
            "timeMs": 160,
            "f0Hz": 1.013,
            "confidence": 0.86
          },
          {
            "timeMs": 180,
            "f0Hz": 0.981,
            "confidence": 0.78
          },
          {
            "timeMs": 200,
            "f0Hz": 0.945,
            "confidence": 0.76
          },
          {
            "timeMs": 220,
            "f0Hz": 0.918,
            "confidence": 0.84
          },
          {
            "timeMs": 240,
            "f0Hz": 0.897,
            "confidence": 0.81
          },
          {
            "timeMs": 260,
            "f0Hz": 0.884,
            "confidence": 0.86
          },
          {
            "timeMs": 280,
            "f0Hz": 0.912,
            "confidence": 0.85
          },
          {
            "timeMs": 300,
            "f0Hz": 0.936,
            "confidence": 0.87
          },
          {
            "timeMs": 320,
            "f0Hz": 0.861,
            "confidence": 0.82
          },
          {
            "timeMs": 340,
            "f0Hz": 0.838,
            "confidence": 0.77
          },
          {
            "timeMs": 360,
            "f0Hz": null,
            "confidence": 0.38417993457825717
          }
        ],
        "durationMs": 380,
        "voicedRatio": 0.89,
        "medianF0Hz": 0.963,
        "extractionConfidence": 0.89,
        "reason": "ok"
      }
    }
  ],
  "calibrationSummary": {
    "passed": true,
    "cleanSupportedAccuracy": 1,
    "cleanSupportedTotal": 3,
    "cleanSupportedCorrect": 3,
    "unsupportedTotal": 3,
    "unsupportedAbstained": 3
  }
} as const;

export type AzureVietnameseToneTtsCalibrationAsset = typeof azureVietnameseToneTtsCalibrationAsset;

export function azureVietnameseToneTtsCalibrationIngestionResult(): VietnameseToneReferenceIngestionResult {
  const calibrationReferences = expandCalibrationReferences(azureVietnameseToneTtsCalibrationAsset.acceptedRecordings);
  return JSON.parse(JSON.stringify({
    calibrationReferences,
    perToneReferenceContours: { ...azureVietnameseToneTtsCalibrationAsset.perToneReferenceContours },
    acceptedRecordings: [...azureVietnameseToneTtsCalibrationAsset.acceptedRecordings],
    droppedRecordings: [...azureVietnameseToneTtsCalibrationAsset.droppedRecordings],
    speakerMedianF0Hz: { ...azureVietnameseToneTtsCalibrationAsset.speakerMedianF0Hz },
  })) as VietnameseToneReferenceIngestionResult;
}

function expandCalibrationReferences(
  acceptedRecordings: AzureVietnameseToneTtsCalibrationAsset["acceptedRecordings"],
): VietnameseToneReferenceIngestionResult["calibrationReferences"] {
  return acceptedRecordings.map((recording) => {
    if (recording.tone === "sac" || recording.tone === "huyen" || recording.tone === "ngang") {
      return {
        id: `reference-${recording.id}`,
        kind: "clean_supported",
        target: recording.target,
        expectedContour: recording.target.expectedContour as SupportedVietnameseToneCalibrationContour,
        contour: cloneContour(recording.normalizedContour),
      };
    }

    return {
      id: `unsupported-${recording.id}`,
      kind: "unsupported",
      target: recording.target,
      contour: cloneContour(recording.normalizedContour),
    };
  });
}

function cloneContour(contour: AzureVietnameseToneTtsCalibrationAsset["acceptedRecordings"][number]["normalizedContour"]): VietnameseToneReferenceIngestionResult["calibrationReferences"][number]["contour"] {
  return {
    ...contour,
    samples: contour.samples.map((sample) => ({ ...sample })),
  };
}
