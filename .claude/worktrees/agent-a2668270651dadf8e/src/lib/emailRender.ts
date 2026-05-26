// src/lib/emailRender.ts
export function renderTemplate(
  template: string,
  variables: Record<string, string>
) {
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    if (!(key in variables)) {
      throw new Error(`Missing email variable: ${key}`);
    }
    return variables[key];
  });
}
