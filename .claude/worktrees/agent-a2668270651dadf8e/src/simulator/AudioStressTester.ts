// Audio Stress Tester - Test audio loading, playback, and stress scenarios

import type { RoomJson } from '@/lib/roomMaster/roomMasterTypes';

export interface AudioStressResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    totalLoads: number;
    successfulLoads: number;
    failedLoads: number;
    avgLoadTime: number;
    maxLoadTime: number;
    concurrentPlaybackIssues: number;
  };
}

export async function audioStressTest(room: RoomJson): Promise<AudioStressResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const loadTimes: number[] = [];
  let successfulLoads = 0;
  let failedLoads = 0;
  let concurrentPlaybackIssues = 0;

  // Test 1: Rapid play/stop/play
  try {
    await testRapidPlayStop(room);
  } catch (error: any) {
    errors.push(`Rapid play/stop test failed: ${error.message}`);
  }

  // Test 2: Load all audio files
  if (room.entries && Array.isArray(room.entries)) {
    for (const entry of room.entries) {
      if (entry.audio) {
        const startTime = Date.now();
        
        try {
          await loadAudioFile(entry.audio);
          const loadTime = Date.now() - startTime;
          loadTimes.push(loadTime);
          successfulLoads++;
          
          if (loadTime > 5000) {
            warnings.push(`Slow audio load: ${entry.audio} took ${loadTime}ms`);
          }
        } catch (error: any) {
          failedLoads++;
          errors.push(`Failed to load audio: ${entry.audio} - ${error.message}`);
        }
      }
    }
  }

  // Test 3: Missing audio file simulation
  try {
    await loadAudioFile('non_existent_file.mp3');
    errors.push('Should have failed to load non-existent audio file');
  } catch {
    // Expected to fail
  }

  // Test 4: Concurrent playback
  try {
    concurrentPlaybackIssues = await testConcurrentPlayback(room);
  } catch (error: any) {
    errors.push(`Concurrent playback test failed: ${error.message}`);
  }

  const totalLoads = successfulLoads + failedLoads;
  const avgLoadTime = loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0;
  const maxLoadTime = loadTimes.length > 0 ? Math.max(...loadTimes) : 0;

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    metrics: {
      totalLoads,
      successfulLoads,
      failedLoads,
      avgLoadTime: Math.round(avgLoadTime),
      maxLoadTime,
      concurrentPlaybackIssues,
    },
  };
}

async function testRapidPlayStop(room: RoomJson): Promise<void> {
  if (!room.entries || room.entries.length === 0) {
    return;
  }

  const firstEntry = room.entries[0];
  if (!firstEntry.audio) {
    return;
  }

  const audio = new Audio(`/audio/${firstEntry.audio}`);

  // Rapid play/stop 10 times
  for (let i = 0; i < 10; i++) {
    audio.play();
    await delay(50);
    audio.pause();
    await delay(50);
  }

  audio.pause();
  audio.src = '';
}

async function loadAudioFile(filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`/audio/${filename}`);
    
    audio.addEventListener('canplaythrough', () => {
      audio.src = '';
      resolve();
    });

    audio.addEventListener('error', () => {
      reject(new Error(`Failed to load ${filename}`));
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error(`Timeout loading ${filename}`));
    }, 10000);
  });
}

async function testConcurrentPlayback(room: RoomJson): Promise<number> {
  if (!room.entries || room.entries.length < 2) {
    return 0;
  }

  let issues = 0;

  // Try to play multiple audio files simultaneously
  const audioElements = room.entries
    .slice(0, 3) // Test first 3 entries
    .filter(e => e.audio)
    .map(e => new Audio(`/audio/${e.audio}`));

  try {
    // Try to play all at once
    await Promise.all(audioElements.map(a => a.play()));
    
    // Check if all are actually playing
    const playing = audioElements.filter(a => !a.paused);
    if (playing.length !== audioElements.length) {
      issues = audioElements.length - playing.length;
    }
  } catch {
    issues = audioElements.length;
  } finally {
    // Clean up
    audioElements.forEach(a => {
      a.pause();
      a.src = '';
    });
  }

  return issues;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function stressTest100Loads(room: RoomJson): Promise<AudioStressResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const loadTimes: number[] = [];
  let successfulLoads = 0;
  let failedLoads = 0;

  if (!room.entries || room.entries.length === 0) {
    return {
      passed: false,
      errors: ['No entries to test'],
      warnings: [],
      metrics: {
        totalLoads: 0,
        successfulLoads: 0,
        failedLoads: 0,
        avgLoadTime: 0,
        maxLoadTime: 0,
        concurrentPlaybackIssues: 0,
      },
    };
  }

  const startTime = Date.now();

  // Load 100 audio files in 10 seconds
  for (let i = 0; i < 100; i++) {
    const entry = room.entries[i % room.entries.length];
    
    if (entry.audio) {
      const loadStart = Date.now();
      
      try {
        await loadAudioFile(entry.audio);
        const loadTime = Date.now() - loadStart;
        loadTimes.push(loadTime);
        successfulLoads++;
      } catch (error: any) {
        failedLoads++;
        errors.push(`Load ${i + 1} failed: ${error.message}`);
      }
    }
  }

  const totalTime = Date.now() - startTime;

  if (totalTime > 10000) {
    warnings.push(`100 loads took ${totalTime}ms (target: 10000ms)`);
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    metrics: {
      totalLoads: 100,
      successfulLoads,
      failedLoads,
      avgLoadTime: Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length),
      maxLoadTime: Math.max(...loadTimes),
      concurrentPlaybackIssues: 0,
    },
  };
}
