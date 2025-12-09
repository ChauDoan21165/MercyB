/**
 * Admin Email Broadcast Page
 * Allows admins to send batch emails to users by tier or manual list.
 * 
 * Features:
 * - Create broadcast with subject, body, and audience selection
 * - Preview recipients before sending
 * - View recent campaign history
 * - Preset templates for common emails
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminLevel } from "@/hooks/useAdminLevel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, Send, Eye, Loader2, AlertTriangle, FileText } from "lucide-react";

// Email presets for common campaigns
const EMAIL_PRESETS: Record<string, { subject: string; body_html: string }> = {
  vip3_welcome_v1: {
    subject: "🎉 Chào mừng bạn đến VIP3 - Welcome to VIP3!",
    body_html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
<div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <h1 style="color: #7c3aed; margin-bottom: 24px;">🎉 Chào mừng đến VIP3!</h1>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Xin chào,</p>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Cảm ơn bạn đã nâng cấp lên <strong>VIP3</strong> trên Mercy Blade! Bạn đã mở khóa những nội dung độc quyền nhất của chúng tôi.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <h2 style="color: #1a1a1a; font-size: 18px;">Welcome to VIP3!</h2>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Thank you for upgrading to <strong>VIP3</strong> on Mercy Blade! You now have access to our most exclusive content.</p>
  <div style="margin: 32px 0;">
    <a href="https://mercyblade.link" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Khám phá ngay / Start Exploring →</a>
  </div>
  <p style="color: #999; font-size: 12px;">Mercy Blade – Hành trình bình yên của bạn bắt đầu từ đây.</p>
</div>
</body>
</html>`,
  },
  vip2_welcome_v1: {
    subject: "🌟 Chào mừng bạn đến VIP2 - Welcome to VIP2!",
    body_html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
<div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <h1 style="color: #2563eb; margin-bottom: 24px;">🌟 Chào mừng đến VIP2!</h1>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Xin chào,</p>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Cảm ơn bạn đã nâng cấp lên <strong>VIP2</strong> trên Mercy Blade!</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <h2 style="color: #1a1a1a; font-size: 18px;">Welcome to VIP2!</h2>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Thank you for upgrading to <strong>VIP2</strong> on Mercy Blade!</p>
  <div style="margin: 32px 0;">
    <a href="https://mercyblade.link" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Khám phá ngay / Start Exploring →</a>
  </div>
  <p style="color: #999; font-size: 12px;">Mercy Blade – Hành trình bình yên của bạn bắt đầu từ đây.</p>
</div>
</body>
</html>`,
  },
};

interface Campaign {
  id: string;
  created_at: string;
  subject: string;
  audience_type: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  body_html: string;
}

interface PreviewResult {
  total_recipients: number;
  sample: string[];
}

export default function AdminEmailBroadcast() {
  const navigate = useNavigate();
  const { loading: adminLoading, adminInfo } = useAdminLevel();

  // Form state
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [audienceType, setAudienceType] = useState<string>("vip2");
  const [manualEmails, setManualEmails] = useState("");

  // UI state
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Apply preset template
  function applyPreset(presetKey: string) {
    const preset = EMAIL_PRESETS[presetKey];
    if (preset) {
      setSubject(preset.subject);
      setBodyHtml(preset.body_html);
      toast.success(`Loaded preset: ${presetKey}`);
    }
  }

  // Check admin access
  useEffect(() => {
    if (!adminLoading && (!adminInfo || adminInfo.level < 9)) {
      toast.error("Access denied. Admin level 9+ required.");
      navigate("/admin");
    }
  }, [adminLoading, adminInfo, navigate]);

  // Load recent campaigns
  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    setCampaignsLoading(true);
    try {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setCampaignsLoading(false);
    }
  }

  async function handlePreview() {
    if (!subject.trim() || !bodyHtml.trim()) {
      toast.error("Please fill in subject and body");
      return;
    }

    setPreviewLoading(true);
    setPreviewResult(null);

    try {
      // Refresh session for fresh token
      const { data: refreshed } = await supabase.auth.refreshSession();
      const token = refreshed.session?.access_token;

      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const response = await supabase.functions.invoke("email-broadcast", {
        body: {
          action: "preview",
          subject: subject.trim(),
          body_html: bodyHtml.trim(),
          audience_type: audienceType,
          manual_emails: audienceType === "manual" 
            ? manualEmails.split("\n").map(e => e.trim()).filter(Boolean)
            : undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (!data?.ok) {
        toast.error(data?.error || "Preview failed");
        return;
      }

      setPreviewResult({
        total_recipients: data.total_recipients,
        sample: data.sample || [],
      });

      if (data.total_recipients === 0) {
        toast.warning("No recipients found for this audience");
      } else {
        toast.success(`Found ${data.total_recipients} recipients`);
      }
    } catch (err) {
      console.error("Preview error:", err);
      toast.error("Failed to preview audience");
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleSend() {
    if (!previewResult || previewResult.total_recipients === 0) {
      toast.error("Please preview the audience first");
      return;
    }

    setConfirmDialogOpen(false);
    setSendLoading(true);

    try {
      const { data: refreshed } = await supabase.auth.refreshSession();
      const token = refreshed.session?.access_token;

      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const response = await supabase.functions.invoke("email-broadcast", {
        body: {
          action: "send",
          subject: subject.trim(),
          body_html: bodyHtml.trim(),
          audience_type: audienceType,
          manual_emails: audienceType === "manual"
            ? manualEmails.split("\n").map(e => e.trim()).filter(Boolean)
            : undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (!data?.ok) {
        toast.error(data?.error || "Send failed");
        return;
      }

      toast.success(`Sent ${data.sent_count}/${data.total_recipients} emails`);
      
      // Reset form
      setSubject("");
      setBodyHtml("");
      setManualEmails("");
      setPreviewResult(null);
      
      // Reload campaigns
      loadCampaigns();
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Failed to send broadcast");
    } finally {
      setSendLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-600">Sent</Badge>;
      case "sending":
        return <Badge className="bg-yellow-600">Sending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  function getAudienceLabel(type: string) {
    switch (type) {
      case "vip2": return "VIP2";
      case "vip3": return "VIP3";
      case "all_vip": return "All VIP";
      case "manual": return "Manual";
      default: return type;
    }
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Mail className="h-8 w-8" />
            Email Broadcast
          </h1>
          <p className="text-muted-foreground mt-2">
            Send batch emails to users by subscription tier or manual email list
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Broadcast Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create Broadcast</CardTitle>
              <CardDescription>
                Compose and send an email to selected audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Templates */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Load Preset Template
                </label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("vip3_welcome_v1")}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    VIP3 Welcome
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("vip2_welcome_v1")}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    VIP2 Welcome
                  </Button>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject line..."
                  className="bg-background"
                />
              </div>

              {/* Audience */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Audience
                </label>
                <Select value={audienceType} onValueChange={setAudienceType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip2">VIP2 Subscribers</SelectItem>
                    <SelectItem value="vip3">VIP3 Subscribers</SelectItem>
                    <SelectItem value="all_vip">All VIP Subscribers</SelectItem>
                    <SelectItem value="manual">Manual Email List</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Manual Emails (conditional) */}
              {audienceType === "manual" && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Addresses (one per line)
                  </label>
                  <Textarea
                    value={manualEmails}
                    onChange={(e) => setManualEmails(e.target.value)}
                    placeholder="user1@example.com&#10;user2@example.com&#10;..."
                    rows={4}
                    className="bg-background font-mono text-sm"
                  />
                </div>
              )}

              {/* Body HTML */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email Body (HTML)
                </label>
                <Textarea
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  placeholder="<h1>Hello!</h1>&#10;<p>Your email content here...</p>"
                  rows={8}
                  className="bg-background font-mono text-sm"
                />
              </div>

              {/* Preview Result */}
              {previewResult && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">
                    Recipients: {previewResult.total_recipients}
                  </p>
                  {previewResult.sample.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Sample: {previewResult.sample.join(", ")}
                      {previewResult.total_recipients > 5 && "..."}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  disabled={previewLoading || sendLoading}
                >
                  {previewLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Preview Audience
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={
                    !previewResult || 
                    previewResult.total_recipients === 0 || 
                    sendLoading || 
                    !adminInfo || 
                    adminInfo.level < 9
                  }
                  title={adminInfo && adminInfo.level < 9 ? "Admin level 9+ required to send" : undefined}
                >
                  {sendLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                Last 10 email broadcasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {campaignsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : campaigns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No campaigns yet
                </p>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {campaign.subject}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(campaign.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getAudienceLabel(campaign.audience_type)}
                          </Badge>
                          {getStatusBadge(campaign.status)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {campaign.sent_count}/{campaign.total_recipients} sent
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Confirm Send Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Confirm Broadcast
              </DialogTitle>
              <DialogDescription>
                You are about to send an email to{" "}
                <strong>{previewResult?.total_recipients || 0}</strong> recipients.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>Subject:</strong> {subject}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Audience:</strong> {getAudienceLabel(audienceType)}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Campaign Detail Dialog */}
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedCampaign?.subject}</DialogTitle>
              <DialogDescription>
                Campaign details and preview
              </DialogDescription>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    {getStatusBadge(selectedCampaign.status)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Audience:</span>{" "}
                    {getAudienceLabel(selectedCampaign.audience_type)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sent:</span>{" "}
                    {selectedCampaign.sent_count}/{selectedCampaign.total_recipients}
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30 max-h-64 overflow-auto">
                  <p className="text-xs text-muted-foreground mb-2">Body Preview:</p>
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedCampaign.body_html.substring(0, 500) + 
                        (selectedCampaign.body_html.length > 500 ? "..." : "")
                    }} 
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
