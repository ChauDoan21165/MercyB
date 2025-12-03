import {
  LayoutDashboard,
  Users,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Music,
  Shield,
  FileText,
  Home,
  Code,
  Activity,
  Palette,
  Gift,
  Stethoscope,
  BarChart3,
  Settings,
  AlertTriangle,
  Volume2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * Modern Admin Sidebar V2.0
 * Organized into logical groups for better navigation
 */

// Main navigation items
const mainItems = [
  { title: "Dashboard", url: "/admin", icon: Home, end: true },
  { title: "Room Health", url: "/admin/room-health-dashboard", icon: Activity },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Payments", url: "/admin/payments", icon: DollarSign },
];

// Room management tools
const roomItems = [
  { title: "Room Management", url: "/admin/rooms", icon: LayoutDashboard },
  { title: "Room Health Check", url: "/admin/room-health", icon: Stethoscope },
  { title: "Audit v4 Safe Shield", url: "/admin/audit-v4", icon: Shield },
  { title: "VIP Rooms", url: "/admin/vip-rooms", icon: LayoutDashboard },
  { title: "Audio Management", url: "/admin/audio-upload", icon: Music },
  { title: "Audio Scanner", url: "/admin/audio-scanner", icon: Volume2 },
  { title: "Missing Audio", url: "/admin/missing-audio", icon: AlertTriangle },
];

// Monitoring & analytics
const monitoringItems = [
  { title: "System Health", url: "/admin/system-health", icon: Activity },
  { title: "Statistics", url: "/admin/stats", icon: TrendingUp },
  { title: "System Metrics", url: "/admin/system-metrics", icon: Activity },
  { title: "App Metrics", url: "/admin/app-metrics", icon: BarChart3 },
  { title: "Reports", url: "/admin/reports", icon: FileText },
];

// User management & requests
const userManagementItems = [
  { title: "VIP Requests", url: "/vip-requests", icon: MessageSquare },
  { title: "Gift Codes", url: "/admin/gift-codes", icon: Gift },
  { title: "Moderation", url: "/admin/moderation", icon: Shield },
];

// Developer tools
const devToolsItems = [
  { title: "Code Editor", url: "/admin/code-editor", icon: Code },
  { title: "Design Audit", url: "/admin/design-audit", icon: Palette },
];

// System tools
const systemItems = [
  { title: "Security", url: "/admin/security", icon: Shield },
  { title: "Logs", url: "/admin/logs", icon: AlertTriangle },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  const renderMenuItems = (items: typeof mainItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              end={item.end}
              className="hover:bg-gray-100 text-black"
              activeClassName="bg-gray-200 text-black font-bold"
            >
              <item.icon className="h-4 w-4 text-black" />
              {open && <span className="text-black">{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-black bg-white">
      <SidebarContent className="py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-black font-bold">Main</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Room Management */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-black font-bold">Rooms</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(roomItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Monitoring & Analytics */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-black font-bold">Monitoring</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(monitoringItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Management */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-black font-bold">Users</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(userManagementItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Developer Tools */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-black font-bold">Dev Tools</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(devToolsItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-black font-bold">System</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(systemItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
