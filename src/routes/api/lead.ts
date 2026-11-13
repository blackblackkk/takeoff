import { createFileRoute } from "@tanstack/react-router";
import { allowLead, parseLead, sendLead } from "@/lib/telegram-lead.server";

const allowOrigin = new Set(["https://takeoff.news", "https://www.takeoff.news"]);

function cors(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const headers = new Headers();
  if (allowOrigin.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }
  return headers;
}

export const Route = createFileRoute("/api/lead")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const headers = cors(request);
        headers.set("access-control-allow-methods", "POST, OPTIONS");
        headers.set("access-control-allow-headers", "content-type");
        return new Response(null, { status: 204, headers });
      },
      POST: async ({ request }) => {
        const headers = cors(request);
        headers.set("content-type", "application/json; charset=utf-8");
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
        if (!allowLead(ip)) {
          return new Response(JSON.stringify({ ok: false, reason: "invalid" }), { status: 429, headers });
        }
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          body = null;
        }
        const lead = parseLead(body);
        if (!lead) {
          return new Response(JSON.stringify({ ok: false, reason: "invalid" }), { status: 400, headers });
        }
        const result = await sendLead(lead);
        const status = result.ok ? 200 : result.reason === "no-chat" ? 503 : 502;
        return new Response(JSON.stringify(result), { status, headers });
      },
    },
  },
});
