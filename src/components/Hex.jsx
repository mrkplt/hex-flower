import React from 'react';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';

const HexContainer = styled.div`
  width: 100px;
  height: 115.47px;
  position: relative;
  margin: 10px;
  cursor: ${props => props.hasTile ? 'grab' : 'pointer'};
  opacity: ${props => props.isDragging ? 0.5 : 1};

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
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    border: 2px solid ${props => props.isOver ? '#ffd700' : '#ddd'};
    transition: all 0.2s ease;
  }

  &:hover:before {
    box-shadow: ${props => props.hasTile ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'};
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
  transition: transform 0.2s ease;
  transform: ${props => props.isOver ? 'scale(0.95)' : 'scale(1)'};
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

const Hex = ({ tile, sideLabels = {}, hexId, onMoveTile }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.HEX_TILE,
    item: () => ({ hexId, tile }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !!tile,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult) {
        // If the tile wasn't dropped anywhere, return it to its original hex
        onMoveTile(hexId, hexId, tile);
      }
    }
  });

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.HEX_TILE, ItemTypes.LIBRARY_TILE],
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop && item.hexId !== hexId) {
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
      ref={ref}
      hasTile={!!tile}
      isDragging={isDragging}
      isOver={isOver}
    >
      <Content isOver={isOver}>
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
