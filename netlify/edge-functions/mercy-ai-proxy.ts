export default async function handler(request: Request): Promise<Response> {
  const targetUrl = new URL("/.netlify/functions/mercy-ai", request.url);

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });
}
