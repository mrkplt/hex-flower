import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import TileForm from './TileForm';

const LibraryContainer = styled.div`
  width: 350px;
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
  gap: 35px;
  overflow-y: auto;
  padding: 10px;
  justify-content: center;
  align-items: flex-start;
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
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
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
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
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
  padding: 2px 6px;
  border-radius: 4px;
`;

const CreateButton = styled.button`
  width: 100px;
  height: 115.47px;
  position: relative;
  cursor: pointer;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #4CAF50;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    transition: all 0.2s ease;
  }

  &:after {
    content: '➕';
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
    type: ItemTypes.LIBRARY_TILE,
    item: { tile },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Tile ref={drag} isDragging={isDragging}>
      <TileContent>
        <ImageContainer>
          <TileImage src={tile.image} alt={tile.text || 'Tile image'} />
        </ImageContainer>
        {tile.text && <TileText>{tile.text}</TileText>}
      </TileContent>
    </Tile>
  );
};

const TileLibrary = ({ tiles, onCreateClick }) => {
  const [showForm, setShowForm] = React.useState(false);

  const handleCreateTile = async (formData) => {
    if (formData.imageFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const newTile = {
          id: crypto.randomUUID(),
          image: event.target.result
        };
        if (formData.imageName) {
          newTile.text = formData.imageName;
        }
        onCreateClick(newTile);
      };
      reader.readAsDataURL(formData.imageFile);
    } else {
      const newTile = {
        id: crypto.randomUUID(),
        text: formData.imageName
      };
      onCreateClick(newTile);
    }
  };

  return (
    <LibraryContainer>
      <CreateButton onClick={() => setShowForm(true)}>➕</CreateButton>
      {showForm && (
        <TileForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateTile}
        />
      )}
      <TileContainer>
        {tiles.map((tile) => (
          <DraggableTile key={tile.id} tile={tile} />
        ))}
      </TileContainer>
    </LibraryContainer>
  );
};

export default TileLibrary;
