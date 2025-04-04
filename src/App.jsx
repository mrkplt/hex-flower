import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import HexFlower from './components/HexFlower';
import TileLibrary from './components/TileLibrary';
import TileCreator from './components/TileCreator';

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

function App() {
  const [tiles, setTiles] = useState([]);
  const [hexes, setHexes] = useState({});
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleCreateTile = (tileData) => {
    const newTile = {
      id: uuidv4(),
      ...tileData
    };
    setTiles([...tiles, newTile]);
    setIsCreatorOpen(false);
  };

  const handleHexDrop = (rowIndex, hexIndex, tileData) => {
    const hexId = `${rowIndex}-${hexIndex}`;
    setHexes({
      ...hexes,
      [hexId]: {
        ...hexes[hexId],
        tile: tileData
      }
    });
  };

  const updateHexSideLabel = (hexId, side, label) => {
    setHexes({
      ...hexes,
      [hexId]: {
        ...hexes[hexId],
        sideLabels: {
          ...(hexes[hexId]?.sideLabels || {}),
          [side]: label
        }
      }
    });
  };

  return (
    <AppContainer>
      <TileLibrary
        tiles={tiles}
        onCreateClick={() => setIsCreatorOpen(true)}
      />
      <MainContent>
        <HexFlower
          hexes={hexes}
          onHexDrop={handleHexDrop}
        />
      </MainContent>
      <TileCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSave={handleCreateTile}
      />
    </AppContainer>
  );
}

export default App;
