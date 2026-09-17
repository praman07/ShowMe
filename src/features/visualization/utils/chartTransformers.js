const isDateKey = (val) => {
  if (!val || typeof val !== 'string') return false;
  const parsed = Date.parse(val);
  return !isNaN(parsed) && (val.includes('-') || val.includes('/') || val.includes(','));
};

const isNumericKey = (val) => {
  if (val === null || val === undefined) return false;
  return !isNaN(parseFloat(val)) && isFinite(val);
};

export function transformChartData(rows, xAxis, yAxis, aggregation = 'sum', chartType = 'bar', bins = 10) {
  if (!rows || rows.length === 0 || !xAxis) return [];

  // Histogram transformation
  if (chartType === 'histogram') {
    const numValues = rows
      .map((r) => parseFloat(r[xAxis]))
      .filter((val) => !isNaN(val) && val !== null && val !== undefined);

    if (numValues.length === 0) return [];

    const min = Math.min(...numValues);
    const max = Math.max(...numValues);
    const range = max - min;
    const binWidth = range === 0 ? 1 : range / bins;

    const binCounts = Array.from({ length: bins }, (_, i) => {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      const startStr = Number.isInteger(binStart) ? binStart : binStart.toFixed(1);
      const endStr = Number.isInteger(binEnd) ? binEnd : binEnd.toFixed(1);
      return {
        binRange: `${startStr}–${endStr}`,
        count: 0,
      };
    });

    numValues.forEach((val) => {
      let idx = Math.floor((val - min) / binWidth);
      if (idx >= bins) idx = bins - 1;
      if (idx < 0) idx = 0;
      binCounts[idx].count += 1;
    });

    return binCounts;
  }

  // Scatter plot (raw numeric pairs)
  if (chartType === 'scatter') {
    return rows
      .map((r) => {
        const xVal = parseFloat(r[xAxis]);
        const yVal = yAxis ? parseFloat(r[yAxis]) : 0;
        if (isNaN(xVal) || (yAxis && isNaN(yVal))) return null;
        return { 
          x: parseFloat(xVal.toFixed(2)), 
          y: parseFloat(yVal.toFixed(2)), 
          name: `${r[xAxis]} vs ${r[yAxis] || 'Count'}` 
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.x - b.x);
  }

  // Grouped aggregation for Bar, Line, Area, Pie
  const groups = {};

  rows.forEach((row) => {
    const rawX = row[xAxis];
    const xKey = rawX === null || rawX === undefined || String(rawX).trim() === '' ? 'Unknown' : String(rawX).trim();
    if (!groups[xKey]) {
      groups[xKey] = [];
    }

    if (yAxis && row[yAxis] !== null && row[yAxis] !== undefined) {
      const yVal = parseFloat(row[yAxis]);
      if (!isNaN(yVal)) {
        groups[xKey].push(yVal);
      }
    } else {
      groups[xKey].push(1);
    }
  });

  const rawResults = Object.keys(groups).map((key) => {
    const values = groups[key];
    let aggregatedValue = 0;

    if (values.length === 0) {
      aggregatedValue = 0;
    } else if (aggregation === 'sum') {
      aggregatedValue = values.reduce((acc, v) => acc + v, 0);
    } else if (aggregation === 'mean') {
      aggregatedValue = values.reduce((acc, v) => acc + v, 0) / values.length;
    } else if (aggregation === 'min') {
      aggregatedValue = Math.min(...values);
    } else if (aggregation === 'max') {
      aggregatedValue = Math.max(...values);
    } else if (aggregation === 'count') {
      aggregatedValue = values.length;
    }

    return {
      name: key,
      value: parseFloat(aggregatedValue.toFixed(2)),
      count: values.length,
    };
  });

  // Smart Sorting based on X-axis data type or Chart Type
  const sampleKeys = rawResults.map((r) => r.name).filter((k) => k !== 'Unknown');
  const allAreDates = sampleKeys.length > 0 && sampleKeys.every(isDateKey);
  const allAreNumeric = sampleKeys.length > 0 && sampleKeys.every(isNumericKey);

  let sorted = [...rawResults];

  if (allAreDates || chartType === 'line' || chartType === 'area') {
    if (allAreDates) {
      sorted.sort((a, b) => Date.parse(a.name) - Date.parse(b.name));
    } else if (allAreNumeric) {
      sorted.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
    } else if (chartType === 'line' || chartType === 'area') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    }
  } else {
    // Categorical charts (Bar, Pie): sort descending by aggregated value for impact
    sorted.sort((a, b) => b.value - a.value);
  }

  // For Pie chart: top 7 + Other
  if (chartType === 'pie' && sorted.length > 8) {
    const top7 = sorted.slice(0, 7);
    const others = sorted.slice(7);
    const otherSum = others.reduce((acc, curr) => acc + curr.value, 0);
    top7.push({ name: 'Other', value: parseFloat(otherSum.toFixed(2)) });
    return top7;
  }

  // For Bar chart ONLY (when not date/numeric and more than 20 items): cap to top 15 + Other
  if (chartType === 'bar' && !allAreDates && !allAreNumeric && sorted.length > 20) {
    const top14 = sorted.slice(0, 14);
    const others = sorted.slice(14);
    const otherVal = others.reduce((acc, curr) => acc + curr.value, 0);
    top14.push({ name: 'Other', value: parseFloat(otherVal.toFixed(2)) });
    return top14;
  }

  return sorted;
}
