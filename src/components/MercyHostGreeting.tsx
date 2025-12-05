/**
 * Mercy Host Greeting Component
 * 
 * Displays Mercy's welcome greeting with avatar, animation, and voice.
 * Integrated with the MercyHostEngine.
 */

import { useState } from 'react';
import { X, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MercyHostEngine } from '@/lib/mercy-host/types';

interface MercyHostGreetingProps {
  mercy: MercyHostEngine;
  className?: string;
}

export function MercyHostGreeting({ mercy, className }: MercyHostGreetingProps) {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      mercy.dismiss();
    }, 200);
  };
  
  const isVip = ['vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'].includes(mercy.tier);
  
  // Floating reopen button when greeting is hidden
  if (!mercy.isGreetingVisible) {
    return (
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={mercy.reopen}
          className="h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm border-border shadow-lg hover:bg-accent"
          title="Show Mercy's greeting"
          aria-label="Show Mercy's greeting"
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </Button>
      </div>
    );
  }
  
  // No greeting text yet
  if (!mercy.greetingText) {
    return null;
  }
  
  const displayText = mercy.language === 'vi' ? mercy.greetingText.vi : mercy.greetingText.en;
  const altText = mercy.language === 'vi' ? mercy.greetingText.en : mercy.greetingText.vi;
  
  return (
    <div
      className={cn(
        "relative mx-auto max-w-2xl px-4 pt-4",
        isExiting ? "animate-fade-out" : "animate-fade-in",
        className
      )}
    >
      <div
        className={cn(
          "relative rounded-xl border p-4",
          isVip
            ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800"
            : "bg-muted/50 border-border"
        )}
      >
        {/* Animation overlay */}
        {mercy.animation && (
          <div className="absolute -top-2 -left-2 pointer-events-none opacity-70">
            {mercy.animation}
          </div>
        )}
        
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-60 hover:opacity-100"
          aria-label="Dismiss greeting"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Mercy avatar and greeting */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 relative">
            {mercy.avatar}
            {mercy.isPlaying && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <Volume2 className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            {/* Tier tone indicator */}
            <p className="text-xs text-muted-foreground mb-1 capitalize">
              {mercy.tone}
            </p>
            
            {/* Main greeting */}
            <p className="text-foreground font-medium leading-relaxed">
              {displayText}
            </p>
            
            {/* Alternate language (smaller, muted) */}
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {altText}
            </p>
            
            {/* Voice line text if playing */}
            {mercy.currentVoiceLine && mercy.isPlaying && (
              <p className="mt-2 text-xs text-primary italic animate-pulse">
                🎙️ {mercy.language === 'vi' ? mercy.currentVoiceLine.vi : mercy.currentVoiceLine.en}
              </p>
            )}
          </div>
        </div>
        
        {/* Play voice button */}
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => mercy.playVoice('room_enter')}
            disabled={mercy.isPlaying}
            className="text-xs h-7 px-2 opacity-60 hover:opacity-100"
          >
            <Volume2 className="h-3 w-3 mr-1" />
            {mercy.isPlaying ? 'Playing...' : 'Hear Mercy'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Color mode toast message
 */
interface MercyColorModeToastProps {
  message: string;
  onDismiss: () => void;
}

export function MercyColorModeToast({ message, onDismiss }: MercyColorModeToastProps) {
  return (
    <div 
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm text-foreground">{message}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-5 w-5 rounded-full ml-1"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Legacy props interface for backward compatibility
 */
interface LegacyMercyHostGreetingProps {
  greeting: { text: string; textAlt: string; isVip: boolean };
  show: boolean;
  onDismiss: () => void;
  onReopen: () => void;
  className?: string;
}

export function LegacyMercyHostGreeting({
  greeting,
  show,
  onDismiss,
  onReopen,
  className
}: LegacyMercyHostGreetingProps) {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onDismiss();
    }, 200);
  };
  
  if (!show) {
    return (
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={onReopen}
          className="h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm border-border shadow-lg hover:bg-accent"
          title="Show Mercy's greeting"
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "relative mx-auto max-w-2xl px-4 pt-4",
      isExiting ? "animate-fade-out" : "animate-fade-in",
      className
    )}>
      <div className={cn(
        "relative rounded-xl border p-4",
        greeting.isVip
          ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800"
          : "bg-muted/50 border-border"
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-60 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            greeting.isVip
              ? "bg-gradient-to-br from-purple-500 to-pink-500"
              : "bg-gradient-to-br from-primary to-accent"
          )}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-foreground font-medium leading-relaxed">{greeting.text}</p>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{greeting.textAlt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
