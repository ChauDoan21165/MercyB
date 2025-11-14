import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";

export default function AdminCodeEditor() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["admin-rooms-editor"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("title_en");
      
      if (error) throw error;
      return data;
    },
  });

  const loadRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const jsonContent = {
        id: data.id,
        title_en: data.title_en,
        title_vi: data.title_vi,
        tier: data.tier,
        schema_id: data.schema_id,
        entries: data.entries,
        keywords_en: data.keywords_en,
        keywords_vi: data.keywords_vi,
        essay_en: data.essay_en,
        essay_vi: data.essay_vi,
      };
      setEditorContent(JSON.stringify(jsonContent, null, 2));
    },
  });

  const saveRoomMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRoomId) throw new Error("No room selected");
      
      const parsed = JSON.parse(editorContent);
      const { error } = await supabase
        .from("rooms")
        .update({
          title_en: parsed.title_en,
          title_vi: parsed.title_vi,
          tier: parsed.tier,
          schema_id: parsed.schema_id,
          entries: parsed.entries,
          keywords_en: parsed.keywords_en,
          keywords_vi: parsed.keywords_vi,
          essay_en: parsed.essay_en,
          essay_vi: parsed.essay_vi,
        })
        .eq("id", selectedRoomId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms-editor"] });
      toast({
        title: "Success",
        description: "Room updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    loadRoomMutation.mutate(roomId);
  };

  const handleSave = () => {
    try {
      JSON.parse(editorContent);
      saveRoomMutation.mutate();
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please fix JSON syntax errors before saving",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Code Editor</h1>
          <p className="text-muted-foreground">Edit room JSON data directly</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <Select value={selectedRoomId} onValueChange={handleRoomSelect}>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select a room to edit" />
            </SelectTrigger>
            <SelectContent>
              {rooms?.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.title_en} ({room.tier})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRoomId && (
            <>
              <Button
                onClick={handleSave}
                disabled={saveRoomMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => loadRoomMutation.mutate(selectedRoomId)}
                disabled={loadRoomMutation.isPending}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload
              </Button>
            </>
          )}
        </div>

        {selectedRoomId && (
          <Editor
            height="70vh"
            defaultLanguage="json"
            value={editorContent}
            onChange={(value) => setEditorContent(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              formatOnPaste: true,
              formatOnType: true,
              automaticLayout: true,
            }}
          />
        )}

        {!selectedRoomId && (
          <div className="h-[70vh] flex items-center justify-center text-muted-foreground">
            Select a room to start editing
          </div>
        )}
      </Card>
    </div>
  );
}
