import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';

const TrashZoneContainer = styled.div`
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

const TrashZone = ({ onTileDelete }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.HEX_TILE,
    drop: (item, monitor) => {
      if (item.hexId) {
        onTileDelete(item.hexId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return <TrashZoneContainer ref={drop} isOver={isOver} />;
};

export default TrashZone;
