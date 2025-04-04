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

const HexFlower = ({ hexes, onHexDrop }) => {
  // Hex flower layout pattern (19 hexes total):
  // Row 1: 2 hexes
  // Row 2: 3 hexes
  // Row 3: 4 hexes
  // Row 4: 3 hexes
  // Row 5: 2 hexes
  const layout = [4, 5, 6, 7, 6, 5, 4];

  const handleDrop = (rowIndex, hexIndex) => (e) => {
    e.preventDefault();
    const tileData = JSON.parse(e.dataTransfer.getData('application/json'));
    onHexDrop(rowIndex, hexIndex, tileData);
  };

  return (
    <FlowerContainer>
      {layout.map((hexCount, rowIndex) => (
        <HexRow key={rowIndex}>
          {Array.from({ length: hexCount }).map((_, hexIndex) => {
            const hexId = `${rowIndex}-${hexIndex}`;
            const hex = hexes[hexId] || {};
            
            return (
              <Hex
                key={hexId}
                tile={hex.tile}
                sideLabels={hex.sideLabels}
                onDrop={handleDrop(rowIndex, hexIndex)}
              />
            );
          })}
        </HexRow>
      ))}
    </FlowerContainer>
  );
};

export default HexFlower;
