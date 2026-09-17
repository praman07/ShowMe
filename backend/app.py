import os
import io
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from analysis import analyze_dataframe

app = Flask(__name__)
# Enable CORS for frontend development
CORS(app, resources={r"/api/*": {"origins": "*"}})

MAX_FILE_SIZE_MB = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for Phase 1 & 2 verification.
    """
    return jsonify({
        "status": "ok"
    }), 200

@app.route('/api/analyze', methods=['POST'])
def analyze_csv():
    """
    Analyze an uploaded CSV file in-memory using Pandas and return structured JSON.
    """
    if 'file' not in request.files:
        return jsonify({
            "success": False,
            "error": "No file parameter provided in request."
        }), 400

    file = request.files['file']

    if not file or file.filename.strip() == '':
        return jsonify({
            "success": False,
            "error": "Please select a valid CSV file to upload."
        }), 400

    filename = file.filename
    if not filename.lower().endswith('.csv'):
        return jsonify({
            "success": False,
            "error": "Only CSV files are supported. Please upload a .csv file."
        }), 400

    try:
        # Read file bytes into memory
        file_bytes = file.read()

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            return jsonify({
                "success": False,
                "error": f"File size exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB."
            }), 400

        if len(file_bytes) == 0:
            return jsonify({
                "success": False,
                "error": "The uploaded CSV file is empty."
            }), 400

        # Attempt to read CSV with pandas using BytesIO
        try:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding='utf-8')
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding='latin1')

        if df.empty and len(df.columns) == 0:
            return jsonify({
                "success": False,
                "error": "Failed to parse CSV: No data or columns found."
            }), 400

        # Perform Pandas dataset analysis
        analysis_result = analyze_dataframe(df, filename=filename)
        return jsonify(analysis_result), 200

    except pd.errors.EmptyDataError:
        return jsonify({
            "success": False,
            "error": "The uploaded CSV file contains no data."
        }), 400
    except pd.errors.ParserError:
        return jsonify({
            "success": False,
            "error": "Malformed CSV file. Unable to parse columns and rows."
        }), 400
    except Exception as e:
        print(f"Error during CSV analysis: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Dataset analysis failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"ShowMe Flask Backend running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
