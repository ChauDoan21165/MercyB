import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { 
  Home, 
  Activity, 
  Users, 
  DollarSign, 
  LayoutDashboard, 
  Stethoscope, 
  Music, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Gift, 
  Shield, 
  Code, 
  Palette, 
  AlertTriangle, 
  Settings 
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: any;
  category: string;
}

const adminCommands: CommandItem[] = [
  // Main
  { id: "dashboard", title: "Dashboard", description: "Admin overview", url: "/admin", icon: Home, category: "Main" },
  { id: "room-health", title: "Room Health", description: "System health dashboard", url: "/admin/room-health-dashboard", icon: Activity, category: "Main" },
  { id: "users", title: "Users", description: "User management", url: "/admin/users", icon: Users, category: "Main" },
  { id: "payments", title: "Payments", description: "Payment verification", url: "/admin/payments", icon: DollarSign, category: "Main" },
  
  // Rooms
  { id: "room-mgmt", title: "Room Management", description: "Manage all rooms", url: "/admin/rooms", icon: LayoutDashboard, category: "Rooms" },
  { id: "room-health-check", title: "Room Health Check", description: "Validate room files", url: "/admin/kids-room-health", icon: Stethoscope, category: "Rooms" },
  { id: "vip-rooms", title: "VIP Rooms", description: "VIP room management", url: "/admin/vip-rooms", icon: LayoutDashboard, category: "Rooms" },
  { id: "audio", title: "Audio Management", description: "Upload and manage audio", url: "/admin/audio-upload", icon: Music, category: "Rooms" },
  
  // Monitoring
  { id: "system-health", title: "System Health", description: "System status", url: "/admin/system-health", icon: Activity, category: "Monitoring" },
  { id: "stats", title: "Statistics", description: "Platform statistics", url: "/admin/stats", icon: TrendingUp, category: "Monitoring" },
  { id: "metrics", title: "System Metrics", description: "System metrics", url: "/admin/system-metrics", icon: Activity, category: "Monitoring" },
  { id: "app-metrics", title: "App Metrics", description: "Application metrics", url: "/admin/app-metrics", icon: BarChart3, category: "Monitoring" },
  { id: "reports", title: "Reports", description: "System reports", url: "/admin/reports", icon: FileText, category: "Monitoring" },
  
  // Users
  { id: "vip-requests", title: "VIP Requests", description: "User VIP requests", url: "/vip-requests", icon: MessageSquare, category: "Users" },
  { id: "gift-codes", title: "Gift Codes", description: "Manage gift codes", url: "/admin/gift-codes", icon: Gift, category: "Users" },
  { id: "moderation", title: "Moderation", description: "Content moderation", url: "/admin/moderation", icon: Shield, category: "Users" },
  
  // Dev Tools
  { id: "code-editor", title: "Code Editor", description: "Edit code", url: "/admin/code-editor", icon: Code, category: "Dev Tools" },
  { id: "design-audit", title: "Design Audit", description: "UI/UX audit", url: "/admin/design-audit", icon: Palette, category: "Dev Tools" },
  
  // System
  { id: "security", title: "Security", description: "Security monitoring", url: "/admin/security", icon: Shield, category: "System" },
  { id: "logs", title: "System Logs", description: "View logs", url: "/admin/logs", icon: AlertTriangle, category: "System" },
  { id: "settings", title: "Settings", description: "Admin settings", url: "/admin/settings", icon: Settings, category: "System" },
];

/**
 * Global Admin Command Palette
 * Triggered with Ctrl+K (Windows/Linux) or Cmd+K (Mac)
 * 
 * Search across:
 * - Admin pages
 * - Rooms (future)
 * - Users (future)
 * - Specifications (future)
 */
export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search admin panel... (Ctrl+K)" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {["Main", "Rooms", "Monitoring", "Users", "Dev Tools", "System"].map((category) => (
          <CommandGroup key={category} heading={category}>
            {adminCommands
              .filter((cmd) => cmd.category === category)
              .map((cmd) => (
                <CommandItem
                  key={cmd.id}
                  onSelect={() => handleSelect(cmd.url)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <cmd.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{cmd.title}</div>
                    <div className="text-xs text-muted-foreground">{cmd.description}</div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
