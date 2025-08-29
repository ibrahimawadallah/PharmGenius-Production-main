# Creates a Next.js "pharmacy-tools" scaffold with example APIs and a basic Autocomplete component

$BASE_FOLDER = Join-Path (Get-Location) "pharmacy-tools"

# Create folder structure
New-Item -ItemType Directory -Path (Join-Path $BASE_FOLDER "pages\api") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $BASE_FOLDER "utils") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $BASE_FOLDER "components") -Force | Out-Null

# pages/index.tsx
@"
import React from 'react';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Home() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Pharmacy Tools Hub</h1>
      <AutocompleteInput placeholder='Search ICD or Drug...' fetchUrl='/api/icd-to-drug' onSelect={item => console.log(item)} />
    </div>
  );
}
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER "pages\index.tsx")

# components/AutocompleteInput.tsx
@"
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
      const res = await fetch(`${fetchUrl}?q=${encodeURIComponent(q)}`);
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
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER "components\AutocompleteInput.tsx")

# pages/api/icd-to-drug.ts
@"
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q || '').toString().trim();
  res.status(200).json([{ name: `Demo Drug for ${q}`, icd: ['E11'] }]);
}
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER "pages\api\icd-to-drug.ts")

# pages/api/drug-to-icd.ts
@"
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q || '').toString().trim();
  res.status(200).json([{ name: `Demo Drug ${q}`, icd: ['E11'] }]);
}
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER "pages\api\drug-to-icd.ts")

# utils/umls-client.ts
@"
export async function getRxNormToICD(rxcui: string): Promise<string[]> {
  return ['E11']; // Placeholder, replace with real UMLS API integration
}
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER "utils\umls-client.ts")

# package.json
@"
{
  "name": "pharmacy-tools",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER "package.json")

# tsconfig.json
@"
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER "tsconfig.json")

# .env
@"
UMLS_API_KEY=your_umls_key_here
"@ | Set-Content -Encoding UTF8 (Join-Path $BASE_FOLDER ".env")

Write-Host "Full folder structure with example content created at: $BASE_FOLDER"
Write-Host "Next steps: cd pharmacy-tools; npm install; npm run dev"