import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AdminTheme = "light" | "dark";

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

const STORAGE_KEY = "admin_visual_mode";

/**
 * Admin Theme Provider
 * Independent theme system for admin panel with localStorage persistence
 * 
 * Usage:
 *   <AdminThemeProvider>
 *     <AdminLayout>...</AdminLayout>
 *   </AdminThemeProvider>
 */
export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>(() => {
    // Get stored theme or default to dark
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const initialTheme = (stored === "light" || stored === "dark") ? stored : "dark";
    
    // Apply theme class immediately to prevent flash
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (initialTheme === "dark") {
        root.classList.add("admin-dark");
        root.classList.remove("admin-light");
      } else {
        root.classList.add("admin-light");
        root.classList.remove("admin-dark");
      }
    }
    
    return initialTheme;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Apply theme to admin container
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("admin-dark");
      root.classList.remove("admin-light");
    } else {
      root.classList.add("admin-light");
      root.classList.remove("admin-dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

/**
 * Hook to access admin theme
 */
export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}
