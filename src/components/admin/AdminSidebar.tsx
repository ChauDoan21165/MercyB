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
 * Admin Sidebar - SIMPLE BLACK TEXT ON WHITE
 * No CSS variables - direct hex colors for reliability
 */

// Main navigation items
const mainItems = [
  { title: "AI Usage & Costs", url: "/admin/ai-usage", icon: Activity, end: false },
  { title: "Dashboard", url: "/admin", icon: Home, end: true },
  { title: "Payments", url: "/admin/payments", icon: DollarSign },
  { title: "Room Health", url: "/admin/room-health-dashboard", icon: Activity },
  { title: "Users", url: "/admin/users", icon: Users },
];

// Room management tools
const roomItems = [
  { title: "Audio Management", url: "/admin/audio-upload", icon: Music },
  { title: "Audio Scanner", url: "/admin/audio-scanner", icon: Volume2 },
  { title: "Audit v4 Safe Shield", url: "/admin/audit-v4", icon: Shield },
  { title: "Missing Audio", url: "/admin/missing-audio", icon: AlertTriangle },
  { title: "Music Controller", url: "/admin/homepage-music", icon: Music },
  { title: "Room Health Check", url: "/admin/room-health", icon: Stethoscope },
  { title: "Room Management", url: "/admin/rooms", icon: LayoutDashboard },
  { title: "VIP Rooms", url: "/admin/vip-rooms", icon: LayoutDashboard },
];

// Monitoring & analytics
const monitoringItems = [
  { title: "App Metrics", url: "/admin/app-metrics", icon: BarChart3 },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Statistics", url: "/admin/stats", icon: TrendingUp },
  { title: "System Health", url: "/admin/system-health", icon: Activity },
  { title: "System Metrics", url: "/admin/system-metrics", icon: Activity },
];

// User management
const userManagementItems = [
  { title: "Gift Codes", url: "/admin/gift-codes", icon: Gift },
  { title: "Moderation", url: "/admin/moderation", icon: Shield },
  { title: "VIP Requests", url: "/vip-requests", icon: MessageSquare },
];

// Developer tools
const devToolsItems = [
  { title: "Code Editor", url: "/admin/code-editor", icon: Code },
  { title: "Design Audit", url: "/admin/design-audit", icon: Palette },
  { title: "System Codes", url: "/admin/system-codes", icon: FileText },
];

// System tools
const systemItems = [
  { title: "Logs", url: "/admin/logs", icon: AlertTriangle },
  { title: "Security", url: "/admin/security", icon: Shield },
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
              style={{ color: '#000000' }}
              activeClassName="font-bold"
            >
              <item.icon className="h-4 w-4" style={{ color: '#000000' }} />
              {open && <span style={{ color: '#000000' }}>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar 
      collapsible="icon" 
      className="!bg-[#F5F5F5] !text-[#000000]"
      style={{ 
        backgroundColor: '#F5F5F5 !important', 
        borderRight: '1px solid #E0E0E0',
        color: '#000000'
      }}
    >
      <SidebarContent className="py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {open && <SidebarGroupLabel style={{ color: '#666666', fontWeight: 'bold' }}>Main</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Room Management */}
        <SidebarGroup>
          {open && <SidebarGroupLabel style={{ color: '#666666', fontWeight: 'bold' }}>Rooms</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(roomItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Monitoring & Analytics */}
        <SidebarGroup>
          {open && <SidebarGroupLabel style={{ color: '#666666', fontWeight: 'bold' }}>Monitoring</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(monitoringItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Management */}
        <SidebarGroup>
          {open && <SidebarGroupLabel style={{ color: '#666666', fontWeight: 'bold' }}>Users</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(userManagementItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Developer Tools */}
        <SidebarGroup>
          {open && <SidebarGroupLabel style={{ color: '#666666', fontWeight: 'bold' }}>Dev Tools</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(devToolsItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          {open && <SidebarGroupLabel style={{ color: '#666666', fontWeight: 'bold' }}>System</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderMenuItems(systemItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}