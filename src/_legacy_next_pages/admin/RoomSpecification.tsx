import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { RoomSpecificationManager } from '@/components/admin/RoomSpecificationManager';

export default function RoomSpecification() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <AdminBreadcrumb 
          items={[
            { label: "Dashboard", href: "/admin" }, 
            { label: "Room Specification" }
          ]} 
        />
        <RoomSpecificationManager />
      </div>
    </AdminLayout>
  );
}