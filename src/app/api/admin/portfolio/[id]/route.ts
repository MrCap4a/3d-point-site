import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { portfolioCaseSchema } from "@/lib/validation/portfolio";
import { serializeCategories } from "@/lib/portfolio";

/** GET /api/admin/portfolio/:id — кейс для редактирования. */
export async function GET(_request: Request, ctx: RouteContext<"/api/admin/portfolio/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const item = await prisma.portfolioCase.findUnique({ where: { id }, include: { images: true } });

  if (!item) {
    return NextResponse.json({ ok: false, message: "Кейс не найден." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, case: item });
}

/** PUT /api/admin/portfolio/:id — обновить поля кейса. */
export async function PUT(request: Request, ctx: RouteContext<"/api/admin/portfolio/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = portfolioCaseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Проверьте поля." },
      { status: 400 }
    );
  }

  // Фото «до» должно быть одним из изображений этого же кейса.
  const beforeImageId = parsed.data.beforeImageId || null;
  if (beforeImageId) {
    const image = await prisma.portfolioImage.findFirst({ where: { id: beforeImageId, caseId: id } });
    if (!image) {
      return NextResponse.json({ ok: false, message: "Фото «до» не найдено среди фото кейса." }, { status: 400 });
    }
  }

  try {
    const updated = await prisma.portfolioCase.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price || null,
        material: parsed.data.material || null,
        leadTime: parsed.data.leadTime || null,
        categories: serializeCategories(parsed.data.categories),
        beforeImageId,
      },
    });
    return NextResponse.json({ ok: true, case: updated });
  } catch {
    return NextResponse.json({ ok: false, message: "Кейс не найден." }, { status: 404 });
  }
}

/** DELETE /api/admin/portfolio/:id — удалить кейс. */
export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/portfolio/[id]">) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  try {
    await prisma.portfolioCase.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Кейс не найден." }, { status: 404 });
  }
}
