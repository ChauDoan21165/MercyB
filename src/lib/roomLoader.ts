import { PUBLIC_ROOM_MANIFEST } from "./roomManifest";
import { supabase } from '@/integrations/supabase/client';

export const loadMergedRoom = async (roomId: string, tier: string = 'free') => {
  console.log('=== loadMergedRoom START ===');
  console.log('Input roomId:', roomId);
  console.log('Input tier:', tier);

  // Handle room ID normalization
  // Kids Level 1 rooms: URL uses format alphabet_adventure_kids_l1, DB uses alphabet-adventure
  // Regular rooms: URL uses hyphens (vip6-inner-fragmentation), DB uses underscores (vip6_inner_fragmentation)
  let dbRoomId = roomId;
  if (roomId.endsWith('_kids_l1')) {
    // Kids room: strip suffix and convert underscores to hyphens
    dbRoomId = roomId.replace('_kids_l1', '').replace(/_/g, '-');
    console.log('🎯 Kids room detected, mapping:', roomId, '→', dbRoomId);
  } else {
    // Regular room: convert hyphens to underscores
    dbRoomId = roomId.replace(/-/g, '_');
    console.log('🔍 Room ID normalized:', roomId, '→', dbRoomId);
  }

  // First try to load from database
  try {
    const { data: dbRoom, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', dbRoomId)
      .maybeSingle();

    if (dbRoom && !error) {
      console.log('✅ Room loaded from database:', dbRoom.id);
      const hasEntries = Array.isArray(dbRoom.entries) && dbRoom.entries.length > 0;
      const hasKeywords = Array.isArray(dbRoom.keywords) && dbRoom.keywords.length > 0;

      if (hasEntries || hasKeywords) {
        // Transform database format to expected format
        let keywordMenu: { en: string[]; vi: string[] } = { en: [], vi: [] };
      if (hasEntries) {
          const enList: string[] = [];
          const viList: string[] = [];
          const seenKeywords = new Set<string>();
          (dbRoom.entries as any[]).forEach((entry: any) => {
            const titleText = typeof entry.title === 'object' ? entry.title?.en : entry.title;
            const en = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0
              ? String(entry.keywords_en[0])
              : String(titleText || entry.identifier || entry.slug || '').trim();
            const titleViText = typeof entry.title === 'object' ? entry.title?.vi : '';
            const vi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0
              ? String(entry.keywords_vi[0])
              : (titleViText || entry.identifier || entry.slug || '');
            // Deduplicate by English keyword (case-insensitive)
            const normalizedEn = en.toLowerCase().trim();
            if (en && !seenKeywords.has(normalizedEn)) {
              seenKeywords.add(normalizedEn);
              enList.push(en);
              viList.push(vi);
            }
          });
          // If no keywords extracted from entries, use root-level keywords array
          if (enList.length === 0 && hasKeywords) {
            keywordMenu = { en: dbRoom.keywords, vi: dbRoom.keywords };
          } else {
            keywordMenu = { en: enList, vi: viList };
          }
        } else if (hasKeywords) {
          keywordMenu = { en: dbRoom.keywords, vi: dbRoom.keywords };
        }

        const merged = hasEntries 
          ? dbRoom.entries.map((entry: any, idx: number) => {
              // Extract audio path
              let audioRaw: any;
              if (entry?.audio && typeof entry.audio === 'object') {
                audioRaw = entry.audio.en ?? entry.audio.vi ?? Object.values(entry.audio)[0];
              } else if (entry?.audio) {
                audioRaw = entry.audio;
              }

              let audioPath = audioRaw;
              let audioPlaylist: string[] = [];
              
              if (audioPath) {
                const rawString = String(audioPath);
                // Check if audio field contains multiple space-separated files
                const audioFiles = rawString.trim().split(/\s+/).filter(Boolean);
                
                if (audioFiles.length > 1) {
                  // Multiple files - create playlist
                  audioPlaylist = audioFiles.map(file => {
                    let p = file.replace(/^\/+/, '').replace(/^public\//, '');
                    if (p.startsWith('rooms/')) {
                      return `/audio/${p}`;
                    } else {
                      p = p.replace(/^audio\/(en|vi)\//, 'audio/');
                      p = p.replace(/^audio\//, '');
                      return `/audio/${p}`;
                    }
                  });
                  audioPath = audioPlaylist[0]; // First file is the main audio
                  console.log('🎵 Audio playlist constructed:', audioPlaylist, 'from raw:', audioRaw);
                } else {
                  // Single file
                  let p = rawString;
                  p = p.replace(/^\/+/, '').replace(/^public\//, '');
                  
                  if (p.startsWith('rooms/')) {
                    audioPath = `/audio/${p}`;
                  } else {
                    p = p.replace(/^audio\/(en|vi)\//, 'audio/');
                    p = p.replace(/^audio\//, '');
                    audioPath = `/audio/${p}`;
                  }
                  audioPlaylist = [audioPath];
                  console.log('🎵 Audio path constructed:', audioPath, 'from raw:', audioRaw);
                }
              }

              const keywordEn = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0 
                ? entry.keywords_en[0] 
                : entry.identifier || entry.slug || `entry-${idx}`;
              const keywordVi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0 
                ? entry.keywords_vi[0] 
                : entry.identifier || entry.slug || '';

              const replyEn = entry.copy_en || entry.reply_en || entry.essay_en || entry.essay?.en || 
                              entry.copy?.en || entry.content?.en || entry.content_en || '';
              const replyVi = entry.copy_vi || entry.reply_vi || entry.essay_vi || entry.essay?.vi || 
                              entry.copy?.vi || entry.content?.vi || entry.content_vi || '';

              return {
                ...entry,
                slug: entry.slug || entry.identifier,
                audio: audioPath || undefined,
                audioPlaylist: audioPlaylist.length > 0 ? audioPlaylist : undefined,
                keywordEn,
                keywordVi,
                replyEn,
                replyVi,
                essay_en: replyEn,
                essay_vi: replyVi
              };
            })
          : [];

        return {
          merged,
          keywordMenu,
          audioBasePath: '/audio/'
        };
      } else {
        console.warn('⚠️ DB room exists but has no entries/keywords; falling back to static files');
      }
    }
  } catch (dbError) {
    console.log('⚠️ Database load failed, falling back to static files:', dbError);
  }

  // Fallback to static JSON files using canonical resolver
  console.log(`[Static] Loading room ${roomId} from JSON files using canonical resolver`);
  
  try {
    const { loadRoomJson } = await import('./roomJsonResolver');
    const jsonData = await loadRoomJson(roomId);

    let keywordMenu: { en: string[]; vi: string[] } = { en: [], vi: [] };
    
    if (Array.isArray(jsonData?.entries)) {
      const enList: string[] = [];
      const viList: string[] = [];
      const seenKeywords = new Set<string>();

      (jsonData.entries as any[]).forEach((entry: any) => {
        const titleText = typeof entry.title === 'object' ? entry.title?.en : entry.title;
        const en = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0
          ? String(entry.keywords_en[0])
          : String(titleText || entry.slug || '').trim();
        const titleViText = typeof entry.title === 'object' ? entry.title?.vi : '';
        const vi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0
          ? String(entry.keywords_vi[0])
          : (titleViText || entry.slug || '');
        // Deduplicate by English keyword (case-insensitive)
        const normalizedEn = en.toLowerCase().trim();
        if (en && !seenKeywords.has(normalizedEn)) {
          seenKeywords.add(normalizedEn);
          enList.push(en);
          viList.push(vi);
        }
      });

      keywordMenu = { en: enList, vi: viList };
    }

    const merged = Array.isArray(jsonData?.entries) ? (jsonData.entries as any[]).map((entry: any, idx: number) => {
      let audioRaw: any;
      if (entry?.audio && typeof entry.audio === 'object') {
        audioRaw = entry.audio.en ?? entry.audio.vi ?? Object.values(entry.audio)[0];
      } else if (entry?.audio) {
        audioRaw = entry.audio;
      }
      if (!audioRaw) audioRaw = entry?.audio_en || entry?.audio_vi || entry?.audio_file || entry?.meta?.audio_file || entry?.audioFile || entry?.copy?.audio || entry?.content?.audio;

      let audioPath = audioRaw;
      let audioPlaylist: string[] = [];
      
      if (audioPath) {
        const rawString = String(audioPath);
        // Check if audio field contains multiple space-separated files
        const audioFiles = rawString.trim().split(/\s+/).filter(Boolean);
        
        if (audioFiles.length > 1) {
          // Multiple files - create playlist
          audioPlaylist = audioFiles.map(file => {
            let p = file.replace(/^\/+/, '').replace(/^public\//, '');
            if (p.startsWith('rooms/')) {
              return `/audio/${p}`;
            } else {
              p = p.replace(/^audio\/(en|vi)\//, 'audio/');
              p = p.replace(/^audio\//, '');
              return `/audio/${p}`;
            }
          });
          audioPath = audioPlaylist[0]; // First file is the main audio
          console.log('🎵 Audio playlist constructed:', audioPlaylist, 'from raw:', audioRaw);
        } else {
          // Single file
          let p = rawString;
          p = p.replace(/^\/+/, '').replace(/^public\//, '');
          
          if (p.startsWith('rooms/')) {
            audioPath = `/audio/${p}`;
          } else {
            p = p.replace(/^audio\/(en|vi)\//, 'audio/');
            p = p.replace(/^audio\//, '');
            audioPath = `/audio/${p}`;
          }
          audioPlaylist = [audioPath];
          console.log('🎵 Audio path constructed:', audioPath, 'from raw:', audioRaw);
        }
      }

      const keywordEn = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0 
        ? entry.keywords_en[0] 
        : (typeof entry.title === 'object' ? entry.title?.en : entry.title) || entry.slug || `entry-${idx}`;
      const keywordVi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0 
        ? entry.keywords_vi[0] 
        : (typeof entry.title === 'object' ? entry.title?.vi : '') || entry.slug || '';
      
      const replyEn = entry.reply_en || entry.essay_en || entry.essay?.en || 
                      entry.copy?.en || entry.content?.en || 
                      entry.copy_en || entry.content_en || '';
      const replyVi = entry.reply_vi || entry.essay_vi || entry.essay?.vi || 
                      entry.copy?.vi || entry.content?.vi || 
                      entry.copy_vi || entry.content_vi || '';
      
      return {
        ...entry,
        audio: audioPath || undefined,
        audioPlaylist: audioPlaylist.length > 0 ? audioPlaylist : undefined,
        keywordEn,
        keywordVi,
        replyEn,
        replyVi
      };
    }) : [];
    return {
      merged,
      keywordMenu,
      audioBasePath: '/audio/'
    };
  } catch (error) {
    console.error('Failed to load room:', error);
    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: '/audio/'
    };
  }
};
