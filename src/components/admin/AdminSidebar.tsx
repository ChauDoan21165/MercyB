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
  Users,
  DollarSign,
  Home,
  Inbox,
  CreditCard,
  Gift,
  Volume2,
  Search,
  Flag,
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

// Main navigation — every entry points to a route that actually exists.
const mainItems: AdminNavItem[] = [
  { title: "Dashboard", url: "/admin", icon: Home, end: true },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Feedback", url: "/admin/feedback", icon: Inbox },
];

const billingItems: AdminNavItem[] = [
  { title: "Payments", url: "/admin/payments", icon: DollarSign },
  { title: "Subscriptions", url: "/admin/subscriptions", icon: CreditCard },
  { title: "Access Codes", url: "/admin/access-codes", icon: Gift },
];

const toolsItems: AdminNavItem[] = [
  { title: "Audio Coverage", url: "/admin/audio-coverage", icon: Volume2 },
  { title: "Room Load Diagnostics", url: "/admin/room-load-diagnostics", icon: Search },
  { title: "Feature Flags", url: "/admin/feature-flags", icon: Flag },
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
              Billing
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(billingItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel style={{ color: "#666666", fontWeight: "bold" }}>
              Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(toolsItems)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}