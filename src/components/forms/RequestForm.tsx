"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, inputClasses } from "@/components/forms/Field";
import { FileDropzone } from "@/components/forms/FileDropzone";
import type { PickedFile } from "@/components/forms/FileDropzone";
import type { ClientType } from "@/components/forms/types";
import { reachGoal } from "@/lib/metrika";
import { PREFILL_EVENT } from "@/lib/request-form";
import type { PrefillDetail } from "@/lib/request-form";

type SubmitState = "idle" | "submitting" | "success" | "error";

const CLIENT_TYPES: { value: ClientType; label: string }[] = [
  { value: "PRIVATE", label: "Частное лицо" },
  { value: "BUSINESS", label: "Бизнес" },
];

type RequestFormProps = {
  defaultClientType?: ClientType;
  /** Название страницы услуги — уходит скрытым полем source. */
  source?: string;
  responseHours: number | null;
  telegramHref: string | null;
};

/**
 * Единая форма заявки для всех страниц. Видна сразу: тип клиента
 * переключается внутри формы. Отправляет данные на POST /api/leads; при
 * ошибке введённые данные и файлы не теряются. Без отметки согласия на
 * обработку персональных данных отправка блокируется.
 */
export function RequestForm({
  defaultClientType = "PRIVATE",
  source,
  responseHours,
  telegramHref,
}: RequestFormProps) {
  const [clientType, setClientType] = useState<ClientType>(defaultClientType);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  // «Нужно похожее» из модалки портфолио подставляет текст в описание.
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const { text } = (event as CustomEvent<PrefillDetail>).detail;
      setDescription((current) => (current.startsWith(text) ? current : `${text}${current}`));
      setState((current) => (current === "success" ? current : "idle"));
      // Фокус после плавной прокрутки к форме, без повторного скролла.
      window.setTimeout(() => descriptionRef.current?.focus({ preventScroll: true }), 500);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!consent) {
      setConsentError(true);
      consentRef.current?.focus();
      return;
    }

    setState("submitting");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    formData.set("category", clientType);
    formData.delete("files");
    files.forEach((item) => formData.append("files", item.file));

    try {
      const response = await fetch("/api/leads", { method: "POST", body: formData });
      const data = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setState("error");
        setErrorMessage(data.message ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
        return;
      }

      setState("success");
      reachGoal("form_submit");
    } catch {
      setState("error");
      setErrorMessage("Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center sm:p-8"
      >
        <p className="text-lg font-semibold text-[var(--color-text)]">Спасибо! Заявка получена.</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Свяжемся с вами {responseHours !== null ? `в течение ${responseHours} ч` : "в ближайшее время"}.
        </p>
        {telegramHref && (
          <p className="mt-4 text-sm text-[var(--color-text-2)]">
            Если хочется быстрее —{" "}
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--color-accent-text)] underline underline-offset-2"
            >
              напишите нам в Telegram
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  const submitting = state === "submitting";

  return (
    <form
      className="relative rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-8"
      onSubmit={handleSubmit}
    >
      {/* Honeypot: скрыто от людей через CSS, но видно ботам, заполняющим все поля подряд. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      {source && <input type="hidden" name="source" value={source} />}

      <fieldset>
        <legend className="sr-only">Кто обращается</legend>
        <div className="grid grid-cols-2 gap-1 rounded-[var(--radius-sm)] bg-[var(--color-bg-2)] p-1">
          {CLIENT_TYPES.map((type) => (
            <label
              key={type.value}
              className={`cursor-pointer rounded-[calc(var(--radius-sm)-2px)] px-3 py-2.5 text-center text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--color-accent)] ${
                clientType === type.value
                  ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm"
                  : "text-[var(--color-text-2)] hover:text-[var(--color-text)]"
              }`}
            >
              <input
                type="radio"
                name="clientType"
                value={type.value}
                checked={clientType === type.value}
                onChange={() => setClientType(type.value)}
                className="sr-only"
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-5">
        <Field label="Имя" htmlFor="name" required>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClasses} />
        </Field>

        {clientType === "BUSINESS" && (
          <Field label="Компания" htmlFor="company" optional>
            <input id="company" name="company" type="text" autoComplete="organization" className={inputClasses} />
          </Field>
        )}

        <Field label="Как с вами связаться" htmlFor="contact" required hint="Телефон, Telegram или email">
          <input id="contact" name="contact" type="text" required aria-describedby="contact-hint" className={inputClasses} />
        </Field>

        <Field
          label="Что случилось"
          htmlFor="description"
          required
          hint="Например: сломалось крепление полки, нужна такая же деталь"
        >
          <textarea
            ref={descriptionRef}
            id="description"
            name="description"
            required
            aria-describedby="description-hint"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClasses}
          />
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
            Фото или файлы <span className="font-normal text-[var(--color-text-2)]">(необязательно)</span>
          </p>
          <FileDropzone files={files} onChange={setFiles} />
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text-2)]">
            <input
              ref={consentRef}
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                if (event.target.checked) setConsentError(false);
              }}
              aria-invalid={consentError}
              aria-describedby={consentError ? "consent-error" : undefined}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-accent)]"
            />
            <span>
              Я даю{" "}
              <Link href="/consent" target="_blank" className="font-medium text-[var(--color-text)] underline underline-offset-2">
                согласие на обработку персональных данных
              </Link>{" "}
              и ознакомлен(а) с{" "}
              <Link href="/privacy" target="_blank" className="font-medium text-[var(--color-text)] underline underline-offset-2">
                политикой
              </Link>
            </span>
          </label>
          {consentError && (
            <p id="consent-error" role="alert" className="mt-2 text-sm text-red-700">
              Чтобы отправить заявку, отметьте согласие на обработку персональных данных.
            </p>
          )}
        </div>
      </div>

      {state === "error" && errorMessage && (
        <p role="alert" className="mt-5 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage} Данные формы сохранены — попробуйте отправить ещё раз.
        </p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting} aria-busy={submitting}>
          {submitting && (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden="true"
            />
          )}
          {submitting ? "Отправляем…" : "Отправить заявку"}
        </Button>
        <p className="mt-3 text-sm text-[var(--color-text-2)]">
          {responseHours !== null && `Отвечаем в течение ${responseHours} ч. `}
          Заявка ни к чему не обязывает.
        </p>
      </div>
    </form>
  );
}
