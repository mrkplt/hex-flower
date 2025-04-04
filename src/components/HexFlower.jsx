import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
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

const TrashZone = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 115.47px;
  opacity: ${props => props.isOver ? 1 : 0.5};
  transform: ${props => props.isOver ? 'scale(1.1)' : 'scale(1)'};
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
`;

const HexFlower = ({ hexes, onHexDrop }) => {
  const layout = [4, 5, 6, 7, 6, 5, 4];

  const handleMoveTile = (sourceHexId, targetHexId, tile) => {
    if (sourceHexId === targetHexId) return;

    // If source is from library (no hexId), just add the tile
    if (!sourceHexId) {
      const [targetRow, targetIndex] = targetHexId.split('-');
      onHexDrop(parseInt(targetRow), parseInt(targetIndex), tile);
      return;
    }

    // Get source and target positions
    const [sourceRow, sourceIndex] = sourceHexId.split('-');
    const [targetRow, targetIndex] = targetHexId.split('-');

    // Get the tiles
    const sourceTile = hexes[sourceHexId]?.tile;
    const targetTile = hexes[targetHexId]?.tile;

    // Move source tile to target
    onHexDrop(parseInt(targetRow), parseInt(targetIndex), sourceTile);

    // If target had a tile, move it to source position
    if (targetTile) {
      onHexDrop(parseInt(sourceRow), parseInt(sourceIndex), targetTile);
    } else {
      // If target was empty, remove the tile from source
      onHexDrop(parseInt(sourceRow), parseInt(sourceIndex), null);
    }
  };

  const [{ isOverTrash }, dropTrash] = useDrop(() => ({
    accept: ItemTypes.HEX,
    drop: (item) => {
      if (item.hexId) {
        const [row, index] = item.hexId.split('-');
        onHexDrop(parseInt(row), parseInt(index), null);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

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
                  onMoveTile={handleMoveTile}
                />
              );
            })}
          </HexRow>
        ))}
      </FlowerContainer>
      <TrashZone ref={dropTrash} isOver={isOverTrash} />
    </>
  );
};

export default HexFlower;
