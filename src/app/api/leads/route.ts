import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  leadFormSchema,
  ALLOWED_FILE_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_LEAD,
} from "@/lib/validation/lead";
import { saveUploadedFile } from "@/lib/uploads";
import { isRateLimited } from "@/lib/rate-limit";
import { notifyNewLead } from "@/lib/telegram";

/**
 * POST /api/leads — приём заявки с любой из форм сайта (диспетчер на
 * главной или контекстные формы на /private, /business, /serial).
 * Заявка сохраняется в БД независимо от дальнейшей Telegram-интеграции
 * (она подключается отдельным этапом и не блокирует сохранение).
 * Пользователю никогда не показываются технические детали ошибок сервера.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, message: "Слишком много попыток. Попробуйте немного позже." },
        { status: 429 }
      );
    }

    const formData = await request.formData();

    const parsed = leadFormSchema.safeParse({
      category: formData.get("category"),
      name: formData.get("name"),
      contactValue: formData.get("contact"),
      description: formData.get("description"),
      company: formData.get("company") ?? "",
      batchSize: formData.get("batchSize") ?? "",
      website: formData.get("website") ?? "",
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, message: firstIssue?.message ?? "Проверьте заполненные поля." },
        { status: 400 }
      );
    }

    // Honeypot сработал — тихо принимаем запрос как "успешный", не давая
    // ботам понять, что их отфильтровали, но не сохраняем в БД.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length > MAX_FILES_PER_LEAD) {
      return NextResponse.json(
        { ok: false, message: `Можно приложить не более ${MAX_FILES_PER_LEAD} файлов.` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { ok: false, message: "Один из файлов слишком большой (максимум 15 МБ)." },
          { status: 400 }
        );
      }
      if (file.type && !ALLOWED_FILE_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { ok: false, message: "Один из файлов имеет неподдерживаемый формат." },
          { status: 400 }
        );
      }
    }

    const contactMethod = guessContactMethod(parsed.data.contactValue);

    const lead = await prisma.lead.create({
      data: {
        category: parsed.data.category,
        name: parsed.data.name,
        contactMethod,
        contactValue: parsed.data.contactValue,
        company: parsed.data.company || null,
        description: parsed.data.description,
        batchSize: parsed.data.batchSize || null,
        sourcePage: request.headers.get("referer") ?? undefined,
      },
    });

    for (const file of files) {
      const saved = await saveUploadedFile(file);
      await prisma.leadFile.create({
        data: {
          leadId: lead.id,
          originalName: saved.originalName,
          storedPath: saved.storedPath,
          mimeType: saved.mimeType,
          sizeBytes: saved.sizeBytes,
        },
      });
    }

    // Оповещение администратора в Telegram. Намеренно после сохранения в БД и
    // без проброса ошибок: заявка уже записана, а доступность Telegram на
    // результат для пользователя влиять не должна (см. архитектуру).
    await notifyNewLead(lead, files.length);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save lead", error);
    return NextResponse.json(
      { ok: false, message: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}

function guessContactMethod(value: string): "telegram" | "phone" | "email" | "other" {
  if (value.includes("@") && value.includes(".") && !value.startsWith("@")) return "email";
  if (value.startsWith("@") || value.toLowerCase().includes("t.me")) return "telegram";
  if (/^[+\d][\d\s()-]{5,}$/.test(value.trim())) return "phone";
  return "other";
}
