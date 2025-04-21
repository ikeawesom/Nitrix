import "./App.css";
import { useState } from "react";
import { TableData } from "./lib/parser";
import { CodeFormat, generateAllTablesCode } from "./lib/generator";
import { CodeTheme } from "./lib/generator";
import CodeExporter from "./components/CodeExporter";
import FileUploader from "./components/FileUploader";
import TablePreview from "./components/TablePreview";
import DataInsights from "./components/DataInsights";

export default function App() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [format, setFormat] = useState<CodeFormat>("react");
  const [theme, setTheme] = useState<CodeTheme>("light");
  const [generatedCode, setGeneratedCode] = useState<string>("");

  const handleTablesParsed = (parsed: TableData[]) => {
    setTables(parsed);
  };

  const handleGenerate = () => {
    const code = generateAllTablesCode(tables, format, theme);
    setGeneratedCode(code);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nitrix</h1>

      <FileUploader onParsed={handleTablesParsed} />

      {tables.length > 0 && (
        <>
          <TablePreview tables={tables} />
          <DataInsights tables={tables} />

          <div className="flex gap-4">
            <div>
              <label>Format:</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as CodeFormat)}
              >
                <option value="html">HTML</option>
                <option value="react">React</option>
                <option value="react-native">React Native</option>
              </select>
            </div>

            <div>
              <label>Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as CodeTheme)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="material">Material</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>
          <button className="w-full" onClick={handleGenerate}>
            Generate Code
          </button>

          {generatedCode && (
            <>
              <pre className="rounded-md shadow-md border-[1px] border-gray-200 bg-gray-100 p-4 mt-4 overflow-auto max-h-96 whitespace-pre-wrap">
                {generatedCode}
              </pre>
              <CodeExporter code={generatedCode} format={format} />
            </>
          )}
        </>
      )}
    </div>
  );
}
