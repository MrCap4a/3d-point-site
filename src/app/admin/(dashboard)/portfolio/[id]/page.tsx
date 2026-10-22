import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortfolioCaseForm } from "@/components/admin/PortfolioCaseForm";
import { parseCategories } from "@/lib/portfolio";

export default async function EditPortfolioCasePage(
  props: PageProps<"/admin/portfolio/[id]">
) {
  const { id } = await props.params;
  const item = await prisma.portfolioCase.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Редактирование кейса</h1>
      <div className="mt-6 max-w-xl rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <PortfolioCaseForm
          caseId={item.id}
          initial={{
            title: item.title,
            description: item.description,
            price: item.price ?? "",
            material: item.material ?? "",
            leadTime: item.leadTime ?? "",
            categories: parseCategories(item.categories),
            beforeImageId: item.beforeImageId ?? "",
          }}
          initialImages={item.images.map((img) => ({ id: img.id, filePath: img.filePath }))}
        />
      </div>
    </div>
  );
}
