import JSZip from "jszip";
import { TableData } from "./parser";
import { CodeTheme, generateTableCode } from "./generator";
import { getBodyThemeClass, toCamelCase } from "./helpers";

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
  <title>Generated with Nitrix</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="p-6 font-sans grid place-items-center ${getBodyThemeClass(theme)}">
<div className="flex flex-col items-center justify-center gap-y-4 ">
  <h1 class="text-2xl font-bold mb-4">Generated with Nitrix.</h1>`;

  const htmlFooter = `</div>
</body>
</html>`;

  const tableHtml = tables
    .map(
      (t) => `
  <section class="mb-8 w-full">
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

  const tableComponents: string[] = [];

  for (const table of tables) {
    const componentName = toCamelCase(table.name);
    zip.file(
      `src/components/${componentName}.tsx`,
      generateTableCode(table, "react", theme)
    );
    tableComponents.push(componentName);
  }

  const importTableCode = tableComponents
    .map((name: string) => {
      return `import { ${name} } from \"./components/${name}.tsx\";`;
    })
    .join("\n");

  const tableComponentCode = tableComponents
    .map((name: string) => {
      return `<section className="mb-8 w-full"><${name} /></ section>`;
    })
    .join(`\n`);

  // index.html
  zip.file(
    "index.html",
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated with Nitrix</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
  );

  // tsconfig.app.json
  zip.file(
    "tsconfig.app.json",
    JSON.stringify({
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
      },
      include: ["src"],
    })
  );

  // tsconfig.json
  zip.file(
    "tsconfig.json",
    JSON.stringify({
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" },
      ],
    })
  );

  // tsconfig.node.json
  zip.file(
    "tsconfig.node.json",
    JSON.stringify({
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        target: "ES2022",
        lib: ["ES2023"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
      },
      include: ["vite.config.ts"],
    })
  );

  // package.json
  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: "nitrix-react-app",
        version: "1.0.0",
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc -b && vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "@tailwindcss/vite": "^4.1.4",
        },
        devDependencies: {
          vite: "^6.0.0",
          tailwindcss: "^4.1.4",
          postcss: "^8.4.0",
          autoprefixer: "^10.4.0",
          "@vitejs/plugin-react": "^4.3.4",
          "@types/react": "^19.0.10",
          "@types/react-dom": "^19.0.4",
        },
      },
      null,
      2
    )
  );

  // vite.config.ts
  zip.file(
    "vite.config.ts",
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`
  );

  zip.file("vite-env.d.ts", `/// <reference types="vite/client" />`);

  // tailwind.config.js
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

  // src/index.css
  zip.file("src/index.css", `@import "tailwindcss";`);

  // src/main.tsx
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

  // src/App.tsx
  zip.file(
    "src/App.tsx",
    `${importTableCode}\n
export default function App() {
  return (
  <div className="w-full min-h-screen grid place-items-center p-6 ${getBodyThemeClass(
    theme
  )}">
    <main className="font-sans flex flex-col items-center justify-center gap-y-4">
      <h1 className=\"text-2xl font-bold mb-4\">Generated with Nitrix.</h1>
      ${tableComponentCode}
    </main>
    </div>
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
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Generated with Nitrix.</Text>
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
