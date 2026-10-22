import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { resolvePortfolioImagePath } from "@/lib/portfolio-uploads";

/** DELETE /api/admin/portfolio/:id/images/:imageId — удалить изображение. */
export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/portfolio/[id]/images/[imageId]">
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { imageId } = await ctx.params;
  const image = await prisma.portfolioImage.findUnique({ where: { id: imageId } });

  if (!image) {
    return NextResponse.json({ ok: false, message: "Изображение не найдено." }, { status: 404 });
  }

  await prisma.portfolioImage.delete({ where: { id: imageId } });
  // Если удалили фото «до» — снимаем отметку с кейса.
  await prisma.portfolioCase.updateMany({
    where: { beforeImageId: imageId },
    data: { beforeImageId: null },
  });
  await unlink(resolvePortfolioImagePath(image.filePath)).catch(() => {
    // Файл мог быть уже удалён вручную — не блокируем удаление записи из БД.
  });

  return NextResponse.json({ ok: true });
}
