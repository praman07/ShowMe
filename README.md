# SHOWME — CSV Data Analytics & Visualization Platform

**ShowMe** is a product-quality React + Python analytics application that allows users to upload raw CSV datasets, automatically analyze dataset quality, explore and filter data rows, and generate interactive visualizations.

---

## 🌟 Key Features

- **Upload Experience**: Drag-and-drop CSV upload with client-side & server-side validation (50MB size limit, `.csv` restriction, in-memory processing).
- **Dataset Overview Dashboard (`/dashboard`)**:
  - Key Performance Indicators (Rows, Columns, Missing %, Duplicate Rows).
  - Data Quality Assessment (Missingness breakdown, duplicate row detection, parsed checkmarks).
  - Column Schema Table (Inferred types: `numeric`, `categorical`, `datetime`, `boolean`, `text`, unique value counts, missing %).
  - Summary Statistics (Count, Mean, Std, Min, Q1, Median, Q3, Max for numeric attributes).
  - 100-Row Dataset Preview with sticky headers and `null` value highlighting.
- **Data Explorer (`/data`)**:
  - Global Search across all fields in the preview dataset.
  - Multi-Column Sorting (ASC / DESC / Reset with type-aware comparison).
  - Type-Aware Filter Panel (Categorical checkboxes, numeric min/max range, text contains, boolean selectors).
  - Column Visibility Toggle.
  - Client-Side Pagination (25, 50, 100 rows per page).
- **Visualization Studio (`/visualize`)**:
  - Interactive Chart Builder supporting 6 chart types: **Bar**, **Line**, **Area**, **Scatter Plot**, **Pie / Donut**, and **Histogram**.
  - Aggregation functions: `Sum`, `Average (Mean)`, `Minimum`, `Maximum`, `Count`.
  - Saved Visualizations Canvas storing multiple custom chart cards per session.
  - Dynamic Filter Syncing: Active filters on `/data` automatically re-aggregate and update all visualizations in real time.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **State Management**:
  - **Redux Toolkit**: Client application state (active dataset, filter rules, sort, column visibility, chart builder configurations, saved chart cards).
  - **TanStack Query**: Server API requests, mutation states, loading, and errors.
- **Styling & UI**: Tailwind CSS v4, Aceternity UI components (`FileUpload`, `HoverEffect`, `Spotlight`, `BackgroundGrid`, Sidebar), Motion (Framer Motion), Lucide Icons, Recharts (SVG Charts).
- **Architecture**: Feature-Based Architecture (`src/features/upload`, `src/features/dataset`, `src/features/filters`, `src/features/visualization`).

### Backend
- **Framework**: Python 3.11 + Flask
- **Data Engine**: Pandas + NumPy
- **In-Memory Design**: Streams uploaded CSV bytes directly into memory. No database, ORM, or persistent disk storage required.

---

## 📁 Directory Structure

```text
Showme/
├── package.json
├── vite.config.js
├── index.html
├── README.md
├── src/
│   ├── main.jsx
│   ├── app/
│   │   ├── App.jsx
│   │   ├── router.jsx
│   │   ├── providers/
│   │   │   └── AppProviders.jsx
│   │   └── store/
│   │       └── store.js
│   ├── features/
│   │   ├── upload/
│   │   ├── dataset/
│   │   ├── filters/
│   │   └── visualization/
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── DataPage.jsx
│   │   └── VisualizePage.jsx
│   ├── layouts/
│   │   ├── MarketingLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── shared/
│   │   ├── components/ui/
│   │   └── utils/
│   └── styles/
│       └── globals.css
└── backend/
    ├── app.py
    ├── analysis.py
    └── requirements.txt
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Python**: 3.9+ (tested on Python 3.11)

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Run Flask backend server (Port 5001)
python backend/app.py
```

### 3. Frontend Setup
```bash
# Install Node dependencies
npm install --legacy-peer-deps

# Start Vite development server (Port 3000)
npm run dev
```

---

## 🔌 API Endpoints

### 1. GET `/api/health`
- **Description**: Health check endpoint.
- **Response**: `{"status": "ok"}`

### 2. POST `/api/analyze`
- **Description**: Accepts multipart CSV upload, performs in-memory Pandas analysis, returns structured dataset metrics.
- **Request**: `multipart/form-data` with `file=<csv_file>`.
- **Response**: Returns structured JSON containing metadata, quality score, column schema, numeric statistics, and first 100 preview rows.

---

## 📌 Data Architecture Limitation
To guarantee fast execution and zero server overhead, the backend streams and analyzes the CSV in memory, returning the first 100 preview rows to the browser. All client-side search, filtering, sorting, pagination, and visualizations operate on this loaded preview dataset.

---

## 🔮 Future Improvements
- Backend query pagination endpoint for ultra-large CSV files (>1,000,000 rows).
- Multi-file comparison & join studio.
- Export generated chart canvas to PNG/SVG/PDF.
- Saved user dashboard presets.
