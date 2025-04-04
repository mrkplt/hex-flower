import React from 'react';
import styled from 'styled-components';

const HexContainer = styled.div`
  width: 100px;
  height: 115.47px;
  position: relative;
  margin: 10px;
  cursor: ${props => props.hasTile ? 'grab' : 'pointer'};

  &:active {
    cursor: ${props => props.hasTile ? 'grabbing' : 'pointer'};
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    border: 2px solid #ddd;
  }
`;

const Content = styled.div`
  position: absolute;
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

const Label = styled.div`
  font-size: 12px;
  text-align: center;
  word-wrap: break-word;
  max-width: 80%;
  z-index: 2;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
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

const Image = styled.img`
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  object-position: center;
`;

const SideLabel = styled.div`
  position: absolute;
  font-size: 10px;
  color: #666;
  z-index: 2;
  background: rgba(255, 255, 255, 0.8);
  padding: 1px 4px;
  border-radius: 2px;
  ${props => {
    switch (props.side) {
      case 'top':
        return 'top: 5px; left: 50%; transform: translateX(-50%);';
      case 'topRight':
        return 'top: 25%; right: 5px;';
      case 'bottomRight':
        return 'bottom: 25%; right: 5px;';
      case 'bottom':
        return 'bottom: 5px; left: 50%; transform: translateX(-50%);';
      case 'bottomLeft':
        return 'bottom: 25%; left: 5px;';
      case 'topLeft':
        return 'top: 25%; left: 5px;';
      default:
        return '';
    }
  }}
`;

const Hex = ({ tile, sideLabels = {}, onDrop, onDragOver, onDragStart, hexId }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    if (onDragOver) onDragOver(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop) onDrop(e);
  };

  const handleDragStart = (e) => {
    if (tile && onDragStart) {
      e.dataTransfer.setData('application/json', JSON.stringify({
        tile,
        sourceHexId: hexId
      }));
      onDragStart(e);
    }
  };

  return (
    <HexContainer
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      draggable={!!tile}
      onDragStart={handleDragStart}
      hasTile={!!tile}
    >
      <Content>
        {tile && (
          <>
            {tile.image && (
              <ImageContainer>
                <Image src={tile.image} alt={tile.text || 'Tile image'} />
              </ImageContainer>
            )}
            {tile.text && <Label>{tile.text}</Label>}
          </>
        )}
      </Content>
      {Object.entries(sideLabels).map(([side, label]) => (
        <SideLabel key={side} side={side}>
          {label}
        </SideLabel>
      ))}
    </HexContainer>
  );
};

export default Hex;
