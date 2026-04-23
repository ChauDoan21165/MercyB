import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  addToCohort,
  listFeatureFlags,
  lookupProfileByEmail,
  removeFromCohort,
  updateFeatureFlag,
  type FeatureFlagRow,
  type ProfileLookupResult,
} from "@/services/featureFlagsAdmin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

type EditState = {
  row: FeatureFlagRow;
  description: string;
  cohort: string[];
  is_enabled: boolean;
  saving: boolean;
  lookupEmail: string;
  lookupResult: ProfileLookupResult | null | "not_found";
  lookupBusy: boolean;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function FeatureFlagsAdmin() {
  const [rows, setRows] = useState<FeatureFlagRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await listFeatureFlags();
      setRows(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onToggleEnabled = useCallback(
    async (row: FeatureFlagRow, next: boolean) => {
      try {
        const updated = await updateFeatureFlag(row.id, { is_enabled: next });
        setRows((prev) =>
          prev ? prev.map((r) => (r.id === row.id ? updated : r)) : prev,
        );
        toast({
          title: next ? "Flag enabled" : "Flag disabled",
          description: row.flag_key,
        });
      } catch (err) {
        toast({
          title: "Save failed",
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      }
    },
    [],
  );

  const openEdit = useCallback((row: FeatureFlagRow) => {
    setEditing({
      row,
      description: row.description ?? "",
      cohort: [...row.enabled_user_ids],
      is_enabled: row.is_enabled,
      saving: false,
      lookupEmail: "",
      lookupResult: null,
      lookupBusy: false,
    });
  }, []);

  const closeEdit = useCallback(() => setEditing(null), []);

  const saveEdit = useCallback(async () => {
    if (!editing) return;
    setEditing((prev) => (prev ? { ...prev, saving: true } : prev));
    try {
      const updated = await updateFeatureFlag(editing.row.id, {
        description: editing.description || null,
        enabled_user_ids: editing.cohort,
        is_enabled: editing.is_enabled,
      });
      setRows((prev) =>
        prev ? prev.map((r) => (r.id === updated.id ? updated : r)) : prev,
      );
      toast({ title: "Saved", description: updated.flag_key });
      setEditing(null);
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
      setEditing((prev) => (prev ? { ...prev, saving: false } : prev));
    }
  }, [editing]);

  const runLookup = useCallback(async () => {
    if (!editing) return;
    const email = editing.lookupEmail.trim();
    if (!email) return;
    setEditing((prev) =>
      prev ? { ...prev, lookupBusy: true, lookupResult: null } : prev,
    );
    try {
      const result = await lookupProfileByEmail(email);
      setEditing((prev) =>
        prev
          ? { ...prev, lookupBusy: false, lookupResult: result ?? "not_found" }
          : prev,
      );
    } catch (err) {
      setEditing((prev) => (prev ? { ...prev, lookupBusy: false } : prev));
      toast({
        title: "Lookup failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    }
  }, [editing]);

  const acceptLookup = useCallback(() => {
    if (!editing || !editing.lookupResult || editing.lookupResult === "not_found") return;
    const id = editing.lookupResult.id;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            cohort: addToCohort(prev.cohort, id),
            lookupEmail: "",
            lookupResult: null,
          }
        : prev,
    );
  }, [editing]);

  const sorted = useMemo(() => rows ?? [], [rows]);

  if (rows === null) {
    return <div style={{ padding: 24 }}>Loading feature flags…</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>
          Feature flags
        </h1>
        <p style={{ fontSize: 14, opacity: 0.75, margin: "6px 0 0" }}>
          Toggle global state or add individual users to the per-flag cohort.
          Changes are saved immediately.
        </p>
      </div>

      {loadError ? (
        <div
          role="alert"
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            marginBottom: 16,
          }}
        >
          Failed to load: {loadError}
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flag</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead>Cohort</TableHead>
            <TableHead>Description</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.id}>
              <TableCell style={{ fontFamily: "monospace", fontWeight: 600 }}>
                {row.flag_key}
              </TableCell>
              <TableCell>
                <Switch
                  checked={row.is_enabled}
                  onCheckedChange={(next) => void onToggleEnabled(row, next)}
                  aria-label={`Toggle ${row.flag_key}`}
                />
              </TableCell>
              <TableCell>
                <span
                  style={{
                    fontSize: 13,
                    color:
                      row.enabled_user_ids.length > 0 ? "#065f46" : "rgba(0,0,0,0.5)",
                  }}
                >
                  {row.enabled_user_ids.length > 0
                    ? `${row.enabled_user_ids.length} user(s)`
                    : "—"}
                </span>
              </TableCell>
              <TableCell style={{ fontSize: 13, maxWidth: 320 }}>
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    verticalAlign: "bottom",
                  }}
                >
                  {row.description || <span style={{ opacity: 0.5 }}>—</span>}
                </span>
              </TableCell>
              <TableCell style={{ textAlign: "right" }}>
                <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing ? (
        <Dialog open onOpenChange={(open) => !open && closeEdit()}>
          <DialogContent style={{ maxWidth: 640 }}>
            <DialogHeader>
              <DialogTitle>{editing.row.flag_key}</DialogTitle>
              <DialogDescription>
                Flag id:{" "}
                <code style={{ fontFamily: "monospace", fontSize: 12 }}>
                  {editing.row.id}
                </code>
              </DialogDescription>
            </DialogHeader>

            <div style={{ display: "grid", gap: 16, marginTop: 4 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Switch
                  id="ff-edit-enabled"
                  checked={editing.is_enabled}
                  onCheckedChange={(next) =>
                    setEditing((prev) => (prev ? { ...prev, is_enabled: next } : prev))
                  }
                />
                <Label htmlFor="ff-edit-enabled">
                  Enabled globally
                </Label>
              </div>

              <div>
                <Label htmlFor="ff-edit-description">Description</Label>
                <Input
                  id="ff-edit-description"
                  value={editing.description}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev,
                    )
                  }
                  placeholder="What this flag controls"
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                  <Label>Cohort ({editing.cohort.length} user{editing.cohort.length === 1 ? "" : "s"})</Label>
                </div>
                {editing.cohort.length === 0 ? (
                  <div style={{ fontSize: 13, opacity: 0.6, padding: "6px 0" }}>
                    No users added yet.
                  </div>
                ) : (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "6px 0 0",
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    {editing.cohort.map((id) => (
                      <li
                        key={id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 10px",
                          background: "rgba(0,0,0,0.04)",
                          borderRadius: 8,
                          fontFamily: "monospace",
                          fontSize: 12,
                        }}
                      >
                        <span>{id}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditing((prev) =>
                              prev
                                ? { ...prev, cohort: removeFromCohort(prev.cohort, id) }
                                : prev,
                            )
                          }
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#b91c1c",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                          aria-label={`Remove ${id}`}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  paddingTop: 14,
                }}
              >
                <Label htmlFor="ff-edit-lookup-email">Add by email</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  <Input
                    id="ff-edit-lookup-email"
                    value={editing.lookupEmail}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev
                          ? { ...prev, lookupEmail: e.target.value, lookupResult: null }
                          : prev,
                      )
                    }
                    placeholder="tester@example.com"
                    type="email"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void runLookup()}
                    disabled={editing.lookupBusy || !editing.lookupEmail.trim()}
                  >
                    {editing.lookupBusy ? "Looking up…" : "Lookup"}
                  </Button>
                </div>
                {editing.lookupResult === "not_found" ? (
                  <div
                    role="status"
                    style={{ fontSize: 13, color: "#991b1b", marginTop: 6 }}
                  >
                    No user with that email.
                  </div>
                ) : editing.lookupResult ? (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 10,
                      background: "#ecfdf5",
                      borderRadius: 8,
                      fontSize: 13,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 12 }}>
                        {editing.lookupResult.id}
                      </div>
                      <div style={{ opacity: 0.75 }}>
                        {editing.lookupResult.display_name ||
                          editing.lookupResult.username ||
                          editing.lookupResult.email}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={acceptLookup}
                      disabled={editing.cohort.includes(editing.lookupResult.id)}
                    >
                      {editing.cohort.includes(editing.lookupResult.id)
                        ? "Already in cohort"
                        : "Add to cohort"}
                    </Button>
                  </div>
                ) : null}

                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>
                  Or paste a UUID directly:
                </div>
                <ManualUuidInput
                  onAdd={(id) => {
                    if (!UUID_REGEX.test(id)) {
                      toast({
                        title: "Not a valid UUID",
                        variant: "destructive",
                      });
                      return;
                    }
                    setEditing((prev) =>
                      prev ? { ...prev, cohort: addToCohort(prev.cohort, id) } : prev,
                    );
                  }}
                />
              </div>
            </div>

            <DialogFooter style={{ marginTop: 16 }}>
              <Button variant="outline" onClick={closeEdit} disabled={editing.saving}>
                Cancel
              </Button>
              <Button onClick={() => void saveEdit()} disabled={editing.saving}>
                {editing.saving ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

function ManualUuidInput({ onAdd }: { onAdd: (id: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="00000000-0000-0000-0000-000000000000"
        autoComplete="off"
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          onAdd(value.trim());
          setValue("");
        }}
        disabled={!value.trim()}
      >
        Add
      </Button>
    </div>
  );
}
