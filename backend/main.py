from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymatgen.core import Structure
from pymatgen.io.cif import CifParser
import tempfile
import os
from typing import Dict, List, Any
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Crystal Structure API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_element_color(element: str) -> str:
    """Return color for element based on modern color scheme"""
    colors = {
        # Alkali Metals (Warm colors)
        "H": "#FF6B6B", "Li": "#FF4444", "Na": "#FF6B35", "K": "#FF9F40", "Rb": "#FF4D4D", "Cs": "#FF6B6B", "Fr": "#FF4500",
        
        # Alkaline Earth Metals (Earth tones)
        "Be": "#F4E4C1", "Mg": "#8B4513", "Ca": "#00A86B", "Sr": "#00FF7F", "Ba": "#00A86B", "Ra": "#00FF00",
        
        # Transition Metals (Metallic colors)
        "Sc": "#E6E6FA", "Ti": "#7F8C8D", "V": "#6B8E23", "Cr": "#4A90E2", "Mn": "#9E9E9E", 
        "Fe": "#CD853F", "Co": "#F05228", "Ni": "#72A0C1", "Cu": "#B87333", "Zn": "#FFD700",
        "Y": "#FFFF00", "Zr": "#94E0E0", "Nb": "#73C2C9", "Mo": "#54B5B5", "Tc": "#3B9E9E", 
        "Ru": "#248F8F", "Rh": "#0A7D8C", "Pd": "#006985", "Ag": "#C0C0C0", "Cd": "#FFD98F",
        "Hf": "#4DC2FF", "Ta": "#4DA6FF", "W": "#2194D6", "Re": "#267DAB", "Os": "#266696",
        "Ir": "#175487", "Pt": "#D0D0E0", "Au": "#FFD700", "Hg": "#B8B8D0",
        
        # Lanthanides (Purple/Pink tones)
        "La": "#70D4FF", "Ce": "#FFFFC7", "Pr": "#D9FFC7", "Nd": "#C7FFC7", "Pm": "#A3FFC7", 
        "Sm": "#8FFFC7", "Eu": "#61FFC7", "Gd": "#45FFC7", "Tb": "#30FFC7", "Dy": "#1FFFC7", 
        "Ho": "#00FF9C", "Er": "#00E675", "Tm": "#00D452", "Yb": "#00BF38", "Lu": "#00AB24",
        
        # Actinides (Green/Blue tones)
        "Ac": "#70ABFA", "Th": "#00BAFF", "Pa": "#00A1FF", "U": "#008FFF", "Np": "#0080FF", "Pu": "#006BFF", 
        "Am": "#545CF2", "Cm": "#785CE3", "Bk": "#8A4FE3", "Cf": "#A136D4", "Es": "#B31FD4", 
        "Fm": "#B31FBA", "Md": "#B30DA6", "No": "#BD0D87", "Lr": "#C70066", "Rf": "#CC0059",
        "Db": "#D1004F", "Sg": "#D90045", "Bh": "#E00038", "Hs": "#E6002E", "Mt": "#EB0026",
        "Ds": "#EF001E", "Rg": "#F20017", "Cn": "#F3000D", "Fl": "#F60008", "Lv": "#FA0008", "Ts": "#FD0007", "Og": "#FE0006",
        
        # Metalloids (Orange/Yellow tones)
        "B": "#FFA500", "Si": "#FF8C00", "Ge": "#8B4513", "As": "#FFC107", "Sb": "#9E9A9E", "Te": "#D4A017",
        
        # Non-metals (Various colors)
        "He": "#E3F2FD", "Ne": "#B3E3F5", "Ar": "#80D1E3", "Kr": "#5CB8CC", "Xe": "#429EB0",
        "C": "#505050", "N": "#0078D7", "O": "#FF0000", "F": "#00BFFF", "Cl": "#1CFE00",
        "P": "#FF3D00", "S": "#FFEB3B", "Se": "#FFA000", "Br": "#8B4513", "I": "#6400AA",
        
        # Noble Metals (Gray/Silver tones)
        "Al": "#D4D4D4", "Ga": "#CD5C5C", "In": "#A67C52", "Sn": "#666666", "Tl": "#A67C52",
        "Pb": "#434343", "Bi": "#9E9E9E"
    }
    return colors.get(element, "#808080")  # Default gray for unknown elements

def calculate_bonds(structure: Structure, cutoff_factor: float = 1.2) -> List[Dict[str, Any]]:
    """Calculate bonds based on distance cutoffs"""
    bonds = []
    sites = structure.sites
    
    for i, site1 in enumerate(sites):
        for j, site2 in enumerate(sites):
            if i >= j:
                continue
                
            distance = structure.get_distance(i, j)
            
            # Get covalent radii sum for cutoff
            try:
                from pymatgen.core.periodic_table import Element
                elem1 = Element(site1.species_string)
                elem2 = Element(site2.species_string)
                cutoff = (elem1.covalent_radius + elem2.covalent_radius) * cutoff_factor
                
                if distance <= cutoff:
                    bonds.append({
                        "atom1_index": i,
                        "atom2_index": j,
                        "distance": float(distance),
                        "atom1_element": site1.species_string,
                        "atom2_element": site2.species_string
                    })
            except:
                # Fallback to generic cutoff if covalent radii not available
                if distance <= 3.0 * cutoff_factor:
                    bonds.append({
                        "atom1_index": i,
                        "atom2_index": j,
                        "distance": float(distance),
                        "atom1_element": site1.species_string,
                        "atom2_element": site2.species_string
                    })
    
    return bonds

@app.post("/api/parse-cif")
async def parse_cif(file: UploadFile = File(...)):
    """Parse CIF file and return crystal structure data"""
    
    if not file.filename.endswith(('.cif', '.CIF')):
        raise HTTPException(status_code=400, detail="File must be a CIF file")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.cif') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        logger.info(f"Processing CIF file: {file.filename}")
        
        # Parse CIF file
        parser = CifParser(tmp_file_path)
        structures = parser.parse_structures()
        
        if not structures:
            raise HTTPException(status_code=400, detail="No structures found in CIF file")
        
        # Use first structure (most common case)
        structure = structures[0]
        logger.info(f"Successfully parsed structure with {len(structure.sites)} atoms")
        
        # Extract lattice parameters
        lattice = structure.lattice
        lattice_params = {
            "a": float(lattice.a),
            "b": float(lattice.b),
            "c": float(lattice.c),
            "alpha": float(lattice.alpha),
            "beta": float(lattice.beta),
            "gamma": float(lattice.gamma),
            "volume": float(lattice.volume)
        }
        
        # Extract space group information
        space_group = {
            "symbol": getattr(structure, 'spacegroup', {}).get('symbol', 'Unknown'),
            "number": getattr(structure, 'spacegroup', {}).get('international_number', None)
        }
        
        # Extract crystal system and point group
        crystal_system = getattr(structure.lattice, 'crystal_system', 'Unknown')
        point_group = getattr(structure, 'point_group', 'Unknown')
        
        # Extract atomic data
        atoms = []
        for i, site in enumerate(structure.sites):
            cart_coords = site.coords.tolist()
            frac_coords = site.frac_coords.tolist()
            
            atoms.append({
                "index": i,
                "element": site.species_string,
                "fractional_coordinates": frac_coords,
                "cartesian_coordinates": cart_coords,
                "color": get_element_color(site.species_string),
                "occupancy": float(site.species.occupancy) if hasattr(site.species, 'occupancy') else 1.0
            })
        
        # Calculate bonds
        bonds = calculate_bonds(structure)
        logger.info(f"Calculated {len(bonds)} bonds")
        
        # Get chemical formula
        composition = structure.composition
        formula = {
            "reduced": composition.reduced_formula,
            "pretty": str(composition),
            "anonymous": composition.anonymized_formula
        }
        
        # Clean up temporary file
        os.unlink(tmp_file_path)
        
        response_data = {
            "lattice_parameters": lattice_params,
            "space_group": space_group,
            "crystal_system": crystal_system,
            "point_group": point_group,
            "atoms": atoms,
            "bonds": bonds,
            "formula": formula,
            "num_atoms": len(atoms),
            "num_bonds": len(bonds)
        }
        
        logger.info(f"Successfully processed CIF file: {file.filename}")
        return JSONResponse(content=response_data)
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        # Clean up temporary file if it exists
        if 'tmp_file_path' in locals():
            try:
                os.unlink(tmp_file_path)
            except:
                pass
        
        logger.error(f"Error parsing CIF file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error parsing CIF file: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Crystal Structure Visualization API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
