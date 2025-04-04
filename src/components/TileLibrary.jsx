import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';

const LibraryContainer = styled.div`
  width: 250px;
  height: 100%;
  background: #f5f5f5;
  padding: 20px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const TileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  overflow-y: auto;
  padding: 10px;
  justify-content: center;
`;

const Tile = styled.div`
  width: 100px;
  height: 115.47px;
  position: relative;
  cursor: grab;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    border: 2px solid #ddd;
    transition: box-shadow 0.2s ease;
  }

  &:hover:before {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  &:active {
    cursor: grabbing;
  }
`;

const TileContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  overflow: hidden;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
`;

const ImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const TileImage = styled.img`
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  object-position: center;
`;

const TileText = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
  word-wrap: break-word;
  max-width: 80%;
  z-index: 2;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
`;

const CreateButton = styled.button`
  width: 100px;
  height: 115.47px;
  position: relative;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #4CAF50;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    transition: all 0.2s ease;
  }

  &:after {
    content: '+';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    color: white;
    z-index: 1;
  }

  &:hover:before {
    background: #45a049;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  &:focus {
    outline: none;
  }

  &:focus:before {
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
  }
`;

const DraggableTile = ({ tile }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TILE,
    item: () => {
      // Create a new copy of the tile with a unique ID
      return {
        tile: {
          ...tile,
          id: crypto.randomUUID(), // Generate a new unique ID for each drag
          originalId: tile.id, // Keep track of the original tile ID
        }
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Tile ref={drag} isDragging={isDragging}>
      <TileContent>
        {tile.image && (
          <ImageContainer>
            <TileImage src={tile.image} alt={tile.text || 'Tile image'} />
          </ImageContainer>
        )}
        {tile.text && <TileText>{tile.text}</TileText>}
      </TileContent>
    </Tile>
  );
};

const TileLibrary = ({ tiles, onCreateClick }) => {
  return (
    <LibraryContainer>
      <CreateButton onClick={onCreateClick} aria-label="Create New Tile" />
      <TileContainer>
        {tiles.map((tile) => (
          <DraggableTile key={tile.id} tile={tile} />
        ))}
      </TileContainer>
    </LibraryContainer>
  );
};

export default TileLibrary;
