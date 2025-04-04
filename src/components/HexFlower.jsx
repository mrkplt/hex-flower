import React from 'react';
import styled from 'styled-components';
import Hex from './Hex';

const FlowerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const HexRow = styled.div`
  display: flex;
  &:nth-child(even) {
    margin-left: 55px;
  }
`;

const DropZone = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 115.47px;
  opacity: 0.5;
  transition: all 0.2s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ff4444;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    border: 2px dashed #aa0000;
  }

  &:after {
    content: '🗑️';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    z-index: 1;
  }

  &.drag-over {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const HexFlower = ({ hexes, onHexDrop }) => {
  // Hex flower layout pattern (19 hexes total):
  // Row 1: 2 hexes
  // Row 2: 3 hexes
  // Row 3: 4 hexes
  // Row 4: 3 hexes
  // Row 5: 2 hexes
  const layout = [4, 5, 6, 7, 6, 5, 4];
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const handleDrop = (rowIndex, hexIndex) => (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    // If the data has a sourceHexId, it's a reorder operation
    if (data.sourceHexId) {
      const targetHexId = `${rowIndex}-${hexIndex}`;
      if (data.sourceHexId !== targetHexId) {
        // Swap tiles between source and target
        const sourceTile = hexes[data.sourceHexId]?.tile;
        const targetTile = hexes[targetHexId]?.tile;
        
        onHexDrop(rowIndex, hexIndex, sourceTile);
        
        // If there was a tile in the target, move it to the source position
        if (targetTile) {
          const [sourceRow, sourceIndex] = data.sourceHexId.split('-');
          onHexDrop(parseInt(sourceRow), parseInt(sourceIndex), targetTile);
        } else {
          // If target was empty, remove the tile from the source
          const [sourceRow, sourceIndex] = data.sourceHexId.split('-');
          onHexDrop(parseInt(sourceRow), parseInt(sourceIndex), null);
        }
      }
    } else {
      // Normal drop from library
      onHexDrop(rowIndex, hexIndex, data);
    }
  };

  const handleDropZoneDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDropZoneDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (data.sourceHexId) {
      // Remove tile from source hex
      const [sourceRow, sourceIndex] = data.sourceHexId.split('-');
      onHexDrop(parseInt(sourceRow), parseInt(sourceIndex), null);
    }
  };

  return (
    <>
      <FlowerContainer>
        {layout.map((hexCount, rowIndex) => (
          <HexRow key={rowIndex}>
            {Array.from({ length: hexCount }).map((_, hexIndex) => {
              const hexId = `${rowIndex}-${hexIndex}`;
              const hex = hexes[hexId] || {};
              
              return (
                <Hex
                  key={hexId}
                  hexId={hexId}
                  tile={hex.tile}
                  sideLabels={hex.sideLabels}
                  onDrop={handleDrop(rowIndex, hexIndex)}
                  onDragStart={() => {}}
                />
              );
            })}
          </HexRow>
        ))}
      </FlowerContainer>
      <DropZone
        className={isDraggingOver ? 'drag-over' : ''}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={handleDropZoneDrop}
      />
    </>
  );
};

export default HexFlower;
