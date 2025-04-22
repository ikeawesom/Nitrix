import JSZip from "jszip";
import { TableData } from "./parser";
import { CodeTheme, generateTableCode } from "./generator";

export async function generateHtmlProjectZip(
  theme: CodeTheme,
  tables: TableData[]
) {
  const zip = new JSZip();

  const htmlHeader = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nitrix Generated Table</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="p-6 font-sans">
  <h1 class="text-2xl font-bold mb-4">Generated Table Views</h1>`;

  const htmlFooter = `
</body>
</html>`;

  const tableHtml = tables
    .map(
      (t) => `
  <section class="mb-8">
    <h2 class="text-xl font-semibold mb-2">${t.name}</h2>
    ${generateTableCode(t, "html", theme)}
  </section>
  `
    )
    .join("\n");

  const fullHtml = `${htmlHeader}\n${tableHtml}\n${htmlFooter}`;

  zip.file("index.html", fullHtml);

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}

export async function generateReactProjectZip(
  theme: CodeTheme,
  tables: TableData[]
) {
  const zip = new JSZip();
  const appCode = tables
    .map(
      (t) => `
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">${t.name}</h2>
      ${generateTableCode(t, "react", theme)}
    </section>`
    )
    .join("\n");

  zip.file("index.html", "Generated React App");

  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: "nitrix-react-app",
        version: "1.0.0",
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
        devDependencies: {
          vite: "^6.0.0",
          tailwindcss: "^4.1.4",
          postcss: "^8.4.0",
          autoprefixer: "^10.4.0",
        },
      },
      null,
      2
    )
  );

  zip.file(
    "vite.config.ts",
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`
  );

  zip.file(
    "postcss.config.js",
    `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`
  );

  zip.file(
    "tailwind.config.js",
    `module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};`
  );

  zip.file(
    "src/index.css",
    `@tailwind base;
@tailwind components;
@tailwind utilities;`
  );

  zip.file(
    "src/main.tsx",
    `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`
  );

  zip.file(
    "src/App.tsx",
    `export default function App() {
  return (
    <main className=\"p-6 font-sans\">
      <h1 className=\"text-2xl font-bold mb-4\">Generated Table Views</h1>
      ${appCode}
    </main>
  );
}`
  );

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}

export async function generateReactNativeProjectZip(
  theme: CodeTheme,
  tables: TableData[]
) {
  const zip = new JSZip();

  const appCode = tables
    .map(
      (t) => `
    <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 16 }}>${
      t.name
    }</Text>
    ${generateTableCode(t, "react-native", theme)}
  `
    )
    .join("\n");

  zip.file(
    "App.tsx",
    `import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function App() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Generated Table Views</Text>
      ${appCode}
    </ScrollView>
  );
}`
  );

  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: "nitrix-rn-app",
        version: "1.0.0",
        main: "App.tsx",
        dependencies: {
          react: "^19.0.0",
          "react-native": "latest",
          expo: "^50.0.0",
        },
        devDependencies: {},
        private: true,
      },
      null,
      2
    )
  );

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}
