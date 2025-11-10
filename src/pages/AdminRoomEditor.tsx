import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RoomEntry {
  slug: string;
  keywords_en: string[];
  keywords_vi: string[];
  copy: {
    en: string;
    vi: string;
  };
  tags: string[];
  audio: string;
}

interface RoomFormData {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string;
  schema_id: string;
  room_essay_en: string;
  room_essay_vi: string;
  keywords: string[];
  entries: RoomEntry[];
  crisis_footer_en?: string;
  crisis_footer_vi?: string;
  safety_disclaimer_en?: string;
  safety_disclaimer_vi?: string;
}

export default function AdminRoomEditor() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!roomId;

  const [formData, setFormData] = useState<RoomFormData>({
    id: "",
    title_en: "",
    title_vi: "",
    tier: "free",
    schema_id: "",
    room_essay_en: "",
    room_essay_vi: "",
    keywords: [],
    entries: [],
  });

  // Fetch room data if editing
  const { data: room, isLoading } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      if (!roomId) return null;
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (room) {
      setFormData({
        id: room.id,
        title_en: room.title_en,
        title_vi: room.title_vi,
        tier: room.tier,
        schema_id: room.schema_id,
        room_essay_en: room.room_essay_en || "",
        room_essay_vi: room.room_essay_vi || "",
        keywords: room.keywords || [],
        entries: Array.isArray(room.entries) ? room.entries : [],
        crisis_footer_en: room.crisis_footer_en || "",
        crisis_footer_vi: room.crisis_footer_vi || "",
        safety_disclaimer_en: room.safety_disclaimer_en || "",
        safety_disclaimer_vi: room.safety_disclaimer_vi || "",
      });
    }
  }, [room]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: RoomFormData) => {
      if (isEditMode) {
        const { error } = await supabase
          .from("rooms")
          .update({
            title_en: data.title_en,
            title_vi: data.title_vi,
            tier: data.tier,
            schema_id: data.schema_id,
            room_essay_en: data.room_essay_en,
            room_essay_vi: data.room_essay_vi,
            keywords: data.keywords,
            entries: data.entries,
            crisis_footer_en: data.crisis_footer_en,
            crisis_footer_vi: data.crisis_footer_vi,
            safety_disclaimer_en: data.safety_disclaimer_en,
            safety_disclaimer_vi: data.safety_disclaimer_vi,
          })
          .eq("id", roomId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("rooms")
          .insert({
            id: data.id,
            title_en: data.title_en,
            title_vi: data.title_vi,
            tier: data.tier,
            schema_id: data.schema_id,
            room_essay_en: data.room_essay_en,
            room_essay_vi: data.room_essay_vi,
            keywords: data.keywords,
            entries: data.entries,
            crisis_footer_en: data.crisis_footer_en,
            crisis_footer_vi: data.crisis_footer_vi,
            safety_disclaimer_en: data.safety_disclaimer_en,
            safety_disclaimer_vi: data.safety_disclaimer_vi,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      toast({
        title: "Success",
        description: `Room ${isEditMode ? "updated" : "created"} successfully`,
      });
      navigate("/admin/rooms");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [
        ...formData.entries,
        {
          slug: "",
          keywords_en: [],
          keywords_vi: [],
          copy: { en: "", vi: "" },
          tags: [],
          audio: "",
        },
      ],
    });
  };

  const removeEntry = (index: number) => {
    setFormData({
      ...formData,
      entries: formData.entries.filter((_, i) => i !== index),
    });
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const newEntries = [...formData.entries];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newEntries[index] = {
        ...newEntries[index],
        [parent]: {
          ...(newEntries[index] as any)[parent],
          [child]: value,
        },
      };
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value };
    }
    setFormData({ ...formData, entries: newEntries });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background p-6"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/rooms")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold">
            {isEditMode ? "Edit Room" : "New Room"}
          </h1>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content & Essays</TabsTrigger>
            <TabsTrigger value="entries">Entries</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id">Room ID</Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      disabled={isEditMode}
                      placeholder="e.g., finance-calm-money-sub4-vip3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schema_id">Schema ID</Label>
                    <Input
                      id="schema_id"
                      value={formData.schema_id}
                      onChange={(e) => setFormData({ ...formData, schema_id: e.target.value })}
                      placeholder="e.g., Finance_Calm_Money_Sub4_vip3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_en">Title (English)</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title_vi">Title (Vietnamese)</Label>
                    <Input
                      id="title_vi"
                      value={formData.title_vi}
                      onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tier">Tier</Label>
                  <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="vip1">VIP1</SelectItem>
                      <SelectItem value="vip2">VIP2</SelectItem>
                      <SelectItem value="vip3">VIP3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords.join(", ")}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value.split(",").map(k => k.trim()) })}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="room_essay_en">Room Essay (English)</Label>
                  <Textarea
                    id="room_essay_en"
                    value={formData.room_essay_en}
                    onChange={(e) => setFormData({ ...formData, room_essay_en: e.target.value })}
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="room_essay_vi">Room Essay (Vietnamese)</Label>
                  <Textarea
                    id="room_essay_vi"
                    value={formData.room_essay_vi}
                    onChange={(e) => setFormData({ ...formData, room_essay_vi: e.target.value })}
                    rows={6}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="entries" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{formData.entries.length} Entries</h3>
              <Button onClick={addEntry} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>

            {formData.entries.map((entry, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold">Entry {index + 1}</h4>
                  <Button variant="destructive" size="sm" onClick={() => removeEntry(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Slug (e.g., backup-strategy)"
                      value={entry.slug}
                      onChange={(e) => updateEntry(index, "slug", e.target.value)}
                    />
                    {entry.slug && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(entry.slug);
                          toast({
                            title: "Copied!",
                            description: `Slug: ${entry.slug}`,
                          });
                        }}
                        className="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer flex-shrink-0"
                        title="Copy slug for JSON filename"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Keywords EN (comma-separated)"
                      value={entry.keywords_en?.join(", ") || ""}
                      onChange={(e) => updateEntry(index, "keywords_en", e.target.value.split(",").map(k => k.trim()).filter(Boolean))}
                    />
                    <Input
                      placeholder="Keywords VI (comma-separated)"
                      value={entry.keywords_vi?.join(", ") || ""}
                      onChange={(e) => updateEntry(index, "keywords_vi", e.target.value.split(",").map(k => k.trim()).filter(Boolean))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Textarea
                      placeholder="Content (English)"
                      value={entry.copy.en}
                      onChange={(e) => updateEntry(index, "copy.en", e.target.value)}
                      rows={4}
                    />
                    <Textarea
                      placeholder="Content (Vietnamese)"
                      value={entry.copy.vi}
                      onChange={(e) => updateEntry(index, "copy.vi", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Audio filename"
                      value={entry.audio}
                      onChange={(e) => updateEntry(index, "audio", e.target.value)}
                    />
                    {entry.audio && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(entry.audio);
                          toast({
                            title: "Copied!",
                            description: `Audio: ${entry.audio}`,
                          });
                        }}
                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex-shrink-0"
                        title="Copy audio filename"
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => navigate("/admin/rooms")}>
            Cancel
          </Button>
          <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Room"}
          </Button>
        </div>
      </div>
    </div>
  );
}
