import { KidsRoomProvider } from '@/contexts/KidsRoomContext';
import { KidsRoomLayout } from './KidsRoomLayout';
import { KidsRoomContent } from './KidsRoomContent';
import { useKidsRoom } from '@/hooks/useKidsRoom';

const KidsRoomViewerContent = () => {
  useKidsRoom('alphabet_adventure_kids_l1');

  return (
    <KidsRoomLayout backPath="/kids-design-pack" showRefresh={true}>
      <KidsRoomContent />
    </KidsRoomLayout>
  );
};

export const KidsRoomViewer = () => {
  return (
    <KidsRoomProvider>
      <KidsRoomViewerContent />
    </KidsRoomProvider>
  );
};
