import React from 'react';

const DataTables = ({ structure }) => {
  if (!structure) return null;

  const { lattice_parameters, atoms, formula, space_group, crystal_system, point_group } = structure;

  return (
    <div className="data-tables-container">
      {/* Basic Information */}
      <div className="data-section">
        <h3>Basic Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Formula:</label>
            <span>{formula?.pretty || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Crystal System:</label>
            <span>{crystal_system || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Space Group:</label>
            <span>{space_group?.symbol || 'N/A'} ({space_group?.number || 'N/A'})</span>
          </div>
          <div className="info-item">
            <label>Point Group:</label>
            <span>{point_group || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Number of Atoms:</label>
            <span>{atoms?.length || 0}</span>
          </div>
          <div className="info-item">
            <label>Number of Bonds:</label>
            <span>{structure?.bonds?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Lattice Parameters */}
      <div className="data-section">
        <h3>Lattice Parameters</h3>
        <div className="lattice-grid">
          <div className="lattice-item">
            <label>a (Å):</label>
            <span>{lattice_parameters?.a?.toFixed(3) || 'N/A'}</span>
          </div>
          <div className="lattice-item">
            <label>b (Å):</label>
            <span>{lattice_parameters?.b?.toFixed(3) || 'N/A'}</span>
          </div>
          <div className="lattice-item">
            <label>c (Å):</label>
            <span>{lattice_parameters?.c?.toFixed(3) || 'N/A'}</span>
          </div>
          <div className="lattice-item">
            <label>α (°):</label>
            <span>{lattice_parameters?.alpha?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="lattice-item">
            <label>β (°):</label>
            <span>{lattice_parameters?.beta?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="lattice-item">
            <label>γ (°):</label>
            <span>{lattice_parameters?.gamma?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="lattice-item">
            <label>Volume (Å³):</label>
            <span>{lattice_parameters?.volume?.toFixed(3) || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Atomic Coordinates */}
      <div className="data-section">
        <h3>Atomic Coordinates</h3>
        <div className="table-container">
          <table className="coordinates-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Element</th>
                <th>x (frac)</th>
                <th>y (frac)</th>
                <th>z (frac)</th>
                <th>x (Å)</th>
                <th>y (Å)</th>
                <th>z (Å)</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {atoms?.map((atom, index) => (
                <tr key={index}>
                  <td>{atom.index}</td>
                  <td>
                    <span 
                      className="element-indicator"
                      style={{ backgroundColor: atom.color }}
                    >
                      {atom.element}
                    </span>
                  </td>
                  <td>{atom.fractional_coordinates[0].toFixed(4)}</td>
                  <td>{atom.fractional_coordinates[1].toFixed(4)}</td>
                  <td>{atom.fractional_coordinates[2].toFixed(4)}</td>
                  <td>{atom.cartesian_coordinates[0].toFixed(4)}</td>
                  <td>{atom.cartesian_coordinates[1].toFixed(4)}</td>
                  <td>{atom.cartesian_coordinates[2].toFixed(4)}</td>
                  <td>{atom.occupancy?.toFixed(3) || '1.000'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bond Information */}
      {structure?.bonds && structure.bonds.length > 0 && (
        <div className="data-section">
          <h3>Bond Information</h3>
          <div className="table-container">
            <table className="bonds-table">
              <thead>
                <tr>
                  <th>Bond</th>
                  <th>Atoms</th>
                  <th>Distance (Å)</th>
                </tr>
              </thead>
              <tbody>
                {structure.bonds.map((bond, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <span 
                        className="element-indicator"
                        style={{ backgroundColor: structure.atoms[bond.atom1_index].color }}
                      >
                        {bond.atom1_element}
                      </span>
                      - 
                      <span 
                        className="element-indicator"
                        style={{ backgroundColor: structure.atoms[bond.atom2_index].color }}
                      >
                        {bond.atom2_element}
                      </span>
                    </td>
                    <td>{bond.distance.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTables;
