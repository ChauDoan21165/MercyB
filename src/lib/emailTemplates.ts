// src/lib/emailTemplates.ts

/**
 * Load a plain-text email template.
 * - First line must start with: "Subject:"
 * - Uses URL-based paths (required for Supabase Edge bundling)
 */
export async function loadEmailTemplate(templateUrl: URL) {
  const text = await fetch(templateUrl).then((r) => r.text());

  const [firstLine, ...rest] = text.split("\n");

  if (!firstLine || !firstLine.startsWith("Subject:")) {
    throw new Error("Email template missing Subject line");
  }

  const subject = firstLine.replace("Subject:", "").trim();
  const body = rest.join("\n").trim();

  return { subject, body };
}
