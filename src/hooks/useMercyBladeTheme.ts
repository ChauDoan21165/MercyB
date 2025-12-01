/**
 * Global Mercy Blade Theme Hook
 * 
 * Determines whether to use "color" (Mercy Blade rainbow colors) or "bw" (black & white) mode.
 * 
 * Priority:
 * 1. Room specification use_color_theme (if useColorThemeFromSpec is true)
 * 2. Default mode (fallback)
 * 
 * Future: Can be extended with user preferences from localStorage.
 */

export interface UseMercyBladeThemeOptions {
  /**
   * Whether to use the specification's use_color_theme field
   */
  useColorThemeFromSpec?: boolean;
  
  /**
   * Default mode when no specification or preference is available
   */
  defaultMode?: "color" | "bw";
  
  /**
   * The specification's use_color_theme boolean value
   */
  specUseColorTheme?: boolean | null;
}

export interface UseMercyBladeThemeResult {
  mode: "color" | "bw";
}

export function useMercyBladeTheme(
  options?: UseMercyBladeThemeOptions
): UseMercyBladeThemeResult {
  const {
    useColorThemeFromSpec = false,
    defaultMode = "color",
    specUseColorTheme = null,
  } = options || {};

  let mode: "color" | "bw" = defaultMode;

  // If we're using specification and it has a boolean value
  if (useColorThemeFromSpec && typeof specUseColorTheme === "boolean") {
    mode = specUseColorTheme ? "color" : "bw";
  }

  // Future: Add user preference from localStorage here
  // const userPreference = localStorage.getItem('mercy-blade-theme');
  // if (userPreference === 'color' || userPreference === 'bw') {
  //   mode = userPreference;
  // }

  return { mode };
}
