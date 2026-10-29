import { randomUUID } from "node:crypto";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "./uploads";

/**
 * Сохраняет загруженный файл вне публичной раздачи Next.js (каталог не
 * входит в /public), под случайным именем — чтобы нельзя было угадать путь
 * или получить прямой доступ, минуя проверку прав в админке.
 */
export async function saveUploadedFile(
  file: File
): Promise<{ storedPath: string; originalName: string; mimeType: string; sizeBytes: number }> {
  const leadsDir = path.join(process.cwd(), UPLOADS_DIR, "leads");
  await mkdir(leadsDir, { recursive: true });

  const ext = path.extname(file.name).slice(0, 10);
  const safeName = `${randomUUID()}${ext}`;
  const fullPath = path.join(leadsDir, safeName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return {
    storedPath: path.join("leads", safeName),
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: buffer.byteLength,
  };
}

/**
 * Полный путь к файлу заявки по storedPath из БД. Проверяем, что путь не
 * выходит за пределы каталога uploads/leads (защита от «../» в записи).
 */
export function resolveLeadFilePath(storedPath: string): string | null {
  const leadsDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), UPLOADS_DIR, "leads");
  // storedPath мог быть записан на Windows с «\» — приводим к «/».
  const normalized = storedPath.split("\\").join("/");
  const fullPath = path.resolve(/* turbopackIgnore: true */ process.cwd(), UPLOADS_DIR, normalized);
  return fullPath.startsWith(leadsDir + path.sep) ? fullPath : null;
}
