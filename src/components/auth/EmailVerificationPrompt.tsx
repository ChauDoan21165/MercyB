/**
 * Email Verification Prompt
 * Blocks unverified users from accessing rooms and chat
 */

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

interface EmailVerificationPromptProps {
  email: string;
  onVerified?: () => void;
}

export function EmailVerificationPrompt({ email, onVerified }: EmailVerificationPromptProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const handleResendEmail = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      setSent(true);
      toast.success('Verification email sent! Check your inbox.');
      logger.info('Verification email resent', { email });
    } catch (error) {
      logger.error('Failed to resend verification email', { error });
      toast.error('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckVerification = async () => {
    setLoading(true);
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (user?.email_confirmed_at) {
        toast.success('Email verified! You can now access all features.');
        logger.info('Email verification confirmed', { email });
        onVerified?.();
      } else {
        toast.error('Email not verified yet. Please check your inbox.');
      }
    } catch (error) {
      logger.error('Failed to check verification status', { error });
      toast.error('Failed to check verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-6 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Verify Your Email
          </h2>
          <p className="text-sm text-muted-foreground">
            Please verify your email address to access rooms and chat features.
          </p>
        </div>
        
        {/* Email Display */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-sm text-center text-foreground/80">
            Verification email sent to:
          </p>
          <p className="text-sm font-medium text-center text-foreground mt-1">
            {email}
          </p>
        </div>
        
        {/* Status Message */}
        {sent && (
          <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-green-700 dark:text-green-300">
              Verification email sent! Check your inbox and spam folder.
            </p>
          </div>
        )}
        
        {/* Instructions */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Click the verification link in the email to activate your account.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Can't find the email? Check your spam folder or request a new one.
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleCheckVerification}
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'I\'ve Verified My Email'}
          </button>
          
          <button
            onClick={handleResendEmail}
            disabled={loading || sent}
            className="w-full py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : sent ? 'Email Sent!' : 'Resend Verification Email'}
          </button>
        </div>
        
        {/* Support Link */}
        <p className="text-xs text-center text-muted-foreground">
          Need help? Contact{' '}
          <a href="mailto:support@mercyblade.com" className="text-primary hover:underline">
            support@mercyblade.com
          </a>
        </p>
      </div>
    </div>
  );
}
