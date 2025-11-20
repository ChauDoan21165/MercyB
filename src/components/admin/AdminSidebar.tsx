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
  { title: "Code Editor", url: "/admin/code-editor", icon: Code },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Statistics", url: "/admin/stats", icon: TrendingUp },
  { title: "VIP Requests", url: "/vip-requests", icon: MessageSquare },
  { title: "Payment Verification", url: "/admin/payments", icon: DollarSign },
  { title: "Audio Management", url: "/admin/audio-upload", icon: Music },
  { title: "Moderation", url: "/admin/moderation", icon: Shield },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "VIP Rooms", url: "/admin/vip-rooms", icon: LayoutDashboard },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-accent/50"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
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
