"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PORTFOLIO_CATEGORIES, PORTFOLIO_CATEGORY_LABELS } from "@/lib/portfolio";
import type { PortfolioCategory } from "@/lib/portfolio";

type ImageItem = { id: string; filePath: string };

type FormValues = {
  title: string;
  description: string;
  price: string;
  material: string;
  leadTime: string;
  categories: PortfolioCategory[];
  beforeImageId: string;
};

type Props = {
  caseId?: string;
  initial?: FormValues;
  initialImages?: ImageItem[];
};

const EMPTY_FORM: FormValues = {
  title: "",
  description: "",
  price: "",
  material: "",
  leadTime: "",
  categories: [],
  beforeImageId: "",
};

const inputClasses =
  "w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]";

export function PortfolioCaseForm({ caseId, initial, initialImages = [] }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>(initial ?? EMPTY_FORM);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [images, setImages] = useState(initialImages);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreating = !caseId;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isCreating && newFiles.length === 0) {
      setError("Добавьте хотя бы одно фото.");
      return;
    }

    setSaving(true);
    setError(null);

    let response: Response;

    if (isCreating) {
      const formData = new FormData();
      formData.set("title", form.title);
      formData.set("description", form.description);
      formData.set("price", form.price);
      formData.set("material", form.material);
      formData.set("leadTime", form.leadTime);
      form.categories.forEach((category) => formData.append("categories", category));
      newFiles.forEach((file) => formData.append("files", file));

      response = await fetch("/api/admin/portfolio", { method: "POST", body: formData });
    } else {
      response = await fetch(`/api/admin/portfolio/${caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    const data = (await response.json()) as { ok: boolean; message?: string; case?: { id: string } };

    if (!data.ok) {
      setError(data.message ?? "Не удалось сохранить кейс.");
      setSaving(false);
      return;
    }

    setSaving(false);
    if (isCreating && data.case) {
      router.push(`/admin/portfolio/${data.case.id}`);
    } else {
      router.refresh();
    }
  }

  async function handleUploadImage(file: File) {
    if (!caseId) return;
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch(`/api/admin/portfolio/${caseId}/images`, {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as { ok: boolean; image?: ImageItem; message?: string };
    if (data.ok && data.image) {
      setImages((prev) => [...prev, data.image!]);
    } else {
      setError(data.message ?? "Не удалось загрузить изображение.");
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!caseId) return;
    await fetch(`/api/admin/portfolio/${caseId}/images/${imageId}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    if (form.beforeImageId === imageId) setForm((prev) => ({ ...prev, beforeImageId: "" }));
  }

  function toggleCategory(category: PortfolioCategory) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category],
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Название</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClasses}
        />
      </div>

      {isCreating && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Фото (обязательно)
          </label>
          <input
            type="file"
            multiple
            required
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-sm text-[var(--color-text-2)] file:mr-4 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--color-bg-2)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-text)]"
            onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))}
          />
          {newFiles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {newFiles.map((file, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-20 w-20 rounded-[var(--radius-sm)] object-cover"
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Описание</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Цена (необязательно)
        </label>
        <input
          type="text"
          placeholder="например, 2500 ₽ или от 1500 ₽"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Материал (необязательно)
          </label>
          <input
            type="text"
            placeholder="например, PETG"
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Срок (необязательно)
          </label>
          <input
            type="text"
            placeholder="например, 2 дня"
            value={form.leadTime}
            onChange={(e) => setForm({ ...form, leadTime: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Категории</legend>
        <p className="mb-2 text-xs text-[var(--color-text-2)]">
          Определяют, на каких страницах сайта показывается работа (например, «Частные» — на /private).
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {PORTFOLIO_CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={form.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              {PORTFOLIO_CATEGORY_LABELS[category]}
            </label>
          ))}
        </div>
      </fieldset>

      {!isCreating && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Изображения
          </label>
          <p className="mb-2 text-xs text-[var(--color-text-2)]">
            Первое фото — обложка. Отметьте «Фото до», чтобы в карточке показывались «до» и «после».
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/portfolio/images/${img.id}`}
                  alt=""
                  className="h-20 w-20 rounded-[var(--radius-sm)] object-cover"
                />
                <label className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-2)]">
                  <input
                    type="checkbox"
                    checked={form.beforeImageId === img.id}
                    onChange={(e) => setForm({ ...form, beforeImageId: e.target.checked ? img.id : "" })}
                    className="h-3.5 w-3.5 accent-[var(--color-accent)]"
                  />
                  Фото до
                </label>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                  aria-label="Удалить изображение"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-3 text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadImage(file);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
        >
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}


