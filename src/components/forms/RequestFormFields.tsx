"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, inputClasses } from "@/components/forms/Field";
import type { ClientType } from "@/components/forms/types";
import { reachGoal } from "@/lib/metrika";

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Общее тело формы заявки, переиспользуемое формой-диспетчером на главной
 * и формами на отдельных коммерческих страницах (/private, /business,
 * /serial). Набор полей зависит от category — согласно ТЗ, поля не
 * превращают форму в техническое задание, только необходимый минимум.
 * Отправляет данные на POST /api/leads; при ошибке введённые данные не
 * теряются (форма остаётся заполненной, показывается понятное сообщение).
 */
export function RequestFormFields({ clientType }: { clientType: ClientType }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    formData.set("category", clientType);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        body: formData,
      });
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
      <div className="mt-10 rounded-[var(--radius-md)] border border-[var(--color-border)] p-6 text-center sm:p-8">
        <p className="text-lg font-semibold text-[var(--color-text)]">Заявка получена.</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Мы ознакомимся с вашим обращением и свяжемся с вами в ближайшее время,
          чтобы обсудить задачу.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-10 rounded-[var(--radius-md)] border border-[var(--color-border)] p-6 sm:p-8"
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

      <div className="grid gap-5">
        <Field label="Имя" htmlFor="name">
          <input id="name" name="name" type="text" required className={inputClasses} />
        </Field>

        {(clientType === "BUSINESS" || clientType === "SERIAL") && (
          <Field label="Компания (необязательно)" htmlFor="company">
            <input id="company" name="company" type="text" className={inputClasses} />
          </Field>
        )}

        <Field label="Удобный способ связи" htmlFor="contact">
          <input
            id="contact"
            name="contact"
            type="text"
            required
            placeholder="Telegram, телефон или email"
            className={inputClasses}
          />
        </Field>

        <Field
          label="Кратко опишите задачу"
          htmlFor="description"
          hint={
            clientType === "BUSINESS"
              ? "Если проблема связана с оборудованием, можно кратко описать, что произошло."
              : undefined
          }
        >
          <textarea id="description" name="description" required rows={4} className={inputClasses} />
        </Field>

        {clientType === "SERIAL" && (
          <Field label="Примерный объём партии, если известен" htmlFor="batchSize">
            <input id="batchSize" name="batchSize" type="text" className={inputClasses} />
          </Field>
        )}

        <Field label="Файлы (необязательно)" htmlFor="files">
          <input
            id="files"
            name="files"
            type="file"
            multiple
            className="w-full text-sm text-[var(--color-text-2)] file:mr-4 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--color-bg-2)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-text)]"
          />
        </Field>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-2)]">
        Отправка заявки ни к чему вас не обязывает. Это просто способ рассказать
        нам о задаче — мы свяжемся с вами, чтобы обсудить детали.
      </p>

      {state === "error" && errorMessage && (
        <p className="mt-4 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage} Данные формы сохранены — попробуйте отправить ещё раз.
        </p>
      )}

      <div className="mt-5">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === "submitting"}>
          {state === "submitting"
            ? "Отправляем..."
            : clientType === "SERIAL"
              ? "Обсудить производство"
              : "Рассказать о задаче"}
        </Button>
      </div>
    </form>
  );
}
