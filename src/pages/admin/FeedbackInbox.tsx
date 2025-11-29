import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { guardedCall } from "@/lib/guardedCall";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackMessage {
  id: string;
  user_id: string;
  message: string;
  category: string | null;
  priority: string | null;
  status: string | null;
  created_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    email: string | null;
  } | null;
}

export default function FeedbackInbox() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<FeedbackMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedback")
        .select(`
          *,
          profiles (
            username,
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = (message: FeedbackMessage) => {
    setSelectedMessage(message);
    setReplyText("");
    setReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);

    const result = await guardedCall(
      'Send feedback reply',
      async () => {
        const { error } = await supabase.functions.invoke("send-feedback-reply", {
          body: {
            userEmail: selectedMessage.profiles?.email || "",
            userName: selectedMessage.profiles?.username || selectedMessage.profiles?.full_name || "User",
            originalMessage: selectedMessage.message,
            replyMessage: replyText,
          },
        });

        if (error) throw error;

        // Update status to 'resolved' after reply
        const { error: updateError } = await supabase
          .from("feedback")
          .update({ status: "resolved" })
          .eq("id", selectedMessage.id);

        if (updateError) throw updateError;

        return { success: true };
      },
      { showSuccessToast: false } // We'll show custom toast
    );

    setSending(false);

    if (result.success) {
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the user via email",
      });

      setReplyDialogOpen(false);
      setReplyText("");
      fetchMessages();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to send reply",
        variant: "destructive",
      });
    }
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <AdminBreadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Feedback Inbox" }]} />

        <Card className="border-2 border-black bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black font-bold">
              <MessageSquare className="h-5 w-5" />
              Feedback Inbox
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-black" />
                <p className="text-gray-600 mt-2">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center py-8 text-gray-600">No feedback messages yet</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <Card key={msg.id} className="border border-black bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-black">
                              {msg.profiles?.username || msg.profiles?.full_name || "Anonymous"}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatDate(msg.created_at)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded border ${
                              msg.status === "new" ? "border-black bg-white text-black" :
                              msg.status === "resolved" ? "border-gray-400 bg-gray-100 text-gray-600" :
                              "border-black bg-gray-50 text-black"
                            }`}>
                              {msg.status || "new"}
                            </span>
                            {msg.priority === "high" && (
                              <span className="text-xs px-2 py-1 rounded border border-red-500 bg-red-50 text-red-600 font-bold">
                                HIGH PRIORITY
                              </span>
                            )}
                          </div>
                          <p className="text-black whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            User ID: {msg.user_id.slice(0, 8)}... | Email: {msg.profiles?.email || "N/A"}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleReplyClick(msg)}
                          className="bg-black text-white hover:bg-gray-800 border-2 border-black"
                          size="sm"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent className="border-2 border-black bg-white">
            <DialogHeader>
              <DialogTitle className="text-black font-bold">Reply to Feedback</DialogTitle>
              <DialogDescription className="text-gray-600">
                Your reply will be sent to {selectedMessage?.profiles?.email || "the user"} via email
              </DialogDescription>
            </DialogHeader>

            {selectedMessage && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-100 border border-black rounded">
                  <p className="text-xs text-gray-600 mb-1">Original message:</p>
                  <p className="text-sm text-black">{selectedMessage.message}</p>
                </div>

                <Textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="border-2 border-black"
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setReplyDialogOpen(false)}
                    className="border-2 border-black text-black hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                    className="bg-black text-white hover:bg-gray-800 border-2 border-black"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
