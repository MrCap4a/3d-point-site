"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { CameraIcon, FileIcon } from "@/components/ui/icons";
import {
  FILE_INPUT_ACCEPT,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_FILES_PER_LEAD,
  isAllowedLeadFile,
} from "@/lib/validation/lead";

export type PickedFile = { id: string; file: File; previewUrl: string | null };

type FileDropzoneProps = {
  files: PickedFile[];
  onChange: (files: PickedFile[]) => void;
};

/**
 * Зона загрузки фото вместо нативной кнопки «Choose Files». Без атрибута
 * capture — на телефоне остаётся выбор между камерой и галереей. На
 * десктопе работает drag-and-drop. Лимиты те же, что проверяет сервер.
 */
export function FileDropzone({ files, onChange }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Освобождаем object URL превью, когда файл убран или форма размонтирована.
  const latestFiles = useRef(files);
  useEffect(() => {
    latestFiles.current = files;
  }, [files]);
  useEffect(
    () => () => latestFiles.current.forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl)),
    []
  );

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    const problems: string[] = [];
    const accepted: PickedFile[] = [];

    for (const file of incoming) {
      if (files.length + accepted.length >= MAX_FILES_PER_LEAD) {
        problems.push(`Можно приложить не более ${MAX_FILES_PER_LEAD} файлов.`);
        break;
      }
      if (!isAllowedLeadFile(file)) {
        problems.push(`«${file.name}»: формат не подходит.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        problems.push(`«${file.name}»: больше ${MAX_FILE_SIZE_MB} МБ.`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      });
    }

    setError(problems.length > 0 ? problems.join(" ") : null);
    if (accepted.length > 0) onChange([...files, ...accepted]);
  }

  function removeFile(id: string) {
    const item = files.find((f) => f.id === id);
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
    onChange(files.filter((f) => f.id !== id));
    setError(null);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <div>
      <label
        htmlFor="files"
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-6 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-accent)] ${
          dragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-2)] hover:border-[var(--color-accent)]"
        }`}
      >
        <CameraIcon className="h-8 w-8 text-[var(--color-accent)]" />
        <span className="text-sm font-medium text-[var(--color-text)]">
          Прикрепите фото детали — так мы оценим быстрее
        </span>
        <span className="text-xs text-[var(--color-text-2)]">
          <span className="hidden sm:inline">Перетащите файлы сюда или нажмите, чтобы выбрать. </span>
          До {MAX_FILES_PER_LEAD} файлов, до {MAX_FILE_SIZE_MB} МБ каждый: фото, PDF, STL, STEP, OBJ.
        </span>
        <input
          id="files"
          type="file"
          multiple
          accept={FILE_INPUT_ACCEPT}
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3" aria-label="Прикреплённые файлы">
          {files.map((item) => (
            <li key={item.id} className="relative">
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt={`Превью: ${item.file.name}`}
                  className="h-20 w-20 rounded-[var(--radius-sm)] border border-[var(--color-border)] object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-1">
                  <FileIcon className="h-6 w-6 text-[var(--color-text-2)]" />
                  <span className="w-full truncate text-center text-[10px] text-[var(--color-text-2)]">
                    {item.file.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(item.id)}
                aria-label={`Удалить файл ${item.file.name}`}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-text)] text-xs text-white hover:bg-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
