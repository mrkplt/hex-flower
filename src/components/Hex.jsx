import React from 'react';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { getHexSize, getHexMargin } from '../constants/hexLayout';

const { width, height, contentWidth, contentHeight } = getHexSize();
const margin = getHexMargin();

const HexContainer = styled.div`
  width: ${width}px;
  height: ${height}px;
  position: relative;
  margin: ${margin}px;
  cursor: ${props => props.hasTile ? 'grab' : 'pointer'};
  opacity: ${props => props.isDragging ? 0.5 : 1};
  transform: translate(${props => `${props.offset}px, ${props.verticalOffset}px`});

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
    background: ${props => props.isOver ? (props.hasTile ? '#ffd700' : '#e0e0e0') : '#f0f0f0'};
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    border: 2px solid ${props => props.isOver ? '#ffd700' : '#ddd'};
    transition: all 0.2s ease;
  }

  &:hover:before {
    box-shadow: ${props => props.hasTile ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'};
  }

  // Ensure the container itself matches the hex shape
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
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
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
`;

const Interior = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
`;

const Label = styled.div`
  font-size: 12px;
  text-align: center;
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
        return `top: 0; left: 50%; transform: translateX(-50%);`;
      case 'topRight':
        return `top: 25%; right: 0;`;
      case 'bottomRight':
        return `bottom: 25%; right: 0;`;
      case 'bottom':
        return `bottom: 0; left: 50%; transform: translateX(-50%);`;
      case 'bottomLeft':
        return `bottom: 25%; left: 0;`;
      case 'topLeft':
        return `top: 25%; left: 0;`;
      default:
        return '';
    }
  }}
`;

const Hex = ({ tile, sideLabels = {}, hexId, onMoveTile, offset = 0, verticalOffset = 0 }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.HEX_TILE,
    item: () => ({ hexId, tile }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !!tile
  });

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.HEX_TILE, ItemTypes.LIBRARY_TILE],
    drop: (item, monitor) => {
      if (item.hexId !== hexId) {
        onMoveTile(item.hexId || null, hexId, item.tile);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = (node) => {
    drag(drop(node));
  };

  return (
    <HexContainer
      className="hex-container"
      ref={ref}
      hasTile={!!tile}
      isDragging={isDragging}
      isOver={isOver}
      offset={offset}
      verticalOffset={verticalOffset}
    >
      <Content className="hex-content">
        {tile && (
          <Interior style={{ backgroundColor: tile.color }}>
            {tile.image && (
              <ImageContainer className="image-container">
                <Image src={tile.image} alt={tile.text || 'Tile image'} className="image" />
              </ImageContainer>
            )}
            {tile.text && <Label color={tile.color} className="label">{tile.text}</Label>}
          </Interior>
        )}
        {Object.entries(sideLabels).map(([side, label]) => (
          <SideLabel
            key={side}
            side={side}
            label={label}
            className="side-label"
          />
        ))}
      </Content>
    </HexContainer>
  );
};

export default Hex;
