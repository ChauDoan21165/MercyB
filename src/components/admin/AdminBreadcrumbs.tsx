import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Fragment } from "react";

/**
 * Admin Breadcrumbs Navigation
 * Shows hierarchical path in admin panel for clarity
 * 
 * Example: Admin > Room Health > Deep Scan
 */
export function AdminBreadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Map paths to readable names
  const pathNames: Record<string, string> = {
    admin: "Admin",
    health: "Room Health",
    users: "Users",
    payments: "Payments",
    "room-specifications": "Room Specs",
    "feedback-analytics": "Feedback",
    analytics: "Analytics",
    security: "Security",
    logs: "Logs",
    settings: "Settings",
    "payment-verification": "Payment Verification",
    "payment-monitoring": "Payment Monitoring",
  };

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const name = pathNames[segment] || segment;
    return { path, name };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <Link 
        to="/"
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <Fragment key={crumb.path}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-black">{crumb.name}</span>
          ) : (
            <Link
              to={crumb.path}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
