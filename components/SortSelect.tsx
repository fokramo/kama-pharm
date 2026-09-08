"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", e.target.value);
    router.push(`/products?${next.toString()}`);
  }

  return (
    <select className="select" value={value} onChange={onChange} style={{ width: "auto" }}>
      <option value="new">החדש ביותר</option>
      <option value="price-asc">מחיר: מהנמוך לגבוה</option>
      <option value="price-desc">מחיר: מהגבוה לנמוך</option>
    </select>
  );
}
