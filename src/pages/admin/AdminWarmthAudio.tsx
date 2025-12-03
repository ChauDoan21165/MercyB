import { WarmthAudioGenerator } from '@/components/admin/WarmthAudioGenerator';

export default function AdminWarmthAudio() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Warmth Audio Generator</h1>
      <WarmthAudioGenerator />
    </div>
  );
}
