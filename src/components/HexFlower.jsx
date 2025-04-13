import React from 'react';
import styled from 'styled-components';
import { toPng } from 'html-to-image';
import Hex from './Hex';
import TrashZone from './TrashZone';
import { getFlowerLayout, getHexDimensions } from '../constants/hexLayout';
import LayoutConfirmation from './LayoutConfirmation';

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
  background: ${props => props.isActive ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.isActive ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 14px;

  &:hover {
    background: ${props => props.isActive ? '#4CAF50' : '#e0e0e0'};
  }
`;

const HexFlower = ({ hexes, onHexDrop, onTileDelete, layoutSize }) => {
  const elementRef = React.useRef(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingLayout, setPendingLayout] = React.useState(null);

  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "hex-flower.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error converting to image:', err);
      });
  };

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
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button 
          onClick={htmlToImageConvert} 
          className="download-button"
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Download Image
        </button>
      </div>
      <TrashZone onTileDelete={onTileDelete} />

      <LayoutToggleContainer>
        <LayoutToggle 
          isActive={layoutSize === 'SMALL'}
          onClick={() => handleLayoutChange('SMALL')}
        >
          Small
        </LayoutToggle>
        <LayoutToggle 
          isActive={layoutSize === 'MEDIUM'}
          onClick={() => handleLayoutChange('MEDIUM')}
        >
          Medium
        </LayoutToggle>
        <LayoutToggle 
          isActive={layoutSize === 'LARGE'}
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
