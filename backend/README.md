# Crystal Structure API Backend

FastAPI backend for parsing CIF files and extracting crystallographic data.

## Features

- CIF file parsing using pymatgen
- Extraction of lattice parameters, atomic coordinates, and bond information
- Space group and crystal system identification
- RESTful API endpoints
- CORS support for frontend integration

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy environment configuration:
```bash
cp .env.example .env
```

4. Run the server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### POST /api/parse-cif
Upload and parse a CIF file.

**Request:** `multipart/form-data` with file field named "file"

**Response:** JSON object containing:
- `lattice_parameters`: a, b, c, α, β, γ, volume
- `space_group`: symbol and number
- `crystal_system`: crystal system name
- `point_group`: point group name
- `atoms`: array of atomic positions and properties
- `bonds`: array of bond information
- `formula`: chemical formula information

### GET /
Root endpoint with API information.

### GET /health
Health check endpoint.

## Environment Variables

- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `ALLOWED_ORIGINS`: CORS allowed origins
- `LOG_LEVEL`: Logging level
- `MAX_FILE_SIZE`: Maximum upload file size
- `BOND_CUTOFF_FACTOR`: Factor for bond distance calculation

## Development

For development with auto-reload:
```bash
uvicorn main:app --reload
```

## Testing

Run tests with:
```bash
pytest
```

## License

MIT License
