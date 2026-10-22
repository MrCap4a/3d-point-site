import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { portfolioCaseSchema } from "@/lib/validation/portfolio";
import { savePortfolioImage } from "@/lib/portfolio-uploads";
import { serializeCategories } from "@/lib/portfolio";

/** GET /api/admin/portfolio — все кейсы, включая скрытые, по порядку. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const cases = await prisma.portfolioCase.findMany({
    orderBy: { sortOrder: "asc" },
    include: { images: true },
  });
  return NextResponse.json({ ok: true, cases });
}

/**
 * POST /api/admin/portfolio — создать новый кейс (по умолчанию скрыт).
 * Принимает multipart/form-data с обязательным полем "files" (минимум одно
 * фото) — загрузка фото происходит сразу при создании кейса, а не отдельным
 * шагом после сохранения.
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();

  const parsed = portfolioCaseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price") ?? "",
    material: formData.get("material") ?? "",
    leadTime: formData.get("leadTime") ?? "",
    categories: formData.getAll("categories").map(String),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Проверьте поля." },
      { status: 400 }
    );
  }

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Добавьте хотя бы одно фото." },
      { status: 400 }
    );
  }

  try {
    const saved = await Promise.all(files.map((file) => savePortfolioImage(file)));

    const maxOrder = await prisma.portfolioCase.aggregate({ _max: { sortOrder: true } });

    const created = await prisma.portfolioCase.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price || null,
        material: parsed.data.material || null,
        leadTime: parsed.data.leadTime || null,
        categories: serializeCategories(parsed.data.categories),
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        images: {
          create: saved.map((s, index) => ({ filePath: s.filePath, sortOrder: index })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ ok: true, case: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось создать кейс.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
