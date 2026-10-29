import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { resolveLeadFilePath } from "@/lib/uploads";

/** Форматы, которые безопасно открывать прямо в браузере. Остальное — только скачивание. */
const INLINE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);

/**
 * GET /api/admin/leads/:id/files/:fileId — файл, приложенный к заявке.
 * Только для администратора. ?download=1 — скачать, иначе открыть в
 * браузере (если формат безопасен для показа).
 */
export async function GET(
  request: Request,
  ctx: RouteContext<"/api/admin/leads/[id]/files/[fileId]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id, fileId } = await ctx.params;
  const file = await prisma.leadFile.findFirst({ where: { id: fileId, leadId: id } });
  const fullPath = file ? resolveLeadFilePath(file.storedPath) : null;

  if (!file || !fullPath) {
    return NextResponse.json({ ok: false, message: "Файл не найден." }, { status: 404 });
  }

  try {
    const buffer = await readFile(fullPath);
    const wantsDownload = new URL(request.url).searchParams.has("download");
    const inline = !wantsDownload && INLINE_TYPES.has(file.mimeType);
    const asciiName = file.originalName.replace(/[^\w.\- ]+/g, "_");

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": inline ? file.mimeType : "application/octet-stream",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        // Открытое в браузере изображение не сможет выполнить скрипты. PDF без
        // sandbox: иначе встроенный просмотрщик Chrome его не показывает.
        ...(file.mimeType === "application/pdf"
          ? {}
          : { "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox" }),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Файл не найден на диске." }, { status: 404 });
  }
}
