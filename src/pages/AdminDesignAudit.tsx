import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { DesignAuditReport } from "@/components/DesignAuditReport";

const AdminDesignAudit = () => {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <AdminBreadcrumb 
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Design Audit" }
          ]} 
        />
        
        <DesignAuditReport />
      </div>
    </AdminLayout>
  );
};

export default AdminDesignAudit;
