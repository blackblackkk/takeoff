import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type LeadInput = {
  name: string;
  whatsapp: string;
  telegram: string;
};

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "unconfigured" | "no-chat" | "telegram" };

const CHAT_FILE = join(process.cwd(), ".data", "telegram-chat-id");
const hits = new Map<string, number[]>();

function token() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function parseLead(body: unknown): LeadInput | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (clean(record.company, 80)) return null;
  const name = clean(record.name, 80);
  const whatsapp = clean(record.whatsapp, 40);
  const telegram = clean(record.telegram, 40);
  if (name.length < 2 || (!whatsapp && !telegram)) return null;
  return { name, whatsapp, telegram };
}

export function allowLead(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 5) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

async function readChatId() {
  const fromEnv = process.env.TELEGRAM_CHAT_ID?.trim();
  if (fromEnv) return fromEnv;
  try {
    return (await readFile(CHAT_FILE, "utf8")).trim();
  } catch {
    return "";
  }
}

async function rememberChatId(chatId: string) {
  await mkdir(join(process.cwd(), ".data"), { recursive: true });
  await writeFile(CHAT_FILE, chatId, "utf8");
}

async function telegram(method: string, body?: Record<string, string>) {
  const response = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return (await response.json()) as {
    ok: boolean;
    result?: Array<{ message?: { chat?: { id?: number; type?: string } } }>;
  };
}

async function resolveChatId() {
  const saved = await readChatId();
  if (saved) return saved;
  const updates = await telegram("getUpdates");
  const chat = updates.result
    ?.map((item) => item.message?.chat)
    .reverse()
    .find((item) => item?.id && item.type === "private");
  if (!chat?.id) return "";
  const chatId = String(chat.id);
  await rememberChatId(chatId);
  return chatId;
}

export async function sendLead(input: LeadInput): Promise<LeadResult> {
  if (!token()) return { ok: false, reason: "unconfigured" };
  const chatId = await resolveChatId();
  if (!chatId) return { ok: false, reason: "no-chat" };

  const lines = ["Новая заявка TAKE OFF", `Имя: ${input.name}`];
  if (input.whatsapp) lines.push(`WhatsApp: ${input.whatsapp}`);
  if (input.telegram) lines.push(`Telegram: ${input.telegram}`);

  const sent = await telegram("sendMessage", { chat_id: chatId, text: lines.join("\n") });
  return sent.ok ? { ok: true } : { ok: false, reason: "telegram" };
}
