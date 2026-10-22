type IconProps = { className?: string };

/** Иконки интерфейса. Декоративные — подпись даёт текст или aria-label рядом. */

export function PhoneIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5L16 14l4 1.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TelegramIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.4 4.3 18.3 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.2.2-.5.4-.9.4l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.6 12.9l-4.6-1.4c-1-.3-1-1 .2-1.5l18-6.9c.8-.3 1.6.2 1.2 1.2Z" />
    </svg>
  );
}

export function CameraIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 8a2 2 0 0 1 2-2h1.5l1.2-1.8A1 1 0 0 1 9.5 4h5a1 1 0 0 1 .8.4L16.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FileIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

/** Значок мессенджера MAX — нейтральное облачко сообщения, не логотип. */
export function MaxIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5c-4.7 0-8.5 3.4-8.5 7.6 0 2.3 1.1 4.3 2.9 5.7l-.6 3.7 3.6-2a9.6 9.6 0 0 0 2.6.3c4.7 0 8.5-3.4 8.5-7.7S16.7 3.5 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
