import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePoints } from "./usePoints";

export const useRoomAnalytics = (roomId: string) => {
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const messageCountRef = useRef<number>(0);
  const { awardPoints } = usePoints();

  useEffect(() => {
    initSession();

    return () => {
      endSession();
    };
  }, [roomId]);

  const initSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("room_usage_analytics")
        .insert({
          user_id: user.id,
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