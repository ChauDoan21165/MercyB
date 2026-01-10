// supabase/functions/_shared/emailRender.ts

/**
 * Strict template renderer.
 * - Variables must exist
 * - No defaults
 * - Missing variable = hard failure
 */
export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/{{(\w+)}}/g, (_match, key: string) => {
    if (!(key in variables)) {
      throw new Error(`Missing email variable: ${key}`);
    }
    return variables[key];
  });
}
