/**
 * MERCY BLADE UNIVERSAL ROOM STANDARDS
 * Complete standard patterns used across ALL room tiers (VIP1-6, Kids)
 * Use this as the single source of truth for room implementations
 */

export const MERCY_BLADE_STANDARDS = {
  
  // ============= TITLE STRUCTURE =============
  title: {
    // Rainbow gradient styling (used for ALL titles/headers)
    style: {
      background: 'var(--gradient-rainbow)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    className: 'bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent',
    
    // Format: bilingual if different, single if same
    format: (nameEn: string, nameVi: string) => 
      nameEn === nameVi ? nameEn : `${nameEn} / ${nameVi}`,
    
    // Admin buttons (only visible to admins)
    adminButtons: {
      jsonFilename: {
        color: 'bg-primary hover:bg-primary/90', // Red circle
        className: 'w-[1em] h-[1em] rounded-full cursor-pointer flex-shrink-0 transition-colors',
        title: 'Copy JSON filename'
      },
      roomId: {
        color: 'bg-blue-600 hover:bg-blue-700', // Blue circle
        className: 'w-[1em] h-[1em] rounded-full cursor-pointer flex-shrink-0 transition-colors',
        title: 'Copy Room ID'
      }
    }
  },

  // ============= WELCOME MESSAGE =============
  welcomeMessage: {
    withKeywords: (nameEn: string, nameVi: string) => 
      `Welcome to ${nameEn} Room, please click the keyword of the topic you want to discover / Chào mừng bạn đến với phòng ${nameVi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá`,
    
    withoutKeywords: (nameEn: string, nameVi: string) => 
      `Welcome to ${nameEn} Room / Chào mừng bạn đến với phòng ${nameVi}`,
    
    className: 'text-sm text-foreground leading-tight'
  },

  // ============= ROOM ESSAY DISPLAY =============
  roomEssay: {
    // CRITICAL: Always use PairedHighlightedContentWithDictionary
    component: 'PairedHighlightedContentWithDictionary',
    
    // Container styling
    container: {
      className: 'p-4 bg-muted/30 rounded-lg border border-border/50'
    },
    
    // Props pattern
    props: {
      englishContent: '(room essay EN text)',
      vietnameseContent: '(room essay VI text)',
      roomKeywords: '(array of keywords for coloring)',
      onWordClick: '(function to trigger audio)'
    },
    
    // Keyword coloring system
    keywordSystem: {
      loader: 'loadRoomKeywords(roomId)',
      setter: 'setCustomKeywordMappings(keywords)',
      clearer: 'clearCustomKeywordMappings()',
      getter: 'getKeywordColor(text)'
    }
  },

  // ============= AUDIO SYSTEM =============
  audio: {
    component: 'AudioPlayer',
    pathPrefix: '/audio/',
    
    // Props pattern
    props: {
      audioPath: '(full path with /audio/ prefix)',
      isPlaying: '(boolean state)',
      onPlayPause: '(toggle function)',
      onEnded: '(cleanup function)'
    },
    
    // Header for audio sections
    header: {
      icon: 'Volume2',
      text: {
        intro: 'Introduction Audio:',
        english: 'Audio (English):',
        vietnamese: 'Audio (Tiếng Việt):'
      },
      className: 'flex items-center gap-2 text-sm text-muted-foreground'
    }
  },

  // ============= NAVIGATION =============
  navigation: {
    backButton: {
      icon: 'ArrowLeft',
      text: 'Back to {area} / Quay Lại',
      variant: 'ghost',
      size: 'sm',
      className: 'gap-2'
    },
    
    refreshButton: {
      icon: 'RefreshCw',
      text: 'Refresh',
      variant: 'outline',
      size: 'sm',
      className: 'gap-2',
      adminOnly: true
    }
  },

  // ============= CARD STYLING =============
  cards: {
    // Main room intro card
    intro: {
      className: 'border-2 p-4 bg-muted/30',
      borderStyle: (color: string) => ({ borderColor: color })
    },
    
    // Entry/activity cards
    entry: {
      className: 'border-2 overflow-hidden',
      borderLeftStyle: (color: string) => ({ 
        borderLeftColor: color, 
        borderLeftWidth: '4px' 
      }),
      
      header: {
        className: 'bg-muted/50',
        titleClassName: 'text-xl bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent'
      },
      
      content: {
        className: 'pt-6 space-y-6',
        essayContainer: 'p-4 bg-muted/30 rounded-lg border border-border/50',
        keywordDisplay: 'mt-3 pt-3 border-t border-border/30 text-sm text-muted-foreground'
      }
    }
  },

  // ============= KEYWORDS =============
  keywords: {
    display: {
      english: (keywords: string[]) => `Keywords: ${keywords.join(', ')}`,
      vietnamese: (keywords: string[]) => `Từ khóa: ${keywords.join(', ')}`
    },
    
    // Keyword buttons (for clickable menu)
    button: {
      variant: 'outline',
      size: 'sm',
      className: 'text-xs cursor-pointer',
      activeVariant: 'default'
    }
  },

  // ============= RESPONSIVE DESIGN =============
  responsive: {
    maxWidth: 'max-w-6xl',
    padding: 'px-6 py-8',
    spacing: 'space-y-8',
    
    // Mobile adjustments
    mobile: {
      hiddenText: 'hidden sm:inline',
      stackVertical: 'flex-col',
      fullWidth: 'w-full'
    }
  },

  // ============= COLOR SYSTEM =============
  colors: {
    // Kids levels
    kids: {
      level1: '#FFC1E3', // Pink - Little Explorers (ages 4-7)
      level2: '#A7E6FF', // Light Blue - Young Adventurers (ages 8-11)
      level3: '#FFD700'  // Gold - Super Learners (ages 12-15)
    },
    
    // Rainbow gradient (for all headers)
    rainbow: 'var(--gradient-rainbow)',
    
    // Admin buttons
    admin: {
      primary: '#primary',  // Red circle (JSON)
      secondary: '#3B82F6' // Blue circle (Room ID)
    }
  },

  // ============= LAYOUT PATTERNS =============
  layout: {
    container: 'max-w-6xl mx-auto px-6 py-8 space-y-8',
    
    header: {
      row: 'flex items-center justify-between gap-4',
      titleSection: 'flex items-center gap-3 mb-2',
      metaSection: 'text-muted-foreground'
    },
    
    content: {
      section: 'space-y-6',
      divider: 'border-t pt-6',
      audioDivider: 'mt-4 pt-4 border-t border-border/50'
    }
  },

  // ============= DATA STRUCTURE =============
  dataStructure: {
    room: {
      required: ['id', 'title', 'tier', 'content', 'entries', 'meta'],
      title: { en: 'string', vi: 'string' },
      content: { en: 'string', vi: 'string', audio: 'string' },
      meta: {
        age_range: 'string',
        level: 'string', 
        entry_count: 'number',
        room_color: 'string'
      }
    },
    
    entry: {
      required: ['slug', 'keywords_en', 'keywords_vi', 'copy', 'tags', 'audio', 'audio_vi'],
      copy: { en: 'string', vi: 'string' },
      keywords_en: 'string[]',
      keywords_vi: 'string[]',
      tags: 'string[]',
      audio: 'string (EN)',
      audio_vi: 'string (VI)'
    }
  }
};

/**
 * Apply all Mercy Blade standards to a room component
 * Returns all necessary components and patterns
 */
export function getMercyBladeRoomPattern() {
  return {
    imports: [
      "import { PairedHighlightedContentWithDictionary } from '@/components/PairedHighlightedContentWithDictionary';",
      "import { AudioPlayer } from '@/components/AudioPlayer';",
      "import { setCustomKeywordMappings, clearCustomKeywordMappings, loadRoomKeywords } from '@/lib/customKeywordLoader';",
      "import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';",
      "import { useUserAccess } from '@/hooks/useUserAccess';",
      "import { useToast } from '@/hooks/use-toast';"
    ],
    
    initialization: `
      // Load keyword colors
      const customKeywords = await loadRoomKeywords(roomId);
      if (customKeywords.length > 0) {
        setCustomKeywordMappings(customKeywords);
      } else {
        clearCustomKeywordMappings();
      }
    `,
    
    cleanup: `
      // Cleanup on unmount
      useEffect(() => {
        return () => clearCustomKeywordMappings();
      }, []);
    `,
    
    titleJSX: `
      <div className="flex items-center gap-3 mb-2">
        {isAdmin && (
          <>
            <button
              onClick={() => copyJsonFilename()}
              className="w-[1em] h-[1em] rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
              title="Copy JSON filename"
            />
            <button
              onClick={() => copyRoomId()}
              className="w-[1em] h-[1em] rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
              title="Copy Room ID"
            />
          </>
        )}
        <h1 style={{
          background: 'var(--gradient-rainbow)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {room.title.en === room.title.vi ? room.title.en : \`\${room.title.en} / \${room.title.vi}\`}
        </h1>
      </div>
    `,
    
    welcomeJSX: `
      <p className="text-sm text-foreground leading-tight">
        Welcome to {room.title.en} Room, please click the keyword of the topic you want to discover / 
        Chào mừng bạn đến với phòng {room.title.vi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá
      </p>
    `,
    
    essayJSX: `
      <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
        <PairedHighlightedContentWithDictionary
          englishContent={room.content.en}
          vietnameseContent={room.content.vi}
          roomKeywords={room.entries.flatMap(e => e.keywords_en)}
          onWordClick={() => {
            if (room.content.audio) {
              handleAudioToggle(room.content.audio);
            }
          }}
        />
      </div>
    `,
    
    audioJSX: `
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <Volume2 className="w-4 h-4" />
          <span>Introduction Audio:</span>
        </div>
        <AudioPlayer
          audioPath={\`/audio/\${room.content.audio}\`}
          isPlaying={currentAudio === room.content.audio && isAudioPlaying}
          onPlayPause={() => handleAudioToggle(room.content.audio)}
          onEnded={() => setIsAudioPlaying(false)}
        />
      </div>
    `
  };
}

/**
 * Validation: Check if room follows Mercy Blade standards
 */
export function validateMercyBladeStandards(roomData: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!roomData.id) errors.push('Missing room ID');
  if (!roomData.title?.en || !roomData.title?.vi) errors.push('Missing bilingual title');
  if (!roomData.content?.en || !roomData.content?.vi) errors.push('Missing bilingual content');
  if (!roomData.meta?.room_color) errors.push('Missing room color');
  
  // Check entries
  if (!roomData.entries || roomData.entries.length === 0) {
    warnings.push('No entries found');
  } else {
    roomData.entries.forEach((entry: any, idx: number) => {
      if (!entry.keywords_en || entry.keywords_en.length === 0) {
        warnings.push(`Entry ${idx + 1}: Missing English keywords`);
      }
      if (!entry.keywords_vi || entry.keywords_vi.length === 0) {
        warnings.push(`Entry ${idx + 1}: Missing Vietnamese keywords`);
      }
      if (!entry.audio) warnings.push(`Entry ${idx + 1}: Missing English audio`);
      if (!entry.audio_vi) warnings.push(`Entry ${idx + 1}: Missing Vietnamese audio`);
    });
  }
  
  // Check audio paths
  if (roomData.content?.audio && !roomData.content.audio.includes('.mp3')) {
    warnings.push('Room intro audio may not be valid MP3');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
