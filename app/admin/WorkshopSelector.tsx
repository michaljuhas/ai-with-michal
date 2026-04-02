"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Workshop = {
  slug: string;
  label: string;
};

type Props = {
  workshops: Workshop[];
  selectedSlug: string;
};

export default function WorkshopSelector({ workshops, selectedSlug }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("workshop", e.target.value);
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <select
      value={selectedSlug}
      onChange={handleChange}
      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {workshops.map((w) => (
        <option key={w.slug} value={w.slug}>
          {w.label}
        </option>
      ))}
    </select>
  );
}
