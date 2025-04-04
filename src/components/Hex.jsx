import React from 'react';
import styled from 'styled-components';

const HexContainer = styled.div`
  width: 100px;
  height: 115.47px; // height = width * sqrt(3)/2
  position: relative;
  margin: 10px;
  cursor: pointer;

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
`;

const Label = styled.div`
  font-size: 12px;
  text-align: center;
  word-wrap: break-word;
  max-width: 80%;
`;

const Image = styled.img`
  max-width: 80%;
  max-height: 60%;
  object-fit: contain;
`;

const SideLabel = styled.div`
  position: absolute;
  font-size: 10px;
  color: #666;
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

const Hex = ({ tile, sideLabels = {}, onDrop, onDragOver }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    if (onDragOver) onDragOver(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop) onDrop(e);
  };

  return (
    <HexContainer
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Content>
        {tile && (
          <>
            {tile.image && <Image src={tile.image} alt={tile.text || 'Tile image'} />}
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
