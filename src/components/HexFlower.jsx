import React from 'react';
import styled from 'styled-components';
import { ItemTypes } from '../constants';
import Hex from './Hex';
import TrashZone from './TrashZone';
import { getFlowerLayout, getHexDimensions } from '../constants/hexLayout';

const { width, height, rowOffset, rowSpacing } = getHexDimensions();

const FlowerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const HexRow = styled.div`
  display: flex;
  margin-bottom: ${rowSpacing}px;
`;

const LayoutToggleContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 370px;
  display: flex;
  gap: 10px;
  z-index: 900;
`;

const LayoutToggle = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: ${props => props.isActive ? '#4CAF50' : '#f5f5f5'};
  color: ${props => props.isActive ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isActive ? '#4CAF50' : '#e0e0e0'};
  }
`;

const HexFlower = ({ hexes, onHexDrop, onTileDelete, layoutSize }) => {
  const layout = getFlowerLayout(layoutSize);
  const { width, height, rowOffset, rowSpacing } = getHexDimensions();

  const handleMoveTile = (sourceHexId, targetHexId, tile) => {
    if (sourceHexId === targetHexId) return;
    onHexDrop(sourceHexId, targetHexId, tile);
  };

  return (
    <div className="hex-flower">
      <FlowerContainer className="flower-container">
        {layout.map((hexCount, rowIndex) => (
          <HexRow
            key={rowIndex}
            offset={rowIndex % 2 === 1 ? rowOffset : 0}
            className="hex-row"
          >
            {Array.from({ length: hexCount }).map((_, hexIndex) => {
              const hexId = `${rowIndex}-${hexIndex}`;
              const hex = hexes[hexId] || {};
              const tile = hex.tile;

              return (
                <Hex
                  key={hexId}
                  hexId={hexId}
                  tile={tile}
                  sideLabels={hex.sideLabels}
                  onMoveTile={handleMoveTile}
                  offset={rowIndex % 2 === 1 ? rowOffset : 0}
                  verticalOffset={rowIndex * (height + rowSpacing)}
                  className="hex-container"
                />
              );
            })}
          </HexRow>
        ))}
      </FlowerContainer>

      <TrashZone onTileDelete={onTileDelete} />

      <LayoutToggleContainer>
        <LayoutToggle 
          isActive={layoutSize === 'SMALL'}
          onClick={() => onHexDrop(null, null, { type: 'layout', size: 'SMALL' })}
        >
          Small
        </LayoutToggle>
        <LayoutToggle 
          isActive={layoutSize === 'MEDIUM'}
          onClick={() => onHexDrop(null, null, { type: 'layout', size: 'MEDIUM' })}
        >
          Medium
        </LayoutToggle>
        <LayoutToggle 
          isActive={layoutSize === 'LARGE'}
          onClick={() => onHexDrop(null, null, { type: 'layout', size: 'LARGE' })}
        >
          Large
        </LayoutToggle>
      </LayoutToggleContainer>
    </div>
  );
};

export default HexFlower;
