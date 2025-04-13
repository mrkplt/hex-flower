import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import HexFlower from './components/HexFlower';
import TileLibrary from './components/TileLibrary';
import Toast from './components/Toast';
import { toSvg } from 'html-to-image';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
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

  const handleTileDelete = (hexId) => {
    setHexes(prev => {
      const newHexes = { ...prev };
      if (newHexes[hexId]) {
        newHexes[hexId] = {
          ...newHexes[hexId],
          tile: null
        };
      }
      return newHexes;
    });
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

  const handleDownload = () => {
    const element = document.querySelector('.flower-container');

    if (element) {
      toSvg(element)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "hex-flower.png";
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
          <SaveLoadButton type="button" onClick={handleDownload}>
            Download
          </SaveLoadButton>
        </SaveLoadContainer>
        <TileLibrary tiles={tiles} onCreateClick={handleCreateTile} />
        <MainContent>
          <HexFlower 
            hexes={hexes}
            onHexDrop={handleHexDrop}
            onTileDelete={handleTileDelete}
            layoutSize={layoutSize}
          />
        </MainContent>
        {showToast && (
          <Toast message={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </AppContainer>
    </DndProvider>
  );
};

export default App;
