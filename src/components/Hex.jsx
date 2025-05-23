import React from 'react';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { getHexDimensions } from '../constants/hexLayout';
import { MANTIS, SNOW, BLACK, WHITE, getContrastText } from '../constants/colors';

const { width, height, margin } = getHexDimensions();

const HexContainer = styled.div`
  width: ${width}px;
  height: ${height}px;
  position: relative;
  margin-left: ${margin}px;
  margin-right: ${margin}px;
  margin-top: 0px;
  margin-bottom: 0px;
  background: ${BLACK};
  padding: 0px;
  cursor: ${props => props.$hasTile ? 'grab' : 'pointer'};
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  transform: translate(${props => `${props.$offset}px, ${props.$verticalOffset}px`});
  position: relative;
  overflow: hidden;

  &:active {
    cursor: ${props => props.hasTile ? 'grabbing' : 'pointer'};
  }

  &:before {
    content: '';
    position: absolute;
    top: ${props => props.$isOver ? 4 : 1}px;
    left: ${props => props.$isOver ? 4 : 1}px;
    height: calc(100% - ${props => props.$isOver ? '8px' : '2px'});
    width: calc(100% - ${props => props.$isOver ? '8px' : '2px'});
    background: ${props => props.$isOver ? MANTIS : SNOW};
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    transition: all 0.2s ease;
    pointer-events: ${props => props.$isDragging ? 'none' : 'auto'};
  }

  &:hover:before {
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
    background: ${MANTIS};
  }

  // Ensure the container itself matches the hex shape
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
`;

const Content = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
`;

const Interior = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 1px;
  left: 1px;
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    top: 4px;  /* border width */
    left: 4px;  /* border width */
    height: calc(100% - 8px);  /* 100% - (2 * border width) */
    width: calc(100% - 8px);  /* 100% - (2 * border width) */
  }
`;

const Label = styled.div`
  font-size: 16px;
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
  color: ${props => getContrastText(props.color)};
`;

const ImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 1px;
  left: 1px;
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
  }
`;

const Image = styled.img`
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  object-position: center;
`;

const Hex = ({ tile, hexId, onMoveTile, offset = 0, verticalOffset = 0 }) => {
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
      $hasTile={!!tile}
      $isDragging={isDragging}
      $isOver={isOver}
      $offset={offset}
      $verticalOffset={verticalOffset}
    >
      <Content className="hex-content">
        {tile && (
          <>
            {!tile.image && <Interior style={{ backgroundColor: tile.color }}>
              {tile.text && <Label color={tile.color} className="label">{tile.text}</Label>}
              </Interior>
            }
            {tile.image && (
              <ImageContainer className="image-container">
                <Image src={tile.image} alt={tile.text || 'Tile image'} className="image" style={{ backgroundColor: tile.color }}/>
                {tile.text && <Label color={tile.color} className="label">{tile.text}</Label>}
              </ImageContainer>
            )}
            
          </>
        )}
      </Content>
    </HexContainer>
  );
};

export default Hex;
