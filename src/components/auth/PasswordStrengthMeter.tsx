/**
 * Password Strength Meter with Safe Suggestions
 */

import { useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  suggestions: string[];
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

function calculatePasswordStrength(password: string): StrengthResult {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  
  let score = 0;
  let label = 'Very Weak';
  let color = 'bg-red-500';
  
  if (passedChecks >= 5) {
    score = 4;
    label = 'Very Strong';
    color = 'bg-green-500';
  } else if (passedChecks >= 4) {
    score = 3;
    label = 'Strong';
    color = 'bg-green-400';
  } else if (passedChecks >= 3) {
    score = 2;
    label = 'Medium';
    color = 'bg-yellow-500';
  } else if (passedChecks >= 2) {
    score = 1;
    label = 'Weak';
    color = 'bg-orange-500';
  }
  
  const suggestions: string[] = [];
  if (!checks.length) suggestions.push('Use at least 8 characters');
  if (!checks.uppercase) suggestions.push('Add uppercase letters (A-Z)');
  if (!checks.lowercase) suggestions.push('Add lowercase letters (a-z)');
  if (!checks.number) suggestions.push('Add numbers (0-9)');
  if (!checks.special) suggestions.push('Add special characters (!@#$%)');
  
  return { score, label, color, suggestions, checks };
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  
  if (!password) return null;
  
  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">Password Strength</span>
          <span className="font-medium text-foreground">{strength.label}</span>
        </div>
        <div className="flex gap-1 h-1.5">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`flex-1 rounded-full transition-colors ${
                level <= strength.score ? strength.color : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {Object.entries(strength.checks).map(([key, passed]) => {
          const labels = {
            length: 'At least 8 characters',
            uppercase: 'One uppercase letter',
            lowercase: 'One lowercase letter',
            number: 'One number',
            special: 'One special character',
          };
          
          const Icon = passed ? CheckCircle2 : XCircle;
          const iconColor = passed ? 'text-green-500' : 'text-muted-foreground/40';
          
          return (
            <div key={key} className="flex items-center gap-2 text-xs">
              <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              <span className={passed ? 'text-foreground/70' : 'text-muted-foreground'}>
                {labels[key as keyof typeof labels]}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Suggestions */}
      {strength.suggestions.length > 0 && strength.score < 3 && (
        <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">Improve your password:</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {strength.suggestions.slice(0, 2).map((suggestion, i) => (
                  <li key={i}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
