/**
 * Mercy Debug Panel (Admin Only)
 * 
 * Shows engine state, loaded tiers, voices, and signals.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMercyHostContext } from './MercyHostProvider';
import { runFullValidation } from '@/lib/mercy-host/validation';
import { hostSignal } from '@/lib/mercy-host/hostSignal';
import { memory } from '@/lib/mercy-host/memory';
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
  Palette
} from 'lucide-react';

interface MercyDebugPanelProps {
  isAdmin?: boolean;
}

export function MercyDebugPanel({ isAdmin = false }: MercyDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'state' | 'validation' | 'signals' | 'memory'>('state');
  const mercy = useMercyHostContext();

  if (!isAdmin) return null;

  const validation = runFullValidation(mercy);
  const signalHistory = hostSignal.getHistory();
  const memoryData = memory.get();

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
          <div className="flex border-b border-border">
            {(['state', 'validation', 'signals', 'memory'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 px-2 py-1.5 text-xs font-medium transition-colors",
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
                
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => {
                    memory.clear();
                    hostSignal.resetMemory();
                  }}
                  className="text-xs h-7 mt-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear Memory
                </Button>
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
