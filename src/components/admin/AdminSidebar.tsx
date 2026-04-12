/**
 * Path: src/components/admin/AdminSidebar.tsx
 * File: AdminSidebar.tsx
 */

/**
 * MercyBlade Blue — Admin Sidebar (SIMPLE BLACK TEXT ON WHITE)
 * Path: src/components/admin/AdminSidebar.tsx
 * Version: MB-BLUE-94.13.15 — 2026-04-02
 *
 * NOTES:
 * - This file does NOT own auth state. It must not subscribe to Supabase.
 * - Pure navigation UI only.
 *
 * CHANGE (94.13.15):
 * - Add Admin Billing nav item.
 * - Keep existing Admin Subscriptions nav item.
 * - Keep simple black text on white styling.
 * - Tighten icon typing.
 *
 * PATCH (2026-04-12):
 * - Add Room Load Diagnostics nav item.
 * - Keep existing structure and styling intact.
 */

import type { LucideIcon } from "lucide-react";
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
  Mail,
  CreditCard,
  Search,
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

type AdminNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  end?: boolean;
};

// Main navigation items
const mainItems: AdminNavItem[] = [
  { title: "AI Usage & Costs", url: "/admin/ai-usage", icon: Activity, end: false },
  { title: "Dashboard", url: "/admin", icon: Home, end: true },
  { title: "Payments", url: "/admin/payments", icon: DollarSign },
  { title: "Subscriptions", url: "/admin/subscriptions", icon: CreditCard },
  { title: "Billing", url: "/admin/billing", icon: CreditCard },
  { title: "Bank Transfers", url: "/admin/bank-transfers", icon: DollarSign },
  { title: "Room Health", url: "/admin/room-health-dashboard", icon: Activity },
  { title: "Users", url: "/admin/users", icon: Users },
];

// Room management tools
const roomItems: AdminNavItem[] = [
  { title: "Audio Management", url: "/admin/audio-upload", icon: Music },
  { title: "Audio Scanner", url: "/admin/audio-scanner", icon: Volume2 },
  { title: "Audit v4 Safe Shield", url: "/admin/audit-v4", icon: Shield },
  { title: "Missing Audio", url: "/admin/missing-audio", icon: AlertTriangle },
  { title: "Music Controller", url: "/admin/homepage-music", icon: Music },
  { title: "Room Health Check", url: "/admin/room-health", icon: Stethoscope },
  { title: "Room Load Diagnostics", url: "/admin/room-load-diagnostics", icon: Search },
  { title: "Room Management", url: "/admin/rooms", icon: LayoutDashboard },
  { title: "VIP Rooms", url: "/admin/vip-rooms", icon: LayoutDashboard },
];

// Monitoring & analytics
const monitoringItems: AdminNavItem[] = [
  { title: "App Metrics", url: "/admin/app-metrics", icon: BarChart3 },
  { title: "Email Broadcast", url: "/admin/email-broadcast", icon: Mail },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Statistics", url: "/admin/stats", icon: TrendingUp },
  { title: "System Health", url: "/admin/system-health", icon: Activity },
  { title: "System Metrics", url: "/admin/system-metrics", icon: Activity },
];

// User management
const userManagementItems: AdminNavItem[] = [
  { title: "Gift Codes", url: "/admin/gift-codes", icon: Gift },
  { title: "Manage Admins", url: "/admin/manage-admins", icon: Shield },
  { title: "Moderation", url: "/admin/moderation", icon: Shield },
  { title: "VIP Requests", url: "/vip-requests", icon: MessageSquare },
];

// Developer tools
const devToolsItems: AdminNavItem[] = [
  { title: "Code Editor", url: "/admin/code-editor", icon: Code },
  { title: "Design Audit", url: "/admin/design-audit", icon: Palette },
  { title: "System Codes", url: "/admin/system-codes", icon: FileText },
];

// System tools
const systemItems: AdminNavItem[] = [
  { title: "Logs", url: "/admin/logs", icon: AlertTriangle },
  { title: "Security", url: "/admin/security", icon: Shield },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  const renderMenuItems = (items: AdminNavItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              end={item.end}
              style={{ color: "#000000" }}
              activeClassName="font-bold"
            >
              <item.icon className="h-4 w-4" style={{ color: "#000000" }} />
              {open && <span style={{ color: "#000000" }}>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="[&_[data-sidebar=sidebar]]:!bg-[#F5F5F5] !text-[#000000]"
      style={{
        backgroundColor: "#F5F5F5",
        borderRight: "1px solid #E0E0E0",
        color: "#000000",
      }}
    >
      <SidebarContent
        className="py-4 bg-[#F5F5F5]"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel style={{ color: "#666666", fontWeight: "bold" }}>
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(mainItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel style={{ color: "#666666", fontWeight: "bold" }}>
              Rooms
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(roomItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel style={{ color: "#666666", fontWeight: "bold" }}>
              Monitoring
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(monitoringItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel style={{ color: "#666666", fontWeight: "bold" }}>
              Users
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(userManagementItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel style={{ color: "#666666", fontWeight: "bold" }}>
              Dev Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(devToolsItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel style={{ color: "#666666", fontWeight: "bold" }}>
              System
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(systemItems)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}