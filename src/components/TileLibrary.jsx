import React from 'react';
import styled from 'styled-components';

const LibraryContainer = styled.div`
  width: 250px;
  height: 100%;
  background: #f5f5f5;
  padding: 20px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;
`;

const Tile = styled.div`
  width: 100px;
  height: 100px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:hover {
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

const TileImage = styled.img`
  max-width: 80%;
  max-height: 60%;
  object-fit: contain;
`;

const TileText = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
  word-wrap: break-word;
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #45a049;
  }
`;

const TileLibrary = ({ tiles, onCreateClick }) => {
  const handleDragStart = (e, tile) => {
    e.dataTransfer.setData('application/json', JSON.stringify(tile));
  };

  return (
    <LibraryContainer>
      <CreateButton onClick={onCreateClick}>Create New Tile</CreateButton>
      <TileContainer>
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            draggable
            onDragStart={(e) => handleDragStart(e, tile)}
          >
            {tile.image && <TileImage src={tile.image} alt={tile.text || 'Tile image'} />}
            {tile.text && <TileText>{tile.text}</TileText>}
          </Tile>
        ))}
      </TileContainer>
    </LibraryContainer>
  );
};

export default TileLibrary;
