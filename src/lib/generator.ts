import { getTableThemeClass, toCamelCase } from "./helpers";
import { TableData } from "./parser";

export type CodeFormat = "html" | "react" | "react-native";
export type CodeTheme = "light" | "dark" | "material" | "minimal";

export function generateAllTablesCode(
  tables: TableData[],
  format: CodeFormat,
  theme: CodeTheme
): string {
  return tables
    .map((table) => generateTableCode(table, format, theme))
    .join("\n\n");
}

export function generateTableCode(
  table: TableData,
  format: CodeFormat,
  theme: CodeTheme
): string {
  const headers = table.columns.map((col) => col.name);
  const rows = table.rows;

  switch (format) {
    case "html":
      return generateHTMLTable(table.name, headers, rows, theme);
    case "react":
      return generateReactComponent(table.name, headers, rows, theme);
    case "react-native":
      return generateReactNativeView(table.name, headers, rows);
    default:
      return "";
  }
}

// 1. HTML
export function generateHTMLTable(
  name: string,
  headers: string[],
  rows: Record<string, any>[],
  theme: CodeTheme
): string {
  const themeClass = getTableThemeClass(theme);
  const thead = headers.map((h) => `<th class="px-4 py-2">${h}</th>`).join("");
  const tbody = rows
    .map(
      (row) =>
        `<tr>${headers
          .map((h) => `<td class="px-4 py-2">${row[h] ?? ""}</td>`)
          .join("")}</tr>`
    )
    .join("\n");

  return `
<h2 class="mb-2">${name}</h2>
<table class="${themeClass}">
  <thead><tr>${thead}</tr></thead>
  <tbody>${tbody}</tbody>
</table>
`.trim();
}

// 2. React
export function generateReactComponent(
  name: string,
  headers: string[],
  rows: Record<string, any>[],
  theme: CodeTheme
): string {
  const themeClass = getTableThemeClass(theme);
  const camelName = toCamelCase(name);

  return `
export const ${camelName} = () => {
  const data = ${JSON.stringify(rows, null, 2)};
  return (
    <div>
      <h2 className="mb-2">${name}</h2>
      <table className="${themeClass}">
        <thead className="p-3">
          <tr>${headers
            .map((h) => `<th className="px-4 py-2">${h}</th>`)
            .join("")}</tr>
        </thead>
        <tbody className="p-3">
          {data.map((row, i) => (
            <tr key={i}>
              ${headers
                .map((h) => `<td className="px-4 py-2">{row["${h}"]}</td>`)
                .join("")}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
`.trim();
}

// 3. React Native
export function generateReactNativeView(
  name: string,
  headers: string[],
  rows: Record<string, any>[]
): string {
  return `
import { View, Text, ScrollView } from 'react-native';

export const ${name} = () => {
  const data = ${JSON.stringify(rows, null, 2)};
  return (
    <ScrollView>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>${name}</Text>
      {data.map((row, i) => (
        <View key={i} style={{ marginVertical: 10, padding: 10, borderBottomWidth: 1 }}>
          ${headers
            .map(
              (h) =>
                `<Text><Text style={{ fontWeight: 'bold' }}>${h}:</Text> {row["${h}"]}</Text>`
            )
            .join("\n          ")}
        </View>
      ))}
    </ScrollView>
  );
};
`.trim();
}
