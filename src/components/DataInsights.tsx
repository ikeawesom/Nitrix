import { TableData } from "../lib/parser";

interface DataInsightsProps {
  tables: TableData[];
}

export default function DataInsights({ tables }: DataInsightsProps) {
  const inferColumnType = (values: any[]): string => {
    if (values.every((v) => typeof v === "number")) return "Number";
    if (values.every((v) => typeof v === "string")) return "String";
    if (values.every((v) => v instanceof Date)) return "Date";
    return "Mixed";
  };

  const getColumnStats = (table: TableData) => {
    return table.columns.map((col) => {
      const values = table.rows.map((row) => row[col.name]);
      const nullCount = values.filter((v) => v === null).length;
      const sampleNonNull = values.filter((v) => v !== null).slice(0, 5);
      const type = inferColumnType(sampleNonNull);
      return {
        name: col.name,
        nullCount,
        type,
      };
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-semibold">Data Insights</h2>

      {tables.map((table) => {
        const stats = getColumnStats(table);
        return (
          <div
            key={table.name}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <h3 className="text-lg font-bold mb-2">{table.name}</h3>
            <p className="text-sm text-gray-500 mb-3">
              Rows: {table.rows.length} | Columns: {table.columns.length}
            </p>
            <table className="table-auto text-sm w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Column</th>
                  <th className="p-2 border">Data Type</th>
                  <th className="p-2 border">NULLs</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((col) => (
                  <tr key={col.name}>
                    <td className="p-2 border">{col.name}</td>
                    <td className="p-2 border">{col.type}</td>
                    <td className="p-2 border text-center">{col.nullCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
