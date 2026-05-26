import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { usePoints } from "./usePoints";

export const useRoomAnalytics = (roomId: string) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const messageCountRef = useRef<number>(0);
  const { awardPoints } = usePoints();

  useEffect(() => {
    void initSession();

    return () => {
      void endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId]);

  const initSession = async () => {
    try {
      if (!userId) return;

      const { data, error } = await supabase
        .from("room_usage_analytics")
        .insert({
          user_id: userId,
          room_id: roomId,
          session_start: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      sessionIdRef.current = data.id;
      startTimeRef.current = Date.now();
      messageCountRef.current = 0;
    } catch (error) {
      console.error("Error initializing analytics session:", error);
    }
  };

  const endSession = async () => {
    if (!sessionIdRef.current) return;

    try {
      const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      await supabase
        .from("room_usage_analytics")
        .update({
          session_end: new Date().toISOString(),
          time_spent_seconds: timeSpentSeconds,
          messages_sent: messageCountRef.current,
        })
        .eq("id", sessionIdRef.current);
    } catch (error) {
      console.error("Error ending analytics session:", error);
    }
  };

  const trackMessage = async () => {
    messageCountRef.current++;
    // Award 5 points for each message sent
    await awardPoints(5, "message_sent", "Sent a message in chat", roomId);
  };

  const markCompleted = async () => {
    if (!sessionIdRef.current) return;

    try {
      await supabase
        .from("room_usage_analytics")
        .update({ completed_room: true })
        .eq("id", sessionIdRef.current);
      
      // Award 50 points for completing a room
      await awardPoints(50, "room_completed", "Completed a learning room", roomId);
    } catch (error) {
      console.error("Error marking room as completed:", error);
    }
  };

  return { trackMessage, markCompleted };
};