import React from 'react';
import styled from 'styled-components';
import Hex from './Hex';
import TrashZone from './TrashZone';
import { getFlowerLayout, getHexDimensions } from '../constants/hexLayout';
import LayoutConfirmation from './LayoutConfirmation';
import { GREEN, SNOW, GAINSBORO, WHITE, DARK_CHARCOAL } from '../constants/colors';

const FlowerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const HexRow = styled.div`
  display: flex;
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
  width: 90px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: ${props => props.$isActive ? GREEN : SNOW};
  color: ${props => props.$isActive ? WHITE : DARK_CHARCOAL};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 14px;

  &:hover {
    background: ${props => props.$isActive ? GREEN : GAINSBORO};
  }
`;

const HexFlower = ({ hexes, onHexDrop, onTileDelete, layoutSize }) => {
  const elementRef = React.useRef(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingLayout, setPendingLayout] = React.useState(null);

  const handleLayoutChange = (size) => {
    // Check if any hex has a tile
    const hasTiles = Object.values(hexes).some(hex => hex.tile);
    
    if (hasTiles) {
      setPendingLayout(size);
      setShowConfirmation(true);
    } else {
      // No tiles present, proceed with layout change immediately
      onHexDrop(null, null, { type: 'layout', size });
    }
  };

  const confirmLayoutChange = (size) => {
    onHexDrop(null, null, { type: 'layout', size });
    setShowConfirmation(false);
  };

  const layout = getFlowerLayout(layoutSize);
  const { height, rowSpacing } = getHexDimensions();

  const handleMoveTile = (sourceHexId, targetHexId, tile) => {
    if (sourceHexId === targetHexId) return;
    onHexDrop(sourceHexId, targetHexId, tile);
  };

  return (
    <div className="hex-flower" ref={elementRef}>
      <FlowerContainer className="flower-container">
        {layout.map((hexCount, rowIndex) => (
          <HexRow
            key={rowIndex}
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
                  onMoveTile={handleMoveTile}
                  verticalOffset={rowIndex * (height + (2 * rowSpacing))}
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
          $isActive={layoutSize === 'SMALL'}
          onClick={() => handleLayoutChange('SMALL')}
        >
          Small
        </LayoutToggle>
        <LayoutToggle 
          $isActive={layoutSize === 'MEDIUM'}
          onClick={() => handleLayoutChange('MEDIUM')}
        >
          Medium
        </LayoutToggle>
        <LayoutToggle 
          $isActive={layoutSize === 'LARGE'}
          onClick={() => handleLayoutChange('LARGE')}
        >
          Large
        </LayoutToggle>
      </LayoutToggleContainer>

      <LayoutConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmLayoutChange}
        layoutSize={pendingLayout}
      />
    </div>
  );
};

export default HexFlower;
