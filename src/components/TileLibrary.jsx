import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import { getHexDimensions } from '../constants/hexLayout';
import TileCreator from './TileCreator';
import { SketchPicker } from 'react-color';

const { width, height } = getHexDimensions();

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
  width: ${width}px;
  height: ${height}px;
  cursor: grab;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);

  &:active {
    cursor: grabbing;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }
`;

const TileContent = styled.div`
  height: 100%;
  background: black;
`;

const Interior = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  content: '';
  top: 1px;
  left: 1px;
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  transition: all 0.2s ease;

  &:hover {
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
`;

const TileImage = styled.img`
  min-width: 100%;
  object-fit: cover;
`;

const TileText = styled.div`
  font-size: 16px;
  word-wrap: break-word;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => {
    // Convert hex color to RGB
    const r = parseInt(props.color.slice(1, 3), 16);
    const g = parseInt(props.color.slice(3, 5), 16);
    const b = parseInt(props.color.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white text for dark colors, black text for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }};
  text-align: center;
  width: 80%;
  max-width: 100%;
`;

const CreateButton = styled.button`
  width: ${width}px;
  height: ${height}px;
  position: relative;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  min-height: ${height}px;
  max-height: ${height}px;
  
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
    background: #6c6
  }
`;

const Dialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
`;

const DialogContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TextForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: white;
  
  &.secondary {
    background: #f44336;
  }
  
  &.primary {
    background: #4CAF50;
  }
  
  &:hover {
    &.secondary {
      background: #d32f2f;
    }
    
    &.primary {
      background: #45a049;
    }
  }
`;

const ColorForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const ColorButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: ${props => {
    const r = parseInt(props.style.backgroundColor.slice(1, 3), 16);
    const g = parseInt(props.style.backgroundColor.slice(3, 5), 16);
    const b = parseInt(props.style.backgroundColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white text for dark colors, black text for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }};
  
  &:hover {
    opacity: 0.9;
  }
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  top: -100%;
  left: 100%;
  transform: translate(-100%, 0);
  z-index: 1001;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: scale(1.2);
  transform-origin: top left;
  padding: 6px;
  border: 1px solid #e0e0e0;
`;

const ColorPickerContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 0px;
`;

const ColorPickerButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  width: 100%;
  padding-right: 8px;
`;

const ColorPickerButton = styled.button`
  padding: 3px 6px;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  font-size: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }

  &:active {
    background: #dcdcdc;
  }

  &.primary {
    background: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
    }

    &:active {
      background: #409145;
    }
  }
`;

const DraggableTile = ({ tile, onTileDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LIBRARY_TILE,
    item: { tile },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Tile ref={drag} isDragging={isDragging}>
      <TileContent>
        <Interior style={{ backgroundColor: tile.color }}>
          {tile.image && (
            <ImageContainer>
              <TileImage src={tile.image} alt={tile.text || 'Tile image'} />
            </ImageContainer>
          )}
          {tile.text && <TileText color={tile.color}>{tile.text}</TileText>}
        </Interior>
      </TileContent>
    </Tile>
  );
};

const TileLibrary = ({ tiles, onCreateClick, onTileDelete }) => {
  const [showTileCreator, setShowTileCreator] = React.useState(false);

  const handleSaveTile = (tileData) => {
    const newTile = {
      id: crypto.randomUUID(),
      ...tileData
    };
    onCreateClick(newTile);
    setShowTileCreator(false);
  };

  const handleCancelTile = () => {
    setShowTileCreator(false);
  };

  return (
    <LibraryContainer>
      <CreateButton onClick={() => setShowTileCreator(true)}>➕</CreateButton>
      {showTileCreator && (
        <TileCreator
          isOpen={showTileCreator}
          onClose={handleCancelTile}
          onSave={handleSaveTile}
        />
      )}
      <TileContainer>
        {tiles.map((tile) => (
          <DraggableTile key={tile.id} tile={tile} onTileDelete={onTileDelete} />
        ))}
      </TileContainer>
    </LibraryContainer>
  );
};

export default TileLibrary;
