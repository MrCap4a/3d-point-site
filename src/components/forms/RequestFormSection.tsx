import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RequestForm } from "@/components/forms/RequestForm";
import type { ClientType } from "@/components/forms/types";
import { getSiteContacts } from "@/lib/contacts";
import { REQUEST_FORM_ID } from "@/lib/request-form";
import { RESPONSE_HOURS } from "@/content/site";

type RequestFormSectionProps = {
  title?: string;
  description?: string;
  defaultClientType?: ClientType;
  /** Название страницы услуги для скрытого поля source. */
  source?: string;
};

/**
 * Секция с формой заявки (#request-form) — одна и та же на всех страницах,
 * отличаются только заголовок, предвыбранный тип клиента и source.
 */
export async function RequestFormSection({
  title = "Расскажите, что нужно сделать",
  description = "Достаточно пары предложений и контакта — мы сами свяжемся, чтобы обсудить детали.",
  defaultClientType = "PRIVATE",
  source,
}: RequestFormSectionProps) {
  const contacts = await getSiteContacts();

  return (
    <section id={REQUEST_FORM_ID} className="scroll-mt-20 bg-[var(--color-bg-2)] py-14 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeading align="center" label="Заявка" title={title} description={description} />
          <div className="mt-8 sm:mt-10">
            <RequestForm
              defaultClientType={defaultClientType}
              source={source}
              responseHours={RESPONSE_HOURS}
              telegramHref={contacts.telegram?.href ?? null}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
