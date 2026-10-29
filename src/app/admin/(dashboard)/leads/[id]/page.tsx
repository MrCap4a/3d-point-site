import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";

const CATEGORY_LABELS: Record<string, string> = {
  PRIVATE: "Частный клиент",
  BUSINESS: "Бизнес",
  SERIAL: "Серийное производство",
};

export default async function AdminLeadDetailsPage(
  props: PageProps<"/admin/leads/[id]">
) {
  const { id } = await props.params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { files: true } });

  if (!lead) {
    notFound();
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-text-3)]">
        {CATEGORY_LABELS[lead.category] ?? lead.category}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-[var(--color-text)]">{lead.name}</h1>
      <p className="mt-1 text-sm text-[var(--color-text-2)]">
        {lead.createdAt.toLocaleString("ru-RU")}
      </p>

      <div className="mt-6 grid gap-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <Field label="Контакт" value={`${lead.contactValue} (${lead.contactMethod})`} />
        {lead.company && <Field label="Компания" value={lead.company} />}
        <Field label="Описание задачи" value={lead.description} />
        {lead.batchSize && <Field label="Примерный объём партии" value={lead.batchSize} />}
        {lead.sourcePage && <Field label="Страница обращения" value={lead.sourcePage} />}
        <Field
          label="Согласие на обработку ПДн"
          value={lead.consentAt ? `Дано ${lead.consentAt.toLocaleString("ru-RU")}` : "Не зафиксировано (заявка до появления чекбокса)"}
        />

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-text-3)]">
            Файлы
          </p>
          {lead.files.length === 0 ? (
            <p className="text-sm text-[var(--color-text-2)]">Файлы не прикреплены.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {lead.files.map((file) => {
                const url = `/api/admin/leads/${lead.id}/files/${file.id}`;
                // Превью — только для форматов, которые браузер показывает сам (HEIC, STL и т.п. — без превью).
                const previewable = PREVIEW_TYPES.has(file.mimeType);
                return (
                  <li
                    key={file.id}
                    className="flex gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2"
                  >
                    {previewable ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Файл заявки: ${file.originalName}`}
                          loading="lazy"
                          className="h-20 w-20 rounded-[var(--radius-sm)] bg-[var(--color-bg-2)] object-cover"
                        />
                      </a>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-2)] text-xs font-medium uppercase text-[var(--color-text-2)]">
                        {file.originalName.split(".").pop()?.slice(0, 5) || "файл"}
                      </div>
                    )}
                    <div className="min-w-0 text-sm">
                      <p className="truncate font-medium text-[var(--color-text)]" title={file.originalName}>
                        {file.originalName}
                      </p>
                      <p className="text-xs text-[var(--color-text-2)]">{formatSize(file.sizeBytes)}</p>
                      <div className="mt-1.5 flex gap-3">
                        {(previewable || file.mimeType === "application/pdf") && (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-text)] hover:underline">
                            Открыть
                          </a>
                        )}
                        <a href={`${url}?download=1`} className="text-[var(--color-accent-text)] hover:underline">
                          Скачать
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-text-3)]">
            Статус
          </p>
          <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
        </div>
      </div>
    </div>
  );
}

const PREVIEW_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} МБ`;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-text-3)]">
        {label}
      </p>
      <p className="whitespace-pre-wrap text-sm text-[var(--color-text)]">{value}</p>
    </div>
  );
}
