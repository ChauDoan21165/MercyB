/**
 * Accessibility Preview Mode
 * Admin-only tool to simulate accessibility modes for testing
 */

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface A11YPreviewState {
  reducedMotion: boolean;
  highContrast: boolean;
  keyboardOnly: boolean;
  screenReaderLabels: boolean;
}

export function A11YPreviewMode() {
  const [previewMode, setPreviewMode] = useState<A11YPreviewState>({
    reducedMotion: false,
    highContrast: false,
    keyboardOnly: false,
    screenReaderLabels: false,
  });

  const [isActive, setIsActive] = useState(false);

  const toggleMode = (key: keyof A11YPreviewState) => {
    setPreviewMode(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      applyA11YPreview(newState);
      return newState;
    });
  };

  const applyA11YPreview = (state: A11YPreviewState) => {
    const root = document.documentElement;

    // Reduced motion
    if (state.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01s');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduce-motion');
    }

    // High contrast
    if (state.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Keyboard only (show focus rings prominently)
    if (state.keyboardOnly) {
      root.classList.add('keyboard-only');
    } else {
      root.classList.remove('keyboard-only');
    }

    // Screen reader labels (show aria-labels visually)
    if (state.screenReaderLabels) {
      root.classList.add('show-aria-labels');
    } else {
      root.classList.remove('show-aria-labels');
    }

    setIsActive(Object.values(state).some(v => v));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Toggle accessibility preview mode"
        >
          {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          A11Y Preview
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Accessibility Preview</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuCheckboxItem
          checked={previewMode.reducedMotion}
          onCheckedChange={() => toggleMode('reducedMotion')}
        >
          Reduced Motion
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={previewMode.highContrast}
          onCheckedChange={() => toggleMode('highContrast')}
        >
          High Contrast
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={previewMode.keyboardOnly}
          onCheckedChange={() => toggleMode('keyboardOnly')}
        >
          Keyboard-Only Navigation
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={previewMode.screenReaderLabels}
          onCheckedChange={() => toggleMode('screenReaderLabels')}
        >
          Show ARIA Labels
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
