import React, { useState } from 'react';

type Props = {
  placeholder?: string;
  fetchUrl: string;
  onSelect: (item: any) => void;
};

export default function AutocompleteInput({ placeholder = 'Search...', fetchUrl, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (!q) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await fetch(${fetchUrl}?q=);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        value={query}
        onChange={onChange}
        placeholder={placeholder}
        className="border px-3 py-2 rounded w-full"
      />
      {loading && <div className="mt-2 text-sm text-gray-500">Loading...</div>}
      {!loading && items.length > 0 && (
        <ul className="mt-2 border rounded divide-y">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              {item.name ?? JSON.stringify(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
