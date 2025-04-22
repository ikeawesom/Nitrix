import { CodeFormat } from "../lib/generator";

interface CodeExporterProps {
  code: string;
  format: CodeFormat;
}

export default function CodeExporter({ code, format }: CodeExporterProps) {
  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${format}-code-nitrix.${
      format === "html" ? "html" : "tsx"
    }`;
    document.body.appendChild(link);
    link.click();

    // clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 w-full">
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Download {format === "html" ? "HTML" : "React Component"} Code
      </button>
    </div>
  );
}
