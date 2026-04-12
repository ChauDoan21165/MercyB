import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ROOM_FILE_REGEX = /(level0|level1|level2|level3|vip3_ii|level4|level5|level6)\.json$/i;

function filenameToRoomId(filename: string): string {
  const base = filename.replace(/\.json$/i, '');
  return base
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-(level0|level1|level2|level3|level3[-_]ii|level4|level5|level6)$/i, (match) => match.toLowerCase());
}

function extractNames(content: any, filename: string) {
  let nameEn = content.name || null;
  let nameVi = content.name_vi || null;
  
  if (!nameEn && content.title) {
    nameEn = content.title?.en || content.title;
  }
  if (!nameVi && content.title) {
    nameVi = content.title?.vi || content.title;
  }
  
  if (!nameEn) {
    nameEn = content.nameEn || null;
  }
  if (!nameVi) {
    nameVi = content.nameVi || null;
  }
  
  if (!nameEn) {
    nameEn = filename
      .replace(/\.(json)$/i, '')
      .replace(/[_-](level0|level1|level2|level3|level3[-_]ii|level4|level5|level6)$/i, '')
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  nameVi = nameVi || nameEn;
  
  return { nameEn, nameVi };
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { roomFiles } = await req.json();
    
    const manifest: Record<string, string> = {};
    const dataImports: Record<string, any> = {};
    
    for (const [filename, content] of Object.entries(roomFiles as Record<string, any>)) {
      if (!ROOM_FILE_REGEX.test(filename)) continue;
      
      const roomId = filenameToRoomId(filename);
      const names = extractNames(content, filename);
      
      let tier = 'level0';
      if (roomId.endsWith('-level3-ii')) tier = 'vip3_ii';
      else if (roomId.endsWith('-level6')) tier = 'level6';
      else if (roomId.endsWith('-level5')) tier = 'level5';
      else if (roomId.endsWith('-level4')) tier = 'level4';
      else if (roomId.endsWith('-level3')) tier = 'level3';
      else if (roomId.endsWith('-level2')) tier = 'level2';
      else if (roomId.endsWith('-level1')) tier = 'level1';
      
      manifest[roomId] = `data/${filename}`;
      
      dataImports[roomId] = {
        id: roomId,
        nameEn: names.nameEn,
        nameVi: names.nameVi,
        tier,
        hasData: true
      };
    }
    
    return new Response(JSON.stringify({ manifest, dataImports }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})
