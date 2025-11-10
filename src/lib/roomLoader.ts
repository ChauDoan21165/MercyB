import { PUBLIC_ROOM_MANIFEST } from "./roomManifest";
import { supabase } from '@/integrations/supabase/client';

export const loadMergedRoom = async (roomId: string, tier: string = 'free') => {
  console.log('=== loadMergedRoom START ===');
  console.log('Input roomId:', roomId);
  console.log('Input tier:', tier);

  // First try to load from database
  try {
    const { data: dbRoom, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle();

    if (dbRoom && !error) {
      console.log('✅ Room loaded from database:', dbRoom.id);
      
      // Transform database format to expected format
      const keywordMenu = {
        en: dbRoom.keywords || [],
        vi: dbRoom.keywords || []
      };

      const merged = Array.isArray(dbRoom.entries) 
        ? dbRoom.entries.map((entry: any, idx: number) => {
            // Extract audio path
            let audioRaw: any;
            if (entry?.audio && typeof entry.audio === 'object') {
              audioRaw = entry.audio.en ?? entry.audio.vi ?? Object.values(entry.audio)[0];
            } else if (entry?.audio) {
              audioRaw = entry.audio;
            }

            let audioPath = audioRaw;
            if (audioPath) {
              let p = String(audioPath);
              // Remove leading slashes and public/ prefix
              p = p.replace(/^\/+/, '').replace(/^public\//, '');
              // Remove audio/(en|vi)/ prefix if present
              p = p.replace(/^audio\/(en|vi)\//, 'audio/');
              // Remove audio/ prefix if present
              p = p.replace(/^audio\//, '');
              
              // Try different path variations based on tier
              const tierMatch = roomId.match(/-(free|vip1|vip2|vip3|vip4)$/);
              const currentTier = tierMatch ? tierMatch[1] : tier || 'free';
              
              // If filename doesn't have tier suffix, try adding it
              if (!p.toLowerCase().includes(currentTier) && !p.toLowerCase().includes('_free') && !p.toLowerCase().includes('_vip')) {
                const baseName = p.replace(/\.mp3$/i, '');
                audioPath = `/audio/${baseName}_${currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}.mp3`;
              } else {
                audioPath = `/audio/${p}`;
              }
              
              console.log('🎵 Audio path constructed:', audioPath, 'from raw:', audioRaw);
            }

            const keywordEn = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0 
              ? entry.keywords_en[0] 
              : entry.slug || `entry-${idx}`;
            const keywordVi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0 
              ? entry.keywords_vi[0] 
              : entry.slug || '';

            const replyEn = entry.essay_en || entry.essay?.en || 
                            entry.copy?.en || entry.content?.en || 
                            entry.copy_en || entry.content_en || '';
            const replyVi = entry.essay_vi || entry.essay?.vi || 
                            entry.copy?.vi || entry.content?.vi || 
                            entry.copy_vi || entry.content_vi || '';

            return {
              ...entry,
              audio: audioPath || undefined,
              keywordEn,
              keywordVi,
              replyEn,
              replyVi
            };
          })
        : [];

      return {
        merged,
        keywordMenu,
        audioBasePath: '/audio/'
      };
    }
  } catch (dbError) {
    console.log('⚠️ Database load failed, falling back to static files:', dbError);
  }

  // Fallback to static JSON files (original logic)
  const hasTier = /(\-|_)(free|vip1|vip2|vip3|vip4)($|\-)/.test(roomId);
  const normalizedTier = ['free','vip1','vip2','vip3','vip4'].includes(tier) ? tier : 'free';
  const manifestKey = hasTier ? roomId.replace(/_/g, '-') : `${roomId.replace(/_/g, '-')}-${normalizedTier}`;

  try {
    const directKey = roomId ? roomId.replace(/_/g, '-') : '';
    const filename = PUBLIC_ROOM_MANIFEST[manifestKey] || (directKey ? PUBLIC_ROOM_MANIFEST[directKey] : undefined);
    let jsonData: any = null;

    const candidates: string[] = [];
    
    if (filename) {
      candidates.push(`/${encodeURI(filename)}`);
    }

    const base = manifestKey.replace(/-/g, '_');
    const directBase = (roomId || '').replace(/-/g, '_');
    
    candidates.push(`/data/${base}.json`);
    candidates.push(`/data/${base.toLowerCase()}.json`);
    if (directBase) {
      candidates.push(`/data/${directBase}.json`);
      candidates.push(`/data/${directBase.toLowerCase()}.json`);
    }
    
    const parts = base.split('_');
    const tierIndex = parts.findIndex(p => ['free', 'vip1', 'vip2', 'vip3', 'vip4'].includes(p.toLowerCase()));
    
    if (tierIndex > 0) {
      const beforeTier = parts.slice(0, tierIndex)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      const tierPart = parts[tierIndex].toLowerCase();
      const titleCaseWithLowerTier = [...beforeTier, tierPart].join('_');
      candidates.push(`/data/${titleCaseWithLowerTier}.json`);
    }
    
    const titleCase = base
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('_');
    candidates.push(`/data/${titleCase}.json`);

    if (tierIndex >= 0) {
      const tierFolder = parts[tierIndex].toLowerCase();
      candidates.push(`/data/${tierFolder}/${base}.json`);
      candidates.push(`/data/${tierFolder}/${base.toLowerCase()}.json`);
      if (tierIndex > 0) {
        const beforeTier = parts.slice(0, tierIndex)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        const tierPart = parts[tierIndex].toLowerCase();
        const titleCaseWithLowerTier = [...beforeTier, tierPart].join('_');
        candidates.push(`/data/${tierFolder}/${titleCaseWithLowerTier}.json`);
      }
      candidates.push(`/data/${tierFolder}/${titleCase}.json`);
    }

    for (const path of candidates) {
      try {
        const resp = await fetch(path);
        if (!resp.ok) continue;
        const text = await resp.text();
        try {
          jsonData = JSON.parse(text);
          console.log('✅ Room loaded from static file:', path);
          break;
        } catch {
          continue;
        }
      } catch {
        // try next
      }
    }

    if (!jsonData) {
      throw new Error(`JSON not found for ${manifestKey} in candidates: ${candidates.join(', ')}`);
    }

    let keywordMenu: { en: string[]; vi: string[] } = { en: [], vi: [] };
    
    if (Array.isArray(jsonData?.entries)) {
      const enList: string[] = [];
      const viList: string[] = [];

      (jsonData.entries as any[]).forEach((entry: any) => {
        const titleText = typeof entry.title === 'object' ? entry.title?.en : entry.title;
        const en = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0
          ? String(entry.keywords_en[0])
          : String(titleText || entry.slug || '').trim();
        const titleViText = typeof entry.title === 'object' ? entry.title?.vi : '';
        const vi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0
          ? String(entry.keywords_vi[0])
          : (titleViText || entry.slug || '');
        if (en) {
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
      if (!audioRaw) audioRaw = entry?.audio_en || entry?.audio_vi || entry?.meta?.audio_file || entry?.audioFile || entry?.copy?.audio || entry?.content?.audio;

      let audioPath = audioRaw;
      if (audioPath) {
        let p = String(audioPath);
        // Remove leading slashes and public/ prefix
        p = p.replace(/^\/+/, '').replace(/^public\//, '');
        // Remove audio/(en|vi)/ prefix if present
        p = p.replace(/^audio\/(en|vi)\//, 'audio/');
        // Remove audio/ prefix if present
        p = p.replace(/^audio\//, '');
        
        // Try different path variations based on tier and room
        const tierMatch = manifestKey.match(/-(free|vip1|vip2|vip3|vip4)$/);
        const currentTier = tierMatch ? tierMatch[1] : 'free';
        
        // If filename doesn't have tier suffix, try adding it
        if (!p.toLowerCase().includes(currentTier) && !p.toLowerCase().includes('_free') && !p.toLowerCase().includes('_vip')) {
          const baseName = p.replace(/\.mp3$/i, '');
          // Try with tier suffix
          audioPath = `/audio/${baseName}_${currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}.mp3`;
        } else {
          audioPath = `/audio/${p}`;
        }
        
        console.log('🎵 Audio path constructed:', audioPath, 'from raw:', audioRaw);
      }

      const keywordEn = Array.isArray(entry.keywords_en) && entry.keywords_en.length > 0 
        ? entry.keywords_en[0] 
        : (typeof entry.title === 'object' ? entry.title?.en : entry.title) || entry.slug || `entry-${idx}`;
      const keywordVi = Array.isArray(entry.keywords_vi) && entry.keywords_vi.length > 0 
        ? entry.keywords_vi[0] 
        : (typeof entry.title === 'object' ? entry.title?.vi : '') || entry.slug || '';
      
      const replyEn = entry.essay_en || entry.essay?.en || 
                      entry.copy?.en || entry.content?.en || 
                      entry.copy_en || entry.content_en || '';
      const replyVi = entry.essay_vi || entry.essay?.vi || 
                      entry.copy?.vi || entry.content?.vi || 
                      entry.copy_vi || entry.content_vi || '';
      
      return {
        ...entry,
        audio: audioPath || undefined,
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
