import React from 'react';

const Controls = ({ visibility, setVisibility, elementVisibility, setElementVisibility, availableElements }) => {
  
  const handleVisibilityToggle = (key) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleElementToggle = (element) => {
    setElementVisibility(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const toggleAllElements = (visible) => {
    const newVisibility = {};
    availableElements.forEach(element => {
      newVisibility[element] = visible;
    });
    setElementVisibility(newVisibility);
  };

  return (
    <div className="controls-container">
      <div className="control-section">
        <h3>Display Options</h3>
        <div className="control-group">
          <label className="control-item">
            <input
              type="checkbox"
              checked={visibility.atoms}
              onChange={() => handleVisibilityToggle('atoms')}
            />
            <span>Atoms</span>
          </label>
          <label className="control-item">
            <input
              type="checkbox"
              checked={visibility.bonds}
              onChange={() => handleVisibilityToggle('bonds')}
            />
            <span>Bonds</span>
          </label>
          <label className="control-item">
            <input
              type="checkbox"
              checked={visibility.unitCell}
              onChange={() => handleVisibilityToggle('unitCell')}
            />
            <span>Unit Cell</span>
          </label>
        </div>
      </div>

      {availableElements.length > 0 && (
        <div className="control-section">
          <h3>Element Visibility</h3>
          <div className="element-controls">
            <div className="element-control-buttons">
              <button 
                className="element-button"
                onClick={() => toggleAllElements(true)}
              >
                Show All
              </button>
              <button 
                className="element-button"
                onClick={() => toggleAllElements(false)}
              >
                Hide All
              </button>
            </div>
            <div className="element-list">
              {availableElements.map(element => (
                <label key={element} className="control-item element-item">
                  <input
                    type="checkbox"
                    checked={elementVisibility[element] || false}
                    onChange={() => handleElementToggle(element)}
                  />
                  <span 
                    className="element-color"
                    style={{ 
                      backgroundColor: getElementColor(element) 
                    }}
                  ></span>
                  <span>{element}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get element colors (matches backend)
const getElementColor = (element) => {
  const colors = {
    // Alkali Metals (Warm colors)
    "H": "#FF6B6B", "Li": "#FF4444", "Na": "#FF6B35", "K": "#FF9F40", "Rb": "#FF4D4D", "Cs": "#FF6B6B", "Fr": "#FF4500",
    
    // Alkaline Earth Metals (Earth tones)
    "Be": "#F4E4C1", "Mg": "#8B4513", "Ca": "#00A86B", "Sr": "#00FF7F", "Ba": "#00A86B", "Ra": "#00FF00",
    
    // Transition Metals (Metallic colors)
    "Sc": "#E6E6FA", "Ti": "#7F8C8D", "V": "#6B8E23", "Cr": "#4A90E2", "Mn": "#9E9E9E", 
    "Fe": "#CD853F", "Co": "#F05228", "Ni": "#72A0C1", "Cu": "#B87333", "Zn": "#FFD700",
    "Y": "#FFFF00", "Zr": "#94E0E0", "Nb": "#73C2C9", "Mo": "#54B5B5", "Tc": "#3B9E9E", 
    "Ru": "#248F8F", "Rh": "#0A7D8C", "Pd": "#006985", "Ag": "#C0C0C0", "Cd": "#FFD98F",
    "Hf": "#4DC2FF", "Ta": "#4DA6FF", "W": "#2194D6", "Re": "#267DAB", "Os": "#266696",
    "Ir": "#175487", "Pt": "#D0D0E0", "Au": "#FFD700", "Hg": "#B8B8D0",
    
    // Lanthanides (Purple/Pink tones)
    "La": "#70D4FF", "Ce": "#FFFFC7", "Pr": "#D9FFC7", "Nd": "#C7FFC7", "Pm": "#A3FFC7", 
    "Sm": "#8FFFC7", "Eu": "#61FFC7", "Gd": "#45FFC7", "Tb": "#30FFC7", "Dy": "#1FFFC7", 
    "Ho": "#00FF9C", "Er": "#00E675", "Tm": "#00D452", "Yb": "#00BF38", "Lu": "#00AB24",
    
    // Actinides (Green/Blue tones)
    "Ac": "#70ABFA", "Th": "#00BAFF", "Pa": "#00A1FF", "U": "#008FFF", "Np": "#0080FF", "Pu": "#006BFF", 
    "Am": "#545CF2", "Cm": "#785CE3", "Bk": "#8A4FE3", "Cf": "#A136D4", "Es": "#B31FD4", 
    "Fm": "#B31FBA", "Md": "#B30DA6", "No": "#BD0D87", "Lr": "#C70066", "Rf": "#CC0059",
    "Db": "#D1004F", "Sg": "#D90045", "Bh": "#E00038", "Hs": "#E6002E", "Mt": "#EB0026",
    "Ds": "#EF001E", "Rg": "#F20017", "Cn": "#F3000D", "Fl": "#F60008", "Lv": "#FA0008", "Ts": "#FD0007", "Og": "#FE0006",
    
    // Metalloids (Orange/Yellow tones)
    "B": "#FFA500", "Si": "#FF8C00", "Ge": "#8B4513", "As": "#FFC107", "Sb": "#9E9A9E", "Te": "#D4A017",
    
    // Non-metals (Various colors)
    "He": "#E3F2FD", "Ne": "#B3E3F5", "Ar": "#80D1E3", "Kr": "#5CB8CC", "Xe": "#429EB0",
    "C": "#505050", "N": "#0078D7", "O": "#FF0000", "F": "#00BFFF", "Cl": "#1CFE00",
    "P": "#FF3D00", "S": "#FFEB3B", "Se": "#FFA000", "Br": "#8B4513", "I": "#6400AA",
    
    // Noble Metals (Gray/Silver tones)
    "Al": "#D4D4D4", "Ga": "#CD5C5C", "In": "#A67C52", "Sn": "#666666", "Tl": "#A67C52",
    "Pb": "#434343", "Bi": "#9E9E9E"
  };
  return colors[element] || "#808080";
};

export default Controls;
