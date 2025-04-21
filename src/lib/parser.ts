import initSqlJs from "sql.js";

export interface TableData {
  name: string;
  columns: {
    name: string;
    type: string;
    notnull: boolean;
  }[];
  rows: Record<string, any>[];
}

export async function parseDatabase(file: File) {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const buffer = await file.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));

  const tableNames = db
    .exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    )[0]
    .values.map((row) => row[0] as string);

  const result: TableData[] = [];

  for (const name of tableNames) {
    const columnsRes = db.exec(`PRAGMA table_info(${name});`);
    if (!columnsRes.length) continue;

    // get all columns
    const columns = columnsRes[0].values.map((col) => ({
      name: col[1] as string,
      type: col[2] as string,
      notnull: Boolean(col[3]),
    }));

    // get all rows
    const rows: Record<string, any>[] = [];
    const stmt = db.prepare(`SELECT * FROM ${name}`);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      rows.push(row);
    }

    // push rows into array
    result.push({ name, columns, rows });
  }

  return result;
}
