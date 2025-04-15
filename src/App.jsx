import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import HexFlower from './components/HexFlower';
import TileLibrary from './components/TileLibrary';
import Toast from './components/Toast';
import ConfirmationDialog from './components/ConfirmationDialog';
import { toSvg, toCanvas } from 'html-to-image';
import { jsPDF } from "jspdf";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const InfoButton = styled.a`
  position: fixed;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6c6;
    transform: scale(1.1);
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 20px;
`;

const SaveLoadContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
`;

const SaveLoadButton = styled.button`
  width: 90px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: ${props => props.type === 'save' ? '#4CAF50' : props.type === 'download' ? '#2196F3' : props.type === 'load' ? '#4285F4' : '#4285F4'};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 14px;

  &:hover {
    background: ${props => props.type === 'save' ? '#4CAF50' : props.type === 'download' ? '#1976D2' : props.type === 'load' ? '#357ABE' : '#357ABE'};
  }

  &:focus,
  &:focus-visible {
    outline: 2px solid ${props => props.type === 'save' ? '#4CAF50' : props.type === 'download' ? '#1976D2' : props.type === 'load' ? '#357ABE' : '#357ABE'};
    outline-offset: 2px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const App = () => {
  const [tiles, setTiles] = React.useState([]);
  const [hexes, setHexes] = React.useState({});
  const [layoutSize, setLayoutSize] = React.useState('MEDIUM');
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [tileToDelete, setTileToDelete] = React.useState(null);
  const dowloadableElement = document.querySelector('.flower-container');

  const handleCreateTile = (newTile) => {
    setTiles(prev => [...prev, newTile]);
  };

  const handleHexDrop = (sourceHexId, targetHexId, tile) => {
    if (tile?.type === 'layout') {
      setLayoutSize(tile.size);
      // Reset hexes to empty state when changing layout
      setHexes({});
      return;
    }

    setHexes(prev => {
      const newHexes = { ...prev };

      if (!sourceHexId) {
        newHexes[targetHexId] = {
          ...newHexes[targetHexId],
          tile: { ...tile }
        };
      } else if (!newHexes[targetHexId]?.tile) {
        const sourceTile = newHexes[sourceHexId]?.tile;
        
        if (!sourceTile) return prev;

        newHexes[sourceHexId] = {
          ...newHexes[sourceHexId]
        };
        delete newHexes[sourceHexId].tile;

        newHexes[targetHexId] = {
          ...newHexes[targetHexId],
          tile: sourceTile
        };
      } else {
        const sourceTile = newHexes[sourceHexId]?.tile;
        const targetTile = newHexes[targetHexId]?.tile;

        if (!sourceTile || !targetTile) return prev;

        newHexes[sourceHexId] = {
          ...newHexes[sourceHexId],
          tile: targetTile
        };

        newHexes[targetHexId] = {
          ...newHexes[targetHexId],
          tile: sourceTile
        };
      }

      return newHexes;
    });
  };

  const handleTileDelete = (id) => {
    // Check if this is a hex tile ID
    if (Object.keys(hexes).includes(id)) {
      // This is a hex tile ID
      setHexes(prev => {
        const newHexes = { ...prev };
        if (newHexes[id]) {
          newHexes[id] = {
            ...newHexes[id],
            tile: null
          };
        }
        return newHexes;
      });
    } else {
      // This is a library tile ID
      // Check if the tile has instances in the hex grid
      const hasInstances = Object.values(hexes).some(hex => hex.tile?.id === id);
      
      if (hasInstances) {
        setTileToDelete(id);
        setShowConfirmation(true);
      } else {
        // No instances, just delete the library tile
        setTiles(prev => prev.filter(tile => tile.id !== id));
      }
    }
  };

  const handleConfirmDelete = () => {
    if (tileToDelete) {
      // Remove from library
      setTiles(prev => prev.filter(tile => tile.id !== tileToDelete));
      
      // Remove all instances from hex grid
      setHexes(prev => {
        const newHexes = { ...prev };
        Object.keys(newHexes).forEach(hexId => {
          if (newHexes[hexId]?.tile?.id === tileToDelete) {
            newHexes[hexId] = {
              ...newHexes[hexId],
              tile: null
            };
          }
        });
        return newHexes;
      });
    }
    setShowConfirmation(false);
    setTileToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setTileToDelete(null);
  };

  const handleSave = async () => {
    try {
      // Convert all image URLs to base64
      const tilesWithBase64 = await Promise.all(
        tiles.map(async (tile) => {
          if (tile.image) {
            try {
              const response = await fetch(tile.image);
              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
              }
              const blob = await response.blob();
              const reader = new FileReader();
              
              return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                  resolve({
                    ...tile,
                    image: reader.result
                  });
                };
                reader.onerror = () => {
                  reject(new Error('Failed to read image'));
                };
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error('Error processing image:', error);
              return {
                ...tile,
                image: null
              };
            }
          }
          return tile;
        })
      );

      const saveData = {
        tiles: tilesWithBase64,
        hexes,
        layoutSize
      };
      
      // Create a blob from the JSON data
      const blob = new Blob([JSON.stringify(saveData)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hex-flower-state.json';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setToastMessage('State saved successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error saving state:', error);
      setToastMessage(`Failed to save state: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleLoad = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setToastMessage('No file selected');
      setShowToast(true);
      return;
    }

    try {
      const text = await file.text();
      const { tiles: savedTiles, hexes: savedHexes, layoutSize: savedLayoutSize } = JSON.parse(text);
      
      // Validate the saved state
      if (!Array.isArray(savedTiles) || typeof savedHexes !== 'object') {
        throw new Error('Invalid saved state format');
      }

      // Reset the state completely
      setTiles([]);
      setHexes({});
      
      // Set the new state
      setTiles(savedTiles);
      setHexes(savedHexes);
      setLayoutSize(savedLayoutSize || 'MEDIUM');

      setToastMessage('State loaded successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error loading state:', error);
      setToastMessage(`Failed to load state: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleSVGDownload = () => {
    if (dowloadableElement) {
      toSvg(dowloadableElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "hex-flower.svg";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Error converting to image:', err);
          setToastMessage('Error downloading image');
          setShowToast(true);
        });
    }
  };

  const handlePDFDownload = () => {
    if (dowloadableElement) {
      // Convert directly to canvas
      toCanvas(dowloadableElement)
        .then((canvas) => {
          // Create PDF in landscape orientation
          const pdf = new jsPDF('l');
          
          // Get PDF page dimensions
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          // Calculate scaling factor to fit image within PDF page
          const widthRatio = pdfWidth / canvas.width;
          const heightRatio = pdfHeight / canvas.height;
          const scaleFactor = Math.min(widthRatio, heightRatio) * 0.95;
          
          // Calculate centered position
          const x = (pdfWidth - (canvas.width * scaleFactor)) / 2;
          const y = (pdfHeight - (canvas.height * scaleFactor)) / 2;
          
          // Convert canvas to PNG data URL
          const pngDataUrl = canvas.toDataURL('image/png');
          
          // Add image to PDF
          pdf.addImage(pngDataUrl, 'PNG', x, y, canvas.width * scaleFactor, canvas.height * scaleFactor);
          
          // Save the PDF
          pdf.save('hex-flower.pdf');
        })
        .catch((err) => {
          console.error('Error creating PDF:', err);
          setToastMessage('Error creating PDF');
          setShowToast(true);
        });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <SaveLoadContainer>
          <SaveLoadButton type="button" onClick={handleSave}>
            Save
          </SaveLoadButton>
          <FileInput
            type="file"
            accept="application/json"
            onChange={handleLoad}
          />
          <SaveLoadButton type="button" onClick={(e) => e.currentTarget.previousElementSibling.click()}>
            Load
          </SaveLoadButton>
          <SaveLoadButton type="button" onClick={handleSVGDownload}>
            SVG
          </SaveLoadButton>
          <SaveLoadButton type="button" onClick={handlePDFDownload}>
            PDF
          </SaveLoadButton>
          <InfoButton 
            href="https://github.com/mrkplt/hex-flower" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Github"
          >
            i
          </InfoButton>
        </SaveLoadContainer>
        <TileLibrary 
          tiles={tiles} 
          onCreateClick={handleCreateTile}
          onTileDelete={handleTileDelete}
        />
        <MainContent>
          <HexFlower 
            hexes={hexes}
            onHexDrop={handleHexDrop}
            onTileDelete={handleTileDelete}
            layoutSize={layoutSize}
          />
        </MainContent>
        <ConfirmationDialog
          isOpen={showConfirmation}
          message="This tile has instances in the hex grid. Are you sure you want to delete all instances?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
        {showToast && (
          <Toast message={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </AppContainer>
    </DndProvider>
  );
};

export default App;
