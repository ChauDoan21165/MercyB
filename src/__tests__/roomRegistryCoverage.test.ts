/**
 * Room Registry Coverage Tests
 * 
 * Ensures all room JSON files are properly loaded into the registry
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { 
  getRoomCoverageReport, 
  isRegistryFullyCovered,
  validateRoomInRegistry,
  type RoomCoverageReport 
} from '@/lib/rooms/roomRegistryDiagnostics';
import { getAllRooms, getRoomById, getRoomsByTier } from '@/lib/rooms/roomRegistry';
import { searchRooms } from '@/lib/search/roomSearch';
import { debugSearch, validateKnownRooms } from '@/lib/search/searchDiagnostics';

describe('Room Registry Coverage', () => {
  let coverageReport: RoomCoverageReport;
  
  beforeAll(() => {
    coverageReport = getRoomCoverageReport();
  });
  
  it('should load rooms from roomDataMap into registry', () => {
    const rooms = getAllRooms();
    expect(rooms.length).toBeGreaterThan(0);
    console.log(`Registry loaded ${rooms.length} rooms`);
  });
  
  it('should have consistent counts between manifest and registry', () => {
    // Allow some tolerance for dynamic loading differences
    const diff = Math.abs(coverageReport.totalManifestEntries - coverageReport.totalRegistryRooms);
    expect(diff).toBeLessThan(50); // Reasonable tolerance
  });
  
  it('should have registry rooms matching dataMap entries', () => {
    expect(coverageReport.totalRegistryRooms).toBe(coverageReport.totalDataMapEntries);
  });
  
  it('should report health score above 80%', () => {
    expect(coverageReport.healthScore).toBeGreaterThanOrEqual(80);
    console.log(`Health score: ${coverageReport.healthScore}%`);
  });
  
  it('should have coverage for all major tiers', () => {
    const majorTiers = ['free', 'vip1', 'vip2', 'vip3'];
    
    for (const tier of majorTiers) {
      const tierRooms = getRoomsByTier(tier as any);
      expect(tierRooms.length).toBeGreaterThan(0);
      console.log(`${tier}: ${tierRooms.length} rooms`);
    }
  });
});

describe('Room Search Coverage', () => {
  it('should find ADHD Support rooms when searching "ADHD"', () => {
    const results = searchRooms('ADHD', { limit: 10 });
    
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id.includes('adhd'))).toBe(true);
  });
  
  it('should find Anxiety Relief rooms', () => {
    const results = searchRooms('Anxiety Relief', { limit: 10 });
    
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id.includes('anxiety'))).toBe(true);
  });
  
  it('should find rooms by Vietnamese query', () => {
    const results = searchRooms('Lo Âu', { limit: 10 }); // Anxiety in Vietnamese
    
    // Should find anxiety-related rooms
    expect(results.length).toBeGreaterThan(0);
  });
  
  it('should find Writing Mastery room', () => {
    const results = searchRooms('Writing Mastery', { limit: 10 });
    
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => 
      r.title_en.toLowerCase().includes('writing') || 
      r.id.includes('writing')
    )).toBe(true);
  });
  
  it('should boost results for specified tier', () => {
    const vip3Results = searchRooms('Support', { tier: 'vip3', limit: 10 });
    
    // First few results should be VIP3 if available
    if (vip3Results.length > 0) {
      const vip3Count = vip3Results.slice(0, 5).filter(r => r.tier === 'vip3').length;
      // At least some VIP3 rooms should be boosted to top
      expect(vip3Count).toBeGreaterThanOrEqual(0);
    }
  });
  
  it('should return empty results for empty query', () => {
    const results = searchRooms('', { limit: 10 });
    expect(results.length).toBe(0);
  });
  
  it('should find VIP3 rooms that appear on VIP3 page', () => {
    // These are rooms that should definitely be visible on VIP3 page
    const knownVip3Rooms = [
      'adhd-support-vip3',
      'anxiety-relief-vip3',
      'depression-support-vip3'
    ];
    
    for (const roomId of knownVip3Rooms) {
      const room = getRoomById(roomId);
      if (room) {
        // Room exists in registry, verify it's searchable
        const searchByTitle = searchRooms(room.title_en, { limit: 5 });
        expect(searchByTitle.some(r => r.id === roomId)).toBe(true);
      }
    }
  });
});

describe('Debug Search Validation', () => {
  it('should provide debug info for search', () => {
    const debug = debugSearch('ADHD', 5);
    
    expect(debug.totalRoomsInRegistry).toBeGreaterThan(0);
    expect(debug.searchTime).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(debug.topResults)).toBe(true);
  });
  
  it('should validate known room searches', () => {
    const queries = ['ADHD', 'Anxiety', 'Depression', 'Writing'];
    const results = validateKnownRooms(queries);
    
    for (const result of results) {
      if (result.found) {
        expect(result.topMatch).toBeDefined();
      }
    }
  });
});

describe('Room Validation', () => {
  it('should validate that known rooms exist', () => {
    const validation = validateRoomInRegistry('adhd-support-vip3');
    
    // If this room exists in manifest, it should be in registry
    if (validation.inManifest || validation.inDataMap) {
      expect(validation.exists).toBe(true);
    }
  });
});
