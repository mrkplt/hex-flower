import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';

const TrashZoneContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 120px;
  height: 138.568px;
  transform: ${props => props.$isOver ? 'scale(1.15)' : 'scale(1)'};
  transition: all 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.$isOver ? '#ff0000' : '#FF5555'};
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  &::after {
    content: '🗑️';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 36px;
    z-index: 1;
  }
`;

const TrashZone = ({ onTileDelete }) => {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.HEX_TILE, ItemTypes.LIBRARY_TILE],
    drop: (item, monitor) => {
      const id = item.hexId || item.tile?.id;
      if (id) {
        onTileDelete(id);
      }
      return { didDrop: true };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return <TrashZoneContainer ref={drop} $isOver={isOver} />;
};

export default TrashZone;
