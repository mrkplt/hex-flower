import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import HexFlower from './components/HexFlower';
import TileLibrary from './components/TileLibrary';
import { v4 as uuidv4 } from 'uuid';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
`;

const App = () => {
  const [tiles, setTiles] = React.useState([]);
  const [hexes, setHexes] = React.useState({});

  const handleCreateTile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newTile = {
            id: uuidv4(),
            image: event.target.result,
            text: prompt('Enter text for the tile:') || ''
          };
          setTiles(prev => [...prev, newTile]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleHexDrop = (rowIndex, hexIndex, tile) => {
    const hexId = `${rowIndex}-${hexIndex}`;
    setHexes(prev => ({
      ...prev,
      [hexId]: {
        ...prev[hexId],
        tile: tile ? { ...tile } : null // Create a new copy of the tile
      }
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <TileLibrary tiles={tiles} onCreateClick={handleCreateTile} />
        <MainContent>
          <HexFlower hexes={hexes} onHexDrop={handleHexDrop} />
        </MainContent>
      </AppContainer>
    </DndProvider>
  );
};

export default App;
