import React, { useState, useEffect } from 'react';
import CrystalViewer from './components/CrystalViewer';
import FileUpload from './components/FileUpload';
import Controls from './components/Controls';
import DataTables from './components/DataTables';
import './App.css';

function App() {
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableElements, setAvailableElements] = useState([]);
  
  const [visibility, setVisibility] = useState({
    atoms: true,
    bonds: true,
    unitCell: true
  });

  const [elementVisibility, setElementVisibility] = useState({});

  // Update available elements and element visibility when structure changes
  useEffect(() => {
    if (structure?.atoms) {
      const elements = [...new Set(structure.atoms.map(atom => atom.element))];
      setAvailableElements(elements);
      
      // Initialize element visibility
      const initialVisibility = {};
      elements.forEach(element => {
        initialVisibility[element] = true;
      });
      setElementVisibility(initialVisibility);
    } else {
      setAvailableElements([]);
      setElementVisibility({});
    }
  }, [structure]);

  const handleFileUpload = (data) => {
    setStructure(data);
    setLoading(false);
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Crystal Structure Visualizer</h1>
        <p>Upload CIF files to visualize crystal structures in 3D</p>
      </header>

      <main className="app-main">
        {!structure ? (
          <div className="upload-section">
            <FileUpload 
              onFileUpload={handleFileUpload} 
              loading={loading}
            />
          </div>
        ) : (
          <div className="visualization-section">
            <div className="left-panel">
              <div className="controls-panel">
                <Controls
                  visibility={visibility}
                  setVisibility={setVisibility}
                  elementVisibility={elementVisibility}
                  setElementVisibility={setElementVisibility}
                  availableElements={availableElements}
                />
              </div>
              
              <div className="data-panel">
                <DataTables structure={structure} />
              </div>
            </div>
            
            <div className="right-panel">
              <div className="viewer-panel">
                <CrystalViewer
                  structure={structure}
                  visibility={visibility}
                  elementVisibility={elementVisibility}
                />
              </div>
              
              <div className="actions-panel">
                <button 
                  className="action-button"
                  onClick={() => setStructure(null)}
                >
                  Upload New File
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
