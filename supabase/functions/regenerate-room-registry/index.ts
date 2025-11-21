import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ROOM_FILE_REGEX = /(free|vip1|vip2|vip3|vip3_ii|vip4|vip5|vip6)\.json$/i;

function filenameToRoomId(filename: string): string {
  const base = filename.replace(/\.json$/i, '');
  return base
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-(free|vip1|vip2|vip3|vip3[-_]ii|vip4|vip5|vip6)$/i, (match) => match.toLowerCase());
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
      .replace(/[_-](free|vip1|vip2|vip3|vip3[-_]ii|vip4|vip5|vip6)$/i, '')
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
      
      let tier = 'free';
      if (roomId.endsWith('-vip3-ii')) tier = 'vip3_ii';
      else if (roomId.endsWith('-vip6')) tier = 'vip6';
      else if (roomId.endsWith('-vip5')) tier = 'vip5';
      else if (roomId.endsWith('-vip4')) tier = 'vip4';
      else if (roomId.endsWith('-vip3')) tier = 'vip3';
      else if (roomId.endsWith('-vip2')) tier = 'vip2';
      else if (roomId.endsWith('-vip1')) tier = 'vip1';
      
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})
