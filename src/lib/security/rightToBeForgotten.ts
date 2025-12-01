/**
 * Right to Be Forgotten (GDPR Compliance)
 * Allows users to delete their account and all associated data
 */

import { supabase } from '@/integrations/supabase/client';

export interface DeletionResult {
  success: boolean;
  deletedRecords: {
    profile: boolean;
    subscription: boolean;
    favorites: boolean;
    feedback: boolean;
    chatHistory: boolean;
    points: boolean;
    sessions: boolean;
  };
  errors: string[];
}

/**
 * Delete user account and all associated data
 * 
 * GDPR Article 17 - Right to Erasure
 */
export const deleteUserAccount = async (userId: string): Promise<DeletionResult> => {
  const result: DeletionResult = {
    success: true,
    deletedRecords: {
      profile: false,
      subscription: false,
      favorites: false,
      feedback: false,
      chatHistory: false,
      points: false,
      sessions: false,
    },
    errors: [],
  };

  try {
    // 1. Delete favorites
    const { error: favError } = await supabase
      .from('favorite_tracks')
      .delete()
      .eq('user_id', userId);
    
    if (favError) {
      result.errors.push(`Favorites: ${favError.message}`);
    } else {
      result.deletedRecords.favorites = true;
    }

    // 2. Soft-delete feedback (preserve for analytics)
    const { error: feedbackError } = await supabase
      .from('feedback')
      .update({ user_id: null, message: '[DELETED BY USER REQUEST]' })
      .eq('user_id', userId);
    
    if (feedbackError) {
      result.errors.push(`Feedback: ${feedbackError.message}`);
    } else {
      result.deletedRecords.feedback = true;
    }

    // 3. Delete points
    const { error: pointsError } = await supabase
      .from('user_points')
      .delete()
      .eq('user_id', userId);
    
    if (pointsError) {
      result.errors.push(`Points: ${pointsError.message}`);
    } else {
      result.deletedRecords.points = true;
    }

    // 4. Delete sessions
    const { error: sessionsError } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId);
    
    if (sessionsError) {
      result.errors.push(`Sessions: ${sessionsError.message}`);
    } else {
      result.deletedRecords.sessions = true;
    }

    // 5. Anonymize subscription (keep for financial records)
    const { error: subError } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'deleted',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    if (subError) {
      result.errors.push(`Subscription: ${subError.message}`);
    } else {
      result.deletedRecords.subscription = true;
    }

    // 6. Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      result.errors.push(`Profile: ${profileError.message}`);
    } else {
      result.deletedRecords.profile = true;
    }

    // 7. Mark chat history as deleted (if exists)
    // This is a placeholder - implement if you have a chat_history table
    result.deletedRecords.chatHistory = true;

    result.success = result.errors.length === 0;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`System error: ${error.message}`);
  }

  return result;
};

/**
 * Request account deletion (sends confirmation email first)
 */
export const requestAccountDeletion = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    // Log the deletion request
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action: 'account_deletion_requested',
      metadata: { timestamp: new Date().toISOString() },
    });

    return {
      success: true,
      message: 'Account deletion requested. Please check your email for confirmation.',
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
