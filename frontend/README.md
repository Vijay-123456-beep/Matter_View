# Crystal Structure Visualizer Frontend

React frontend for visualizing crystal structures from CIF files using Three.js and React Three Fiber.

## Features

- Interactive 3D visualization of crystal structures
- CIF file upload and parsing
- Toggle atoms, bonds, and unit cell visibility
- Element-specific visibility controls
- Detailed data tables for lattice parameters and atomic coordinates
- Responsive design with modern UI

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Usage

1. Upload a CIF file using the file upload interface
2. View the 3D crystal structure visualization
3. Use controls to toggle visibility of different components
4. Explore detailed crystallographic data in the tables

## Components

### CrystalViewer
Main 3D visualization component using React Three Fiber.

### FileUpload
Handles CIF file upload with drag-and-drop support.

### Controls
Provides visibility toggles for atoms, bonds, unit cell, and individual elements.

### DataTables
Displays crystallographic information including lattice parameters, atomic coordinates, and bond data.

## Technology Stack

- React 18
- Vite
- React Three Fiber (3D rendering)
- Three.js
- Axios (HTTP client)

## Development

For development with hot reload:
```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## License

MIT License
