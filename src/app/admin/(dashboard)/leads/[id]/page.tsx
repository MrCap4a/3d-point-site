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
            <ul className="text-sm text-[var(--color-text-2)]">
              {lead.files.map((file) => (
                <li key={file.id}>{file.originalName}</li>
              ))}
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
