import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import { getHexSize } from '../constants/hexLayout';
import ImageEditor from './ImageEditor';

const { width: HEX_WIDTH, height: HEX_HEIGHT } = getHexSize();

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
  width: ${HEX_WIDTH}px;
  height: ${HEX_HEIGHT}px;
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
  width: ${HEX_WIDTH}px;
  height: ${HEX_HEIGHT}px;
  position: relative;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  
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
  const [showEditor, setShowEditor] = React.useState(false);
  const [imageFile, setImageFile] = React.useState(null);
  const [imageName, setImageName] = React.useState('');
  const [editedImage, setEditedImage] = React.useState(null);

  const handleCreateTile = async (formData) => {
    if (formData.imageFile) {
      const newTile = {
        id: crypto.randomUUID(),
        image: formData.imageFile
      };
      if (formData.imageName) {
        newTile.text = formData.imageName;
      }
      onCreateClick(newTile);
    } else {
      const newTile = {
        id: crypto.randomUUID(),
        text: formData.imageName
      };
      onCreateClick(newTile);
    }
  };

  const handleEditorSave = (editedImage) => {
    setEditedImage(editedImage);
    setShowEditor(false);
    handleCreateTile({
      imageFile: editedImage,
      imageName
    });
  };

  const handleEditorCancel = () => {
    setImageFile(null);
    setEditedImage(null);
    setShowEditor(false);
  };

  const handleImageClick = (event) => {
    event.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
        setShowEditor(true);
      }
    };
    input.click();
  };

  return (
    <LibraryContainer>
      <CreateButton onClick={handleImageClick}>➕</CreateButton>
      {showEditor && (
        <ImageEditor
          image={imageFile}
          onSave={handleEditorSave}
          onCancel={handleEditorCancel}
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
