import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";
import { generateTtsAudio, selectVoiceForLanguage } from "../_shared/openai-tts.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, mb-admin-token',
};

const MAX_TASKS_PER_REQUEST = 50;

type AudioLang = 'en' | 'vi';
type AudioKind = 'content' | 'reflection' | 'dare' | 'intro';

interface AudioTask {
  target: 'path_days';
  id: string;
  slug: string;
  day_index: number;
  lang: AudioLang;
  kind: AudioKind;
  text: string;
  suggestedFilename: string;
  field: string;
}

interface GenerateRequest {
  tasks: AudioTask[];
}

interface TaskResult {
  id: string;
  filename: string;
  status: 'success' | 'skipped_exists' | 'error';
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const adminToken = req.headers.get('mb-admin-token');
    const expectedToken = Deno.env.get('MB_ADMIN_TOKEN');
    
    if (!expectedToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Server misconfiguration: MB_ADMIN_TOKEN not set' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (adminToken !== expectedToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: GenerateRequest = await req.json();
    const { tasks } = body;

    if (!tasks || !Array.isArray(tasks)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid request: tasks array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enforce max tasks limit
    if (tasks.length > MAX_TASKS_PER_REQUEST) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: `Too many tasks. Maximum ${MAX_TASKS_PER_REQUEST} per request. Got ${tasks.length}.` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[audio-batch-generate] Processing ${tasks.length} tasks`);

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: TaskResult[] = [];
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process tasks sequentially to avoid OpenAI rate limits
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      console.log(`[audio-batch-generate] Processing task ${i + 1}/${tasks.length}: ${task.suggestedFilename}`);

      try {
        // Double-check the audio field is still empty
        const { data: currentRow, error: checkError } = await supabase
          .from('path_days')
          .select(task.field)
          .eq('id', task.id)
          .single();

        if (checkError) {
          results.push({
            id: task.id,
            filename: task.suggestedFilename,
            status: 'error',
            error: `Failed to check current state: ${checkError.message}`,
          });
          errorCount++;
          continue;
        }

        const currentValue = (currentRow as any)?.[task.field];
        if (currentValue && currentValue.trim() !== '') {
          // Audio already exists, skip
          results.push({
            id: task.id,
            filename: task.suggestedFilename,
            status: 'skipped_exists',
          });
          skippedCount++;
          continue;
        }

        // Generate TTS audio
        const voice = selectVoiceForLanguage(task.lang);
        const { audioBuffer } = await generateTtsAudio({
          text: task.text,
          voice,
          language: task.lang,
          model: 'tts-1',
        });

        // Upload to storage
        const storagePath = `paths/${task.suggestedFilename}`;
        const { error: uploadError } = await supabase.storage
          .from('audio')
          .upload(storagePath, audioBuffer, {
            contentType: 'audio/mpeg',
            upsert: true,
          });

        if (uploadError) {
          results.push({
            id: task.id,
            filename: task.suggestedFilename,
            status: 'error',
            error: `Storage upload failed: ${uploadError.message}`,
          });
          errorCount++;
          continue;
        }

        // Update database with audio path
        const audioPath = `/audio/paths/${task.suggestedFilename}`;
        const { error: updateError } = await supabase
          .from('path_days')
          .update({ [task.field]: audioPath })
          .eq('id', task.id);

        if (updateError) {
          results.push({
            id: task.id,
            filename: task.suggestedFilename,
            status: 'error',
            error: `DB update failed: ${updateError.message}`,
          });
          errorCount++;
          continue;
        }

        results.push({
          id: task.id,
          filename: task.suggestedFilename,
          status: 'success',
        });
        successCount++;

        // Small delay between tasks to be nice to OpenAI
        if (i < tasks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }

      } catch (taskError) {
        console.error(`[audio-batch-generate] Task error for ${task.suggestedFilename}:`, taskError);
        results.push({
          id: task.id,
          filename: task.suggestedFilename,
          status: 'error',
          error: taskError instanceof Error ? taskError.message : 'Unknown error',
        });
        errorCount++;
      }
    }

    console.log(`[audio-batch-generate] Complete: ${successCount} success, ${skippedCount} skipped, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        ok: true,
        results,
        summary: {
          success: successCount,
          skipped: skippedCount,
          errors: errorCount,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[audio-batch-generate] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
