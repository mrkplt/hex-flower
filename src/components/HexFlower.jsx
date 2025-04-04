import React from 'react';
import styled from 'styled-components';
import { ItemTypes } from '../constants';
import Hex from './Hex';
import TrashZone from './TrashZone';

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

const HexFlower = ({ hexes, onHexDrop, onTileDelete }) => {
  const layout = [4, 5, 6, 7, 6, 5, 4];

  const handleMoveTile = (sourceHexId, targetHexId, tile) => {
    if (sourceHexId === targetHexId) return;
    onHexDrop(sourceHexId, targetHexId, tile);
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
                  onMoveTile={handleMoveTile}
                />
              );
            })}
          </HexRow>
        ))}
      </FlowerContainer>
      <TrashZone onTileDelete={onTileDelete} />
    </>
  );
};

export default HexFlower;
