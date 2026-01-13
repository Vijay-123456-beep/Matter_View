# Crystal Structure Visualizer

A full-stack web application for visualizing crystal structures from CIF files using modern web technologies.

## Overview

This application allows users to upload CIF (Crystallographic Information Framework) files and visualize the corresponding crystal structures in interactive 3D. The system extracts comprehensive crystallographic data and provides both visual and tabular representations.

## Architecture

### Backend (FastAPI + Python)
- **Framework**: FastAPI
- **CIF Parsing**: pymatgen
- **Features**:
  - CIF file upload and parsing
  - Extraction of lattice parameters, atomic coordinates, and bond information
  - Space group and crystal system identification
  - RESTful API with CORS support

### Frontend (React + Three.js)
- **Framework**: React with Vite
- **3D Rendering**: React Three Fiber + Three.js
- **Features**:
  - Interactive 3D crystal structure visualization
  - Drag-and-drop file upload
  - Toggle controls for atoms, bonds, and unit cell
  - Element-specific visibility controls
  - Detailed data tables for crystallographic information

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Usage

1. Open the web application in your browser
2. Upload a CIF file using the drag-and-drop interface or file selector
3. View the 3D crystal structure visualization
4. Use the control panel to:
   - Toggle atoms, bonds, and unit cell visibility
   - Control visibility of individual elements
5. Explore detailed crystallographic data in the data tables

## Features

### Crystal Structure Visualization
- Interactive 3D rendering with orbit controls
- Atoms displayed as colored spheres (element-specific colors)
- Bonds calculated based on distance cutoffs
- Unit cell boundaries with proper lattice parameters
- Smooth animations and transitions

### Data Extraction
- **Lattice Parameters**: a, b, c, α, β, γ, volume
- **Atomic Data**: Fractional and Cartesian coordinates, element types, occupancy
- **Bond Information**: Bond lengths and connected atom pairs
- **Symmetry Information**: Space group, crystal system, point group
- **Chemical Formula**: Multiple formula representations

### User Interface
- Modern, responsive design
- Drag-and-drop file upload
- Real-time 3D manipulation (zoom, pan, rotate)
- Comprehensive data tables
- Element-specific controls

## API Endpoints

### POST /api/parse-cif
Upload and parse CIF files.

**Request**: `multipart/form-data` with file field "file"

**Response**: JSON containing crystal structure data

### GET /health
Health check endpoint.

## Technology Stack

### Backend
- FastAPI (Python web framework)
- pymatgen (materials analysis library)
- uvicorn (ASGI server)
- pydantic (data validation)

### Frontend
- React 18 (UI framework)
- Vite (build tool)
- React Three Fiber (3D rendering)
- Three.js (3D graphics library)
- Axios (HTTP client)

## Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Production Deployment

### Backend
1. Set environment variables using `.env` file
2. Install production dependencies
3. Run with production server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
1. Build the application:
```bash
npm run build
```
2. Deploy the `dist` folder to your web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- pymatgen library for CIF parsing and materials analysis
- React Three Fiber for 3D visualization capabilities
- Vite for modern development experience
