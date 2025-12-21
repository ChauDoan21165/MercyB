import { AdminLayout } from "@/components/admin/AdminLayout";
import { FastAudioScanner } from "@/components/admin/FastAudioScanner";

const FastAudioScannerPage = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Fast Audio Scanner</h1>
          <p className="text-muted-foreground mt-1">
            Local filesystem scan to find missing mp3 files referenced in room JSON
          </p>
        </div>
        
        <FastAudioScanner />
      </div>
    </AdminLayout>
  );
};

export default FastAudioScannerPage;
