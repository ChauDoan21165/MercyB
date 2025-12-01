// JSON Corruption Engine - Corrupt room JSON to test error handling

import type { RoomJson } from '@/lib/roomMaster/roomMasterTypes';

export function corruptId(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  // Make ID violate snake_case rule
  const corruptionType = Math.random();
  if (corruptionType < 0.33) {
    corrupted.id = room.id.toUpperCase(); // ALL_CAPS
  } else if (corruptionType < 0.66) {
    corrupted.id = room.id.replace(/_/g, '-'); // kebab-case
  } else {
    corrupted.id = room.id.replace(/_/g, ' '); // spaces
  }
  
  return corrupted;
}

export function corruptTier(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  // Make tier invalid
  const invalidTiers = ['vip99', 'premium', 'invalid', 'ADMIN', ''];
  corrupted.tier = invalidTiers[Math.floor(Math.random() * invalidTiers.length)];
  
  return corrupted;
}

export function removeEntries(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  // Remove all entries or make array invalid
  const corruptionType = Math.random();
  if (corruptionType < 0.5) {
    corrupted.entries = [];
  } else {
    // @ts-ignore - intentionally breaking type
    corrupted.entries = null;
  }
  
  return corrupted;
}

export function duplicateEntries(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  if (corrupted.entries && corrupted.entries.length > 0) {
    // Duplicate first entry 5 times
    const firstEntry = corrupted.entries[0];
    corrupted.entries = [
      firstEntry,
      { ...firstEntry },
      { ...firstEntry },
      { ...firstEntry },
      { ...firstEntry },
      ...corrupted.entries.slice(1),
    ];
  }
  
  return corrupted;
}

export function randomDeleteFields(room: RoomJson): RoomJson {
  const corrupted = JSON.parse(JSON.stringify(room));
  
  // Randomly delete critical fields
  const fieldsToDelete = ['title', 'tier', 'entries', 'id'];
  const fieldToDelete = fieldsToDelete[Math.floor(Math.random() * fieldsToDelete.length)];
  
  // @ts-ignore
  delete corrupted[fieldToDelete];
  
  return corrupted;
}

export function scrambleAudioNames(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  if (corrupted.entries && Array.isArray(corrupted.entries)) {
    corrupted.entries = corrupted.entries.map(entry => ({
      ...entry,
      audio: `corrupted_${Math.random().toString(36).substring(7)}.mp3`,
    }));
  }
  
  return corrupted;
}

export function corruptKeywords(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  if (corrupted.entries && Array.isArray(corrupted.entries)) {
    corrupted.entries = corrupted.entries.map(entry => ({
      ...entry,
      keywords_en: [], // Empty keywords
      keywords_vi: [], // Empty keywords
    }));
  }
  
  return corrupted;
}

export function corruptCopy(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  if (corrupted.entries && Array.isArray(corrupted.entries)) {
    corrupted.entries = corrupted.entries.map(entry => ({
      ...entry,
      copy: {
        en: '', // Empty copy
        vi: '', // Empty copy
      },
    }));
  }
  
  return corrupted;
}

export function corruptSlug(room: RoomJson): RoomJson {
  const corrupted = { ...room };
  
  if (corrupted.entries && Array.isArray(corrupted.entries)) {
    corrupted.entries = corrupted.entries.map(entry => ({
      ...entry,
      slug: entry.slug.toUpperCase().replace(/-/g, '_'), // Violate kebab-case
    }));
  }
  
  return corrupted;
}

export function applyRandomCorruption(room: RoomJson): RoomJson {
  const corruptions = [
    corruptId,
    corruptTier,
    removeEntries,
    duplicateEntries,
    randomDeleteFields,
    scrambleAudioNames,
    corruptKeywords,
    corruptCopy,
    corruptSlug,
  ];
  
  const corruption = corruptions[Math.floor(Math.random() * corruptions.length)];
  return corruption(room);
}
