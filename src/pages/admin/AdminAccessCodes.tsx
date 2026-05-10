// src/pages/admin/AdminAccessCodes.tsx
// MB-BLUE-101.4 — 2026-01-01 (+0700)
//
// ADMIN ACCESS CODES (OPERATOR UI):
// - Uses shadcn UI (modern, consistent).
// - Supports ecosystem-ready app_id filtering (default: mercy_blade).
// - CRUD actions are explicit (create/toggle/delete) + refresh.
// - IMPORTANT: This page is rendered INSIDE <AdminLayout> by the router.
//   (Do NOT wrap AdminLayout again here.)

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { Plus, RefreshCw, Copy, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AccessCode {
  id: string;
  code: string;
  tier_id: string;
  days: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
}

export default function AdminAccessCodes() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AccessCode | null>(null);

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState({
    days: 30,
    maxUses: 1,
    notes: "",
  });

  // Duration preset: maps to days. "lifetime" → -1 (sentinel for no expiration).
  type DurationPreset = "1m" | "6m" | "1y" | "lifetime";
  const DURATION_OPTIONS: { value: DurationPreset; label: string; days: number }[] = [
    { value: "1m", label: "1 month", days: 30 },
    { value: "6m", label: "6 months", days: 180 },
    { value: "1y", label: "1 year", days: 365 },
    { value: "lifetime", label: "Lifetime", days: -1 },
  ];

  function setDurationPreset(preset: DurationPreset) {
    const option = DURATION_OPTIONS.find((o) => o.value === preset);
    if (option) {
      setNewCode((prev) => ({ ...prev, days: option.days }));
    }
  }

  // Default tier ID — fetched silently. All codes use the first active tier.
  const [defaultTierId, setDefaultTierId] = useState<string>("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    await Promise.all([fetchTiers(), fetchCodes()]);
  }

  async function fetchCodes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCodes((data ?? []) as AccessCode[]);
    } catch (error: any) {
      console.error("Error fetching codes:", error);
      toast.error(error?.message || "Failed to fetch access codes");
      setCodes([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTiers() {
    try {
      // Silently resolve the default tier for access code creation.
      // Tier selection is no longer user-facing — all codes use the first active tier.
      const { data, error } = await supabase
        .from("subscription_tiers")
        .select("id")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setDefaultTierId((data as any)?.id ?? "");
    } catch (error: any) {
      console.error("Error fetching default tier:", error);
      setDefaultTierId("");
    }
  }

  function generateCodeString(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += "-";
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async function createCode() {
    if (!defaultTierId) {
      toast.error("No active subscription tier found. Contact admin.");
      return;
    }

    setCreating(true);
    try {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userRes.user) throw new Error("Not authenticated");

      const code = generateCodeString();

      const days = Number.isFinite(newCode.days) ? newCode.days : 30;
      const payload: any = {
        code,
        tier_id: defaultTierId,
        days,
        max_uses: Number.isFinite(newCode.maxUses) ? newCode.maxUses : 1,
        notes: newCode.notes?.trim() ? newCode.notes.trim() : null,
        created_by: userRes.user.id,
        is_active: true,
        // Lifetime sentinel: -1 days → expires_at null (no expiration)
        ...(days === -1 && { expires_at: null }),
      };

      const { error } = await supabase.from("access_codes").insert(payload);
      if (error) throw error;

      toast.success("Access code created");
      try {
        await navigator.clipboard.writeText(code);
        toast.info("Code copied");
      } catch {
        // ignore clipboard failures
      }

      setCreateDialogOpen(false);
      setNewCode({ days: 30, maxUses: 1, notes: "" });
      await fetchCodes();
    } catch (error: any) {
      console.error("Error creating code:", error);
      toast.error(error?.message || "Failed to create access code");
    } finally {
      setCreating(false);
    }
  }

  async function toggleCodeStatus(codeId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("access_codes")
        .update({ is_active: !currentStatus })
        .eq("id", codeId);

      if (error) throw error;

      toast.success(`Code ${currentStatus ? "deactivated" : "activated"}`);
      await fetchCodes();
    } catch (error: any) {
      console.error("Error toggling code status:", error);
      toast.error(error?.message || "Failed to update code status");
    }
  }

  function askDelete(code: AccessCode) {
    setPendingDelete(code);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase.from("access_codes").delete().eq("id", pendingDelete.id);
      if (error) throw error;

      toast.success("Code deleted");
      setDeleteDialogOpen(false);
      setPendingDelete(null);
      await fetchCodes();
    } catch (error: any) {
      console.error("Error deleting code:", error);
      toast.error(error?.message || "Failed to delete code");
    } finally {
      setDeleting(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success("Code copied"))
      .catch(() => toast.error("Clipboard blocked"));
  }

  const filteredCodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return codes;

    return codes.filter((c) => {
      const hay =
        `${c.code} ${c.notes || ""} ${c.tier_id || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [codes, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Access Codes</h1>
          <p className="text-muted-foreground">
            Generate and manage subscription access codes
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={fetchCodes}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Code
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white dark:bg-neutral-900 text-foreground border-border">
              <DialogHeader>
                <DialogTitle>Create Access Code</DialogTitle>
                <DialogDescription>
                  Generate a new code for subscription activation (safe, explicit).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Duration</Label>
                    <Select
                      value={DURATION_OPTIONS.find((o) => o.days === newCode.days)?.value ?? ""}
                      onValueChange={(value) => setDurationPreset(value as DurationPreset)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Max Uses</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newCode.maxUses}
                      onChange={(e) =>
                        setNewCode({
                          ...newCode,
                          maxUses: parseInt(e.target.value, 10) || 1,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Notes (optional)</Label>
                  <Textarea
                    placeholder="Internal notes about this code..."
                    value={newCode.notes}
                    onChange={(e) => setNewCode({ ...newCode, notes: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createCode} disabled={creating}>
                  {creating ? "Creating..." : "Create Code"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Access Codes</CardTitle>
              <CardDescription>{filteredCodes.length} codes found</CardDescription>
            </div>

            <div className="relative w-72 max-w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search codes / notes / tier…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No access codes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
                            {code.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyCode(code.code)}
                            aria-label="Copy code"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {code.notes ? (
                          <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {code.notes}
                          </div>
                        ) : null}
                      </TableCell>

                      <TableCell>
                        {code.days === -1
                          ? "Lifetime"
                          : code.days >= 365
                            ? `${Math.round(code.days / 30)} months`
                            : `${code.days} days`}
                      </TableCell>

                      <TableCell>
                        {(code.used_count ?? 0)} / {code.max_uses}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={code.is_active ? "default" : "secondary"}
                          className="cursor-pointer select-none"
                          onClick={() => toggleCodeStatus(code.id, code.is_active)}
                          aria-label="Toggle active"
                        >
                          {code.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {code.created_at ? format(new Date(code.created_at), "MMM d, yyyy") : "—"}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => askDelete(code)}
                          aria-label="Delete code"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm (no window.confirm) */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-neutral-900 text-foreground border-border">
          <DialogHeader>
            <DialogTitle>Delete access code</DialogTitle>
            <DialogDescription>
              This is permanent. Only delete codes you are sure you will never need again.
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm text-foreground">
            <div className="font-semibold">Code</div>
            <div className="mt-1 font-mono text-xs opacity-80">
              {pendingDelete?.code || "—"}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setPendingDelete(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* New thing to learn:
   Don’t double-wrap layouts. If the router already wraps a page with <AdminLayout>,
   the page should export content-only, or your UI will “nest” and look broken. */
