import "./App.css";
import { useEffect, useState } from "react";
import { TableData } from "./lib/parser";
import { CodeFormat, generateAllTablesCode } from "./lib/generator";
import { CodeTheme } from "./lib/generator";
import CodeExporter from "./components/CodeExporter";
import FileUploader from "./components/FileUploader";
import TablePreview from "./components/TablePreview";
import DataInsights from "./components/DataInsights";
import ProjectDownloader from "./components/ProjectDownloader";

export default function App() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [format, setFormat] = useState<CodeFormat>("react");
  const [theme, setTheme] = useState<CodeTheme>("light");
  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    setGeneratedCode("");
  }, [tables, format, theme]);

  const handleTablesParsed = (parsed: TableData[]) => {
    setTables(parsed);
  };

  const handleGenerate = async () => {
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

          <div className="flex items-center justify-between gap-y-4 gap-x-8 flex-wrap text-sm">
            <div className="flex gap-4">
              <div>
                <label>Format:</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as CodeFormat)}
                >
                  <option value="html">HTML</option>
                  <option value="react">React</option>
                  {/* <option value="react-native">React Native</option> */}
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
            <button className="w-fit" onClick={handleGenerate}>
              Generate Code
            </button>
          </div>

          {generatedCode && (
            <>
              <div className="pt-4 border-t-[1px] border-t-gray-300">
                <pre className="borderounded-md shadow-md border-[1px] rounded-md border-gray-200 bg-gray-100 p-4 mt-4 overflow-auto max-h-96 whitespace-pre-wrap text-sm">
                  {generatedCode}
                </pre>
                <div className="flex items-center justify-center gap-x-8 my-4">
                  <CodeExporter code={generatedCode} format={format} />
                  <ProjectDownloader
                    format={format}
                    tables={tables}
                    theme={theme}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
