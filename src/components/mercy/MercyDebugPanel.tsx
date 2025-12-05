/**
 * Mercy Debug Panel (Admin Only)
 * 
 * Shows engine state, loaded tiers, voices, signals, and rituals.
 * Phase 6: Added streak/ritual info and simulation buttons.
 * Phase 7: Added logs tab and teacher info.
 */

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMercyHostContext } from './MercyHostProvider';
import { runFullValidation } from '@/lib/mercy-host/validation';
import { hostSignal } from '@/lib/mercy-host/hostSignal';
import { getRitualForEvent } from '@/lib/mercy-host/rituals';
import { getMemoryData, type MercyMemoryV2 } from '@/lib/mercy-host/memorySchema';
import { getRecentLogs, getLogSummary, getLogBufferSize, type MercyLogEvent } from '@/lib/mercy-host/logs';
import { Button } from '@/components/ui/button';
import { 
  Bug, 
  X, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Volume2,
  Sparkles,
  User,
  Globe,
  Palette,
  Flame,
  Calendar,
  Star,
  VolumeX,
  ScrollText,
  GraduationCap,
  BookOpen
} from 'lucide-react';

interface MercyDebugPanelProps {
  isAdmin?: boolean;
}

// Gate: only render in development or for explicit admin
const isDev = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname.includes('preview'));

export function MercyDebugPanel({ isAdmin = false }: MercyDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'state' | 'validation' | 'signals' | 'memory' | 'rituals' | 'logs'>('state');
  const mercy = useMercyHostContext();

  // Admin gate: only show in dev mode or with explicit admin flag
  if (!isAdmin && !isDev) return null;

  const validation = runFullValidation(mercy);
  const signalHistory = hostSignal.getHistory();
  const memoryData: MercyMemoryV2 = getMemoryData();
  const recentLogs = getRecentLogs(20);
  const logSummary = getLogSummary();
  const logBufferSize = getLogBufferSize();

  // Simulate streak milestone
  const simulateStreakMilestone = () => {
    const ritual = getRitualForEvent('streak_milestone', {
      tier: mercy.currentTier,
      streakDays: 7
    });
    if (ritual) {
      // Trigger via signal
      hostSignal.emit({
        type: 'ritual_trigger',
        source: 'debug_panel',
        payload: { ritual }
      });
    }
  };

  // Simulate comeback ritual
  const simulateComebackRitual = () => {
    const ritual = getRitualForEvent('comeback_after_gap', {
      tier: mercy.currentTier,
      daysSinceLastVisit: 14
    });
    if (ritual) {
      hostSignal.emit({
        type: 'ritual_trigger',
        source: 'debug_panel',
        payload: { ritual }
      });
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 left-4 z-[60] h-10 w-10",
          "bg-background/95 backdrop-blur-sm border-border shadow-lg",
          isOpen && "bg-accent"
        )}
        title="Mercy Debug Panel"
      >
        <Bug className="h-4 w-4" />
      </Button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 z-[60] w-80 max-h-[60vh] overflow-hidden bg-background border border-border rounded-lg shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
            <span className="font-medium text-sm">Mercy Debug</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto">
            {(['state', 'validation', 'signals', 'memory', 'rituals', 'logs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-3 overflow-y-auto max-h-[40vh] text-xs">
            {activeTab === 'state' && (
              <div className="space-y-2">
                <StateRow icon={<User />} label="User" value={mercy.userName || 'Guest'} />
                <StateRow icon={<Globe />} label="Language" value={mercy.language.toUpperCase()} />
                <StateRow icon={<Palette />} label="Avatar" value={mercy.avatarStyle} />
                <StateRow label="Tier" value={mercy.currentTier} />
                <StateRow label="Tone" value={mercy.currentTone} />
                <StateRow label="Presence" value={mercy.presenceState} />
                <StateRow label="Enabled" value={mercy.isEnabled ? 'Yes' : 'No'} />
                <StateRow label="Animation" value={mercy.currentAnimation || 'None'} />
                <StateRow label="Bubble" value={mercy.isBubbleVisible ? 'Visible' : 'Hidden'} />
                <StateRow 
                  icon={mercy.silenceMode ? <VolumeX /> : <Volume2 />} 
                  label="Silence Mode" 
                  value={mercy.silenceMode ? 'On' : 'Off'} 
                />
                <StateRow 
                  icon={<Sparkles />} 
                  label="Ritual Intensity" 
                  value={mercy.ritualIntensity} 
                />
                
                <div className="pt-2 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => mercy.greet()}
                    className="text-xs h-7"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Greet
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => hostSignal.playVoice('encouragement')}
                    className="text-xs h-7"
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    Voice
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'validation' && (
              <div className="space-y-3">
                <ValidationSection 
                  title="Overall" 
                  valid={validation.overall} 
                />
                <ValidationSection 
                  title="Tiers" 
                  valid={validation.tiers.valid}
                  errors={validation.tiers.errors}
                  warnings={validation.tiers.warnings}
                />
                <ValidationSection 
                  title="Voice Pack" 
                  valid={validation.voicePack.valid}
                  errors={validation.voicePack.errors}
                  warnings={validation.voicePack.warnings}
                />
                <ValidationSection 
                  title="Events" 
                  valid={validation.eventMap.valid}
                  errors={validation.eventMap.errors}
                  warnings={validation.eventMap.warnings}
                />
              </div>
            )}

            {activeTab === 'signals' && (
              <div className="space-y-2">
                {signalHistory.length === 0 ? (
                  <p className="text-muted-foreground">No signals yet</p>
                ) : (
                  signalHistory.slice(-10).reverse().map((signal, idx) => (
                    <div key={idx} className="p-2 bg-muted/50 rounded text-xs">
                      <div className="font-medium">{signal.type}</div>
                      <div className="text-muted-foreground">
                        {signal.source} • {new Date(signal.timestamp || 0).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-2">
                <StateRow label="Visits" value={String(memoryData.totalVisits)} />
                <StateRow label="Sessions" value={String(memoryData.sessionCount)} />
                <StateRow label="Onboarded" value={memoryData.hasOnboarded ? 'Yes' : 'No'} />
                <StateRow label="Last Room" value={memoryData.lastRoom || 'None'} />
                <StateRow label="Greeted Rooms" value={String(memoryData.greetedRooms.length)} />
                <StateRow 
                  label="Coaching Level" 
                  value={memoryData.emotionCoachingLevel} 
                />
                
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => {
                    localStorage.removeItem('mercy_host_memory');
                    hostSignal.resetMemory();
                  }}
                  className="text-xs h-7 mt-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear Memory
                </Button>
              </div>
            )}

            {/* Phase 6: Rituals Tab */}
            {activeTab === 'rituals' && (
              <div className="space-y-3">
                {/* Streak Info */}
                <div className="p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Visit Streak</span>
                  </div>
                  <StateRow label="Current Streak" value={`${mercy.visitStreak} days`} />
                  <StateRow 
                    label="Longest Streak" 
                    value={`${memoryData.longestStreak} days`} 
                  />
                </div>

                {/* Last Visit */}
                <div className="p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Visit Info</span>
                  </div>
                  <StateRow 
                    label="Last Visit" 
                    value={mercy.lastVisitISO 
                      ? new Date(mercy.lastVisitISO).toLocaleDateString() 
                      : 'Never'
                    } 
                  />
                </div>

                {/* Last Ritual */}
                <div className="p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium">Last Ritual</span>
                  </div>
                  <StateRow 
                    label="Ritual ID" 
                    value={mercy.lastRitualId || 'None'} 
                  />
                  <StateRow 
                    label="Banner Visible" 
                    value={mercy.isRitualBannerVisible ? 'Yes' : 'No'} 
                  />
                </div>

                {/* Last VIP Ceremony */}
                <div className="p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">VIP Ceremony</span>
                  </div>
                  <StateRow 
                    label="Last Ceremony Tier" 
                    value={mercy.lastCeremonyTier || 'None'} 
                  />
                  <StateRow 
                    label="Tiers Celebrated" 
                    value={String(memoryData.tiersCelebrated.length)} 
                  />
                </div>

                {/* Teacher Info - Phase 7 */}
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">English Teacher</span>
                  </div>
                  <StateRow 
                    label="Teacher Level" 
                    value={mercy.teacherLevel} 
                  />
                  <StateRow 
                    label="Room Domain" 
                    value={mercy.currentRoomDomain || 'None'} 
                  />
                  <StateRow 
                    label="Hint Visible" 
                    value={mercy.isTeacherHintVisible ? 'Yes' : 'No'} 
                  />
                </div>

                {/* Simulation Buttons */}
                <div className="pt-2 space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={simulateStreakMilestone}
                    className="text-xs h-7 w-full"
                  >
                    <Flame className="h-3 w-3 mr-1" />
                    Simulate 7-day Streak
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={simulateComebackRitual}
                    className="text-xs h-7 w-full"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Simulate Comeback Ritual
                  </Button>
                </div>
              </div>
            )}

            {/* Phase 7: Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-3">
                {/* Log Summary */}
                <div className="p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <ScrollText className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Log Summary</span>
                  </div>
                  <StateRow label="Buffer Size" value={`${logBufferSize}/100`} />
                  <StateRow label="Room Enters" value={String(logSummary.room_enter)} />
                  <StateRow label="Room Completes" value={String(logSummary.room_complete)} />
                  <StateRow label="Entry Clicks" value={String(logSummary.entry_click)} />
                  <StateRow label="EF Practice" value={String(logSummary.ef_practice)} />
                </div>

                {/* Recent Logs */}
                <div className="p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">Recent Logs</span>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {recentLogs.length === 0 ? (
                      <p className="text-muted-foreground text-xs">No logs yet</p>
                    ) : (
                      recentLogs.slice(0, 10).map((log) => (
                        <div 
                          key={log.id} 
                          className="text-xs p-1.5 bg-background rounded border border-border"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-primary">{log.type}</span>
                            <span className="text-muted-foreground">
                              {new Date(log.timestampISO).toLocaleTimeString()}
                            </span>
                          </div>
                          {log.roomId && (
                            <div className="text-muted-foreground truncate">
                              {log.roomId}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function StateRow({ 
  icon, 
  label, 
  value 
}: { 
  icon?: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ValidationSection({ 
  title, 
  valid, 
  errors = [], 
  warnings = [] 
}: { 
  title: string; 
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const hasIssues = errors.length > 0 || warnings.length > 0;

  return (
    <div className="border border-border rounded p-2">
      <button 
        onClick={() => hasIssues && setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
        disabled={!hasIssues}
      >
        <span className="font-medium">{title}</span>
        <span className={cn(
          "px-1.5 py-0.5 rounded text-[10px] font-medium",
          valid ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
        )}>
          {valid ? 'PASS' : 'FAIL'}
        </span>
      </button>
      
      {expanded && hasIssues && (
        <div className="mt-2 space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-red-500">• {e}</p>
          ))}
          {warnings.map((w, i) => (
            <p key={i} className="text-yellow-500">• {w}</p>
          ))}
        </div>
      )}
    </div>
  );
}
