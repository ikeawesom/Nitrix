import React, { useState } from "react";
import { parseDatabase, TableData } from "../lib/parser";

interface FileUploaderProps {
  onParsed: (tables: TableData[]) => void;
}

export default function FileUploader({ onParsed }: FileUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // accept only .sqlite or .db extensions
    const validExtensions = [".sqlite", ".db"];
    const isValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isValid) {
      setError("Please upload a valid database file (.sqlite or .db).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsed = await parseDatabase(file);
      onParsed(parsed);
    } catch (err) {
      console.error(err);
      setError("Failed to parse the database file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 cursor-pointer">
      <label htmlFor="input" className="upload">
        Upload SQLite Database (.sqlite or .db)
      </label>
      <input
        id="input"
        type="file"
        accept=".sqlite,.db"
        onChange={handleFileChange}
      />
      {loading && <p className="text-blue-600 mt-2">Parsing database...</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
