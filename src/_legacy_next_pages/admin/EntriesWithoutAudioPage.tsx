import { AdminLayout } from "@/components/admin/AdminLayout";
import { EntriesWithoutAudio } from "@/components/admin/EntriesWithoutAudio";

export default function EntriesWithoutAudioPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Entries Without Audio</h1>
          <p className="text-gray-600">Find all room entries that are missing audio files</p>
        </div>
        <EntriesWithoutAudio />
      </div>
    </AdminLayout>
  );
}
