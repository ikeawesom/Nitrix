import React, { useState } from "react";
import { CodeFormat, CodeTheme } from "../lib/generator";
import { TableData } from "../lib/parser";
import {
  generateHtmlProjectZip,
  generateReactNativeProjectZip,
  generateReactProjectZip,
} from "../lib/projectBuilder";
import { saveAs } from "file-saver";

export default function ProjectDownloader({
  format,
  tables,
  theme,
}: {
  format: CodeFormat;
  theme: CodeTheme;
  tables: TableData[];
}) {
  const [loading, setLoading] = useState(false);

  const handleGenerateProject = async () => {
    switch (format) {
      case "html":
        return await generateHtmlProjectZip(theme, tables);
      case "react-native":
        return await generateReactNativeProjectZip(theme, tables);
      case "react":
        return await generateReactProjectZip(theme, tables);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const blob = await handleGenerateProject();
      saveAs(blob, `${format}-${theme}-nitrix-project.zip`);
    } catch (err: any) {
      console.log(err);
      alert("An error has occurred while building the project.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-4 w-full">
      <button
        disabled={loading}
        onClick={handleDownload}
        className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading
          ? "Creating project. Please wait..."
          : `Download ${
              format === "html"
                ? "HTML"
                : format === "react"
                ? "React (Vite)"
                : "React Native (Expo)"
            } Project`}
      </button>
    </div>
  );
}
