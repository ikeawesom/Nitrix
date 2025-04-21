import { TableData } from "./parser";

export interface ColumnInsight {
  name: string;
  type: string;
  notnull: boolean;
  nullPercentage: number;
  uniqueValues: number;
}

export interface TableAnalysis {
  name: string;
  rowCount: number;
  columns: ColumnInsight[];
}

export function analyzeTables(tables: TableData[]) {
  return tables.map((table) => {
    const rowCount = table.rows.length;

    const columns: ColumnInsight[] = table.columns.map((col) => {
      const values = table.rows.map((row) => row[col.name]);
      const nullCount = values.filter(
        (v) => v === null || v === undefined
      ).length;
      const nullPercentage = rowCount === 0 ? 0 : nullCount / rowCount;

      const unique = new Set(
        values.filter((v) => v !== null && v !== undefined)
      ).size;

      return {
        name: col.name,
        type: col.type,
        notnull: col.notnull,
        nullPercentage,
        uniqueValues: unique,
      };
    });

    return {
      name: table.name,
      rowCount,
      columns,
    };
  });
}
