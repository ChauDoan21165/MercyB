import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const KidsAdminButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/admin/kids-standardizer')}
      variant="outline"
      size="sm"
      className="gap-2 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
    >
      <Wand2 className="w-4 h-4" />
      Apply Mercy Blade Standards
    </Button>
  );
};
