import { CodeTheme } from "./generator";

export function getTableThemeClass(theme: CodeTheme): string {
  switch (theme) {
    case "light":
      return "rounded-md overflow-hidden table-auto border border-gray-300 bg-gray-300";
    case "dark":
      return "rounded-md overflow-hidden table-auto bg-gray-800 text-white border border-gray-600";
    case "material":
      return "rounded-md overflow-hidden table-auto border border-gray-200 shadow-md bg-blue-800";
    case "minimal":
      return "rounded-md overflow-hidden table-fixed border-collapse border border-slate-300";
    default:
      return "rounded-md overflow-hidden table-auto";
  }
}

export function getRowThemeClass(theme: CodeTheme): string {
  switch (theme) {
    case "light":
      return "bg-white";
    case "dark":
      return "bg-gray-600";
    case "material":
      return "bg-gray-50";
    case "minimal":
      return "";
  }
}

export function getBodyThemeClass(theme: CodeTheme): string {
  switch (theme) {
    case "light":
      return "bg-gray-50 text-gray-950";
    case "dark":
      return "bg-gray-700 text-white";
    case "material":
      return "bg-blue-50/10 text-gray-950";
    case "minimal":
      return "";
  }
}

export function toCamelCase(input: string): string {
  return (
    input
      .replace(/[_\s-]+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "") + "Table"
  );
}
