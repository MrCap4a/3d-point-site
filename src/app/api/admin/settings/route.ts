import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { SITE_SETTING_KEYS } from "@/lib/site-settings";

/** GET /api/admin/settings — текущие значения известных ключей настроек. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const rows = await prisma.siteSetting.findMany();
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({ ok: true, values });
}

const bodySchema = z.record(z.string(), z.string().max(500));

/** PUT /api/admin/settings — обновить набор значений (только известные ключи). */
export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Некорректные данные." }, { status: 400 });
  }

  const entries = Object.entries(parsed.data).filter(([key]) =>
    (SITE_SETTING_KEYS as readonly string[]).includes(key)
  );

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  // Контакты выводятся в футере и мобильной панели на всех публичных
  // страницах, в т.ч. статических — сбрасываем кэш всего публичного layout.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
