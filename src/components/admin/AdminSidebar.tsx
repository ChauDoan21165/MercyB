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

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home, end: true },
  { title: "Room Management", url: "/admin/rooms", icon: LayoutDashboard },
  { title: "Room Health Check", url: "/admin/kids-room-health", icon: Stethoscope },
  { title: "System Health", url: "/admin/system-health", icon: Activity },
  { title: "Code Editor", url: "/admin/code-editor", icon: Code },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Security", url: "/admin/security", icon: Shield },
  { title: "Statistics", url: "/admin/stats", icon: TrendingUp },
  { title: "System Metrics", url: "/admin/system-metrics", icon: Activity },
  { title: "VIP Requests", url: "/vip-requests", icon: MessageSquare },
  { title: "Payment Verification", url: "/admin/payments", icon: DollarSign },
  { title: "Gift Codes", url: "/admin/gift-codes", icon: Gift },
  { title: "Audio Management", url: "/admin/audio-upload", icon: Music },
  { title: "Moderation", url: "/admin/moderation", icon: Shield },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "VIP Rooms", url: "/admin/vip-rooms", icon: LayoutDashboard },
  { title: "Design Audit", url: "/admin/design-audit", icon: Palette },
  { title: "App Metrics", url: "/admin/app-metrics", icon: BarChart3 },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-black bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-black font-bold">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
