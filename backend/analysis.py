import numpy as np
import pandas as pd

def sanitize_value(val):
    """
    Safely convert Pandas/NumPy types, NaNs, Infs, and Timestamps to JSON-native Python types.
    """
    if pd.isna(val):
        return None
    if isinstance(val, (np.integer, int)):
        return int(val)
    if isinstance(val, (np.floating, float)):
        if np.isinf(val) or np.isnan(val):
            return None
        return float(val)
    if isinstance(val, (np.bool_, bool)):
        return bool(val)
    if isinstance(val, (pd.Timestamp, pd.Timedelta)):
        return str(val)
    return str(val) if not isinstance(val, (str, dict, list)) else val

def infer_column_type(series, row_count):
    """
    Infer simple column types: numeric, categorical, datetime, boolean, text.
    """
    dtype = series.dtype

    if pd.api.types.is_bool_dtype(dtype):
        return "boolean"

    if pd.api.types.is_numeric_dtype(dtype):
        # Check if numeric column is actually boolean (0 and 1 only)
        non_null = series.dropna()
        if len(non_null) > 0 and set(non_null.unique()).issubset({0, 1}):
            return "boolean"
        return "numeric"

    if pd.api.types.is_datetime64_any_dtype(dtype):
        return "datetime"

    # Try parsing string series to datetime if column name suggests date or sample looks like date
    non_null_str = series.dropna().astype(str)
    if len(non_null_str) > 0:
        sample_val = str(non_null_str.iloc[0]).strip()
        if any(keyword in series.name.lower() for keyword in ['date', 'time', 'dt', 'created', 'updated', 'year']):
            try:
                pd.to_datetime(series.dropna().head(20), errors='raise')
                return "datetime"
            except Exception:
                pass

    # Heuristic for categorical vs text
    unique_count = series.nunique(dropna=True)
    if unique_count <= 20 or (row_count > 0 and (unique_count / row_count) <= 0.05):
        return "categorical"

    return "text"

def analyze_dataframe(df, filename="dataset.csv"):
    """
    Analyze a Pandas DataFrame and return structured JSON metadata, schema,
    quality metrics, numeric statistics, and a 100-row preview.
    """
    rows_count = int(len(df))
    cols_count = int(len(df.columns))

    # Quality metrics
    total_cells = rows_count * cols_count
    missing_cells = int(df.isna().sum().sum())
    missing_percentage = round((missing_cells / total_cells * 100), 2) if total_cells > 0 else 0.0
    duplicate_rows = int(df.duplicated().sum())

    cols_with_missing = 0
    schema = []
    statistics = {}

    for col in df.columns:
        series = df[col]
        missing_count = int(series.isna().sum())
        if missing_count > 0:
            cols_with_missing += 1

        missing_pct = round((missing_count / rows_count * 100), 2) if rows_count > 0 else 0.0
        unique_count = int(series.nunique(dropna=True))
        col_type = infer_column_type(series, rows_count)

        schema.append({
            "name": str(col),
            "type": col_type,
            "missing": missing_count,
            "missing_percentage": missing_pct,
            "unique": unique_count
        })

        # Calculate numeric statistics for numeric columns
        if col_type == "numeric":
            numeric_series = pd.to_numeric(series, errors='coerce').dropna()
            if len(numeric_series) > 0:
                statistics[str(col)] = {
                    "count": int(len(numeric_series)),
                    "mean": sanitize_value(numeric_series.mean()),
                    "std": sanitize_value(numeric_series.std()) if len(numeric_series) > 1 else 0.0,
                    "min": sanitize_value(numeric_series.min()),
                    "q25": sanitize_value(numeric_series.quantile(0.25)),
                    "median": sanitize_value(numeric_series.median()),
                    "q75": sanitize_value(numeric_series.quantile(0.75)),
                    "max": sanitize_value(numeric_series.max())
                }

    # Prepare first 100 rows preview
    preview_df = df.head(100)
    preview_rows = []
    for _, row in preview_df.iterrows():
        row_dict = {}
        for col in df.columns:
            row_dict[str(col)] = sanitize_value(row[col])
        preview_rows.append(row_dict)

    return {
        "success": True,
        "dataset": {
            "filename": str(filename),
            "rows": rows_count,
            "columns": cols_count
        },
        "quality": {
            "missing_values": missing_cells,
            "missing_percentage": missing_percentage,
            "duplicate_rows": duplicate_rows,
            "columns_with_missing": cols_with_missing
        },
        "schema": schema,
        "statistics": statistics,
        "preview": preview_rows
    }
