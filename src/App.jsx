import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import HexFlower from './components/HexFlower';
import TileLibrary from './components/TileLibrary';
import Toast from './components/Toast';
import ConfirmationDialog from './components/ConfirmationDialog';
import SaveLoadContainer from './components/SaveLoadContainer';

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

const App = () => {
  const [tiles, setTiles] = React.useState([]);
  const [hexes, setHexes] = React.useState({});
  const [layoutSize, setLayoutSize] = React.useState('MEDIUM');
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [tileToDelete, setTileToDelete] = React.useState(null);
  const downloadableElement = document.querySelector('.flower-container');

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

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <SaveLoadContainer 
          tiles={tiles}
          hexes={hexes}
          layoutSize={layoutSize}
          setTiles={setTiles}
          setHexes={setHexes}
          setLayoutSize={setLayoutSize}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          downloadableElement={downloadableElement}
        />
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
