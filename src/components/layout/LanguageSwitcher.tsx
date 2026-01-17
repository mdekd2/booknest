"use client";

import { locales } from "@/lib/i18n/messages";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <label className="flex items-center gap-2 text-xs text-[#6b5f54]">
      <span>{label}</span>
      <select
        value={locale}
        onChange={handleChange}
        className="rounded-full border border-[#e6dccf] bg-white/70 px-3 py-1 text-xs font-medium text-[#1f1a17]"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
