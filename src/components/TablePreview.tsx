import { TableData } from "../lib/parser";

interface TablePreviewProps {
  tables: TableData[];
}

export default function TablePreview({ tables }: TablePreviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mt-8 pt-6 border-t-[1px] border-gray-200">
        Table Preview
      </h2>

      {tables.map((table) => (
        <div
          key={table.name}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
        >
          <h3 className="text-lg font-bold mb-2">{table.name}</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {table.columns.map((col) => (
                    <th key={col.name} className="border p-2 text-left">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {table.columns.map((col) => (
                      <td key={col.name} className="border p-2">
                        {row[col.name] === null ? (
                          <span className="text-gray-400 italic">NULL</span>
                        ) : (
                          String(row[col.name])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {table.rows.length > 5 && (
              <p className="text-gray-500 mt-2 text-xs italic">
                Showing first 5 of {table.rows.length} rows.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
