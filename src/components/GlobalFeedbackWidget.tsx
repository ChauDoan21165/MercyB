/**
 * Global Feedback Widget
 * Persistent collapsible feedback box at bottom-right of every page
 */

import { useState } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const GlobalFeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Try to get user if logged in (optional - anonymous feedback allowed)
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('[feedback] Submitting feedback, user:', user?.id || 'anonymous');

      // Insert feedback - user_id can be null for anonymous
      const { error: insertError } = await supabase.from('feedback').insert({
        user_id: user?.id || null,
        message: message.trim(),
        status: 'new',
        priority: 'normal',
        category: 'general',
      });

      if (insertError) {
        console.error('[feedback] Insert error:', insertError);
        throw insertError;
      }

      console.log('[feedback] Feedback submitted successfully');

      toast({
        title: "Thank you! 💛",
        description: "Your feedback has been submitted. We appreciate your input!",
      });

      // Reset form
      setMessage("");
      setIsOpen(false);

    } catch (error: any) {
      console.error('[feedback] Submission error:', error);
      toast({
        title: "Failed to submit",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed state - Icon button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 p-0"
          aria-label="Open feedback form"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      {/* Expanded state - Feedback form */}
      {isOpen && (
        <div className={cn(
          "bg-card border border-border rounded-lg shadow-xl",
          "w-[280px] sm:w-[320px] max-w-[calc(100vw-2rem)]",
          "animate-in slide-in-from-bottom-2 fade-in duration-200"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Send Feedback</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback form"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-3 space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts, report bugs, or suggest improvements..."
              className="min-h-[100px] resize-none text-sm"
              disabled={isSubmitting}
              maxLength={1000}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {message.length}/1000
              </span>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !message.trim()}
                size="sm"
                className="gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Ctrl+Enter to submit quickly
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
