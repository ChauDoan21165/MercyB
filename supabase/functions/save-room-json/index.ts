import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filename, content } = await req.json()

    if (!filename || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing filename or content' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Write file to public/data directory
    const filepath = `./public/data/${filename}`
    await Deno.writeTextFile(filepath, content)

    console.log(`✅ Saved room JSON: ${filename}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `File ${filename} saved successfully`,
        path: filepath 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error saving room JSON:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
