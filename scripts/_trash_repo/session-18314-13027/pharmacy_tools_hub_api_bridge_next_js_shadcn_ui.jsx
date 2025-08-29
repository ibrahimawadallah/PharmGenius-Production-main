# Bash Script to Create Pharmacy Tools Folder Structure with Full Example Content

```bash
#!/bin/bash

# Define base folder
BASE_FOLDER="$PWD/pharmacy-tools"

# Create folder structure
mkdir -p "$BASE_FOLDER/pages/api"
mkdir -p "$BASE_FOLDER/utils"

# Create files with content
cat > "$BASE_FOLDER/pages/index.tsx" <<EOL
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
EOL

cat > "$BASE_FOLDER/pages/api/icd-to-drug.ts" <<EOL
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q || '').toString().trim();
  res.status(200).json([{ name: \`Demo Drug for \${q}\`, icd: ['E11'] }]);
}
EOL

cat > "$BASE_FOLDER/pages/api/drug-to-icd.ts" <<EOL
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q || '').toString().trim();
  res.status(200).json([{ name: \`Demo Drug \${q}\`, icd: ['E11'] }]);
}
EOL

cat > "$BASE_FOLDER/utils/umls-client.ts" <<EOL
export async function getRxNormToICD(rxcui: string): Promise<string[]> {
  return ['E11']; // Placeholder, replace with real UMLS API integration
}
EOL

cat > "$BASE_FOLDER/package.json" <<EOL
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
EOL

cat > "$BASE_FOLDER/tsconfig.json" <<EOL
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
EOL

cat > "$BASE_FOLDER/.env" <<EOL
UMLS_API_KEY=your_umls_key_here
EOL

echo "Full folder structure with example content created at: $BASE_FOLDER"
echo "You can now run npm install & npm run dev in the folder"
```

Windows (PowerShell) — Recommended

Run the following command from the project root to create the pharmacy-tools Next.js scaffold:

powershell -ExecutionPolicy Bypass -File .\scripts\pharmacy-tools-init.ps1

Then:

cd .\pharmacy-tools
npm install
npm run dev

WSL/Git Bash — Alternative (Original Bash Script)
