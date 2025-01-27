export function addQuotesToTableNames(sqlQuery: string): string {
  // Regular expression to match table names in FROM and JOIN clauses
  const regex = /\b(FROM|JOIN)\s+(\w+)/gi;

  // Replace each table name with quoted version
  return sqlQuery.replace(regex, (_, clause, tableName) => {
    return `${clause} "${tableName}"`;
  });
}

export function addQuotesToColumnNames(sqlQuery: string): string {
  const selectRegex = /SELECT(.*?)(?:FROM|$)/is;
  const match = sqlQuery.match(selectRegex);
  if (!match) return sqlQuery;

  const columnsPart = match[1].trim();

  // Return early if asterisk is found
  if (columnsPart === '*') {
    return sqlQuery;
  }

  const processedColumns = columnsPart
    .split(',')
    .map((column) => {
      column = column.trim();

      if (column.startsWith('"') && column.endsWith('"')) {
        return column;
      }

      if (column.toLowerCase().includes(' as ')) {
        const [col, alias] = column.split(/\s+as\s+/i);
        return `"${col.trim()}" AS "${alias.trim()}"`;
      }

      if (column.includes('(')) {
        return column;
      }

      return `"${column}"`;
    })
    .join(', ');

  return sqlQuery.replace(selectRegex, `SELECT ${processedColumns} FROM`);
}

export function addLimitIfNeeded(query: string): string {
  const normalizedQuery = query.trim().toUpperCase();

  // Remove any trailing semicolon
  let processedQuery = query.trim().replace(/;$/, '');

  // Check if query already has a LIMIT clause
  if (!normalizedQuery.includes('LIMIT')) {
    processedQuery += ' LIMIT 20';
  }

  // Add back the semicolon
  return processedQuery + ';';
}

export function uppercaseQuery(value: string): string {
  return value.replace(
    /\b(select|from|where|and|or|join|left|right|inner|outer|group by|order by|having|offset|as|on|in|between|like|is|null|not|distinct|union|all|create|table|drop|alter|index|primary|key|foreign|references|default|constraint|values|set)\b/gi,
    (match) => match.toUpperCase()
  );
}
