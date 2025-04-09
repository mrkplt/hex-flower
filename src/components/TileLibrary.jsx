import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import { getHexSize } from '../constants/hexLayout';
import ImageEditor from './ImageEditor';
import { ChromePicker } from 'react-color';

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

const Interior = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
        <Interior style={{ backgroundColor: tile.color }}>
          {tile.image && (
            <ImageContainer>
              <TileImage src={tile.image} alt={tile.text || 'Tile image'} />
            </ImageContainer>
          )}
          {tile.text && <TileText>{tile.text}</TileText>}
        </Interior>
      </TileContent>
    </Tile>
  );
};

const CreateTileDialog = ({ onClose }) => {
  const [text, setText] = React.useState('');
  const [color, setColor] = React.useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const handleChooseImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        onClose({
          type: 'image',
          file: e.target.files[0],
          text,
          color
        });
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (text.trim()) {
      onClose({
        type: 'text',
        text,
        color
      });
    }
  };

  return (
    <Dialog>
      <DialogTitle>Create New Tile</DialogTitle>
      <DialogContent>
        <TextForm>
          <Label>Tile Text:</Label>
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter tile text"
          />
        </TextForm>

        <ColorForm>
          <ColorButton
            style={{ backgroundColor: color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            {showColorPicker ? '✓' : '🎨'}
          </ColorButton>
          {showColorPicker && (
            <ColorPickerWrapper>
              <ChromePicker
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </ColorPickerWrapper>
          )}
        </ColorForm>

        <ButtonGroup>
          <Button className="secondary" onClick={handleChooseImage}>Choose Image</Button>
          <Button className="secondary" onClick={() => onClose(null)}>Cancel</Button>
          <Button className="primary" onClick={handleSave}>Save</Button>
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

const TileLibrary = ({ tiles, onCreateClick }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const [imageFile, setImageFile] = React.useState(null);
  const [tileData, setTileData] = React.useState(null);

  const handleCreateTile = (data) => {
    if (data) {
      if (data.type === 'image') {
        setImageFile(data.file);
        setShowEditor(true);
        setTileData(data);
      } else {
        const newTile = {
          id: crypto.randomUUID(),
          text: data.text,
          color: data.color
        };
        onCreateClick(newTile);
      }
    }
    setShowDialog(false);
  };

  const handleEditorSave = (editedImage) => {
    if (tileData) {
      const newTile = {
        id: crypto.randomUUID(),
        image: editedImage,
        text: tileData.text,
        color: tileData.color
      };
      onCreateClick(newTile);
    }
    setShowEditor(false);
  };

  const handleEditorCancel = () => {
    setImageFile(null);
    setShowEditor(false);
  };

  return (
    <LibraryContainer>
      <CreateButton onClick={() => setShowDialog(true)}>➕</CreateButton>
      {showDialog && (
        <CreateTileDialog onClose={handleCreateTile} />
      )}
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
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1001;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export default TileLibrary;
