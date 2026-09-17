export function getFilteredAndSortedRows(previewRows, schema, filters) {
  if (!previewRows || previewRows.length === 0) return [];

  const { searchQuery, columnFilters, sortConfig } = filters;

  const schemaMap = {};
  if (schema) {
    schema.forEach((s) => {
      schemaMap[s.name] = s.type;
    });
  }

  // 1. Search Filter across all fields
  let rows = previewRows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some((val) => {
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(query);
    });
  });

  // 2. Specific Column Filters
  Object.keys(columnFilters).forEach((colName) => {
    const filterRule = columnFilters[colName];
    const colType = schemaMap[colName] || 'text';

    if (!filterRule) return;

    rows = rows.filter((row) => {
      const val = row[colName];

      if (colType === 'categorical') {
        if (Array.isArray(filterRule) && filterRule.length > 0) {
          if (val === null || val === undefined) return false;
          return filterRule.includes(String(val));
        }
      }

      if (colType === 'numeric') {
        const numVal = typeof val === 'number' ? val : parseFloat(val);
        if (isNaN(numVal)) return false;

        const min = filterRule.min !== '' && filterRule.min !== null && filterRule.min !== undefined ? parseFloat(filterRule.min) : null;
        const max = filterRule.max !== '' && filterRule.max !== null && filterRule.max !== undefined ? parseFloat(filterRule.max) : null;

        if (min !== null && numVal < min) return false;
        if (max !== null && numVal > max) return false;
        return true;
      }

      if (colType === 'text') {
        if (typeof filterRule === 'string' && filterRule.trim()) {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(filterRule.toLowerCase());
        }
      }

      if (colType === 'boolean') {
        if (filterRule === 'true') return val === true || val === 1 || val === 'true';
        if (filterRule === 'false') return val === false || val === 0 || val === 'false';
        return true;
      }

      return true;
    });
  });

  // 3. Sorting
  if (sortConfig.key) {
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'desc' ? -1 : 1;
    const colType = schemaMap[key] || 'text';

    rows = [...rows].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (colType === 'numeric') {
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        return (numA - numB) * direction;
      }

      if (colType === 'datetime') {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return (dateA - dateB) * direction;
        }
      }

      return String(valA).localeCompare(String(valB)) * direction;
    });
  }

  return rows;
}
