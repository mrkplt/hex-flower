import React, { useEffect } from 'react';
import styled from 'styled-components';
import { 
  GREEN, FERN, CULTURED, GAINSBORO, COSMONAUT,
  WHITE, DARK_CHARCOAL, LEAD_GREY, BLACK_50_ALPHA 
} from '../constants/colors';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${BLACK_50_ALPHA};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${WHITE};
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
`;

const Title = styled.h2`
  margin: 0 0 15px 0;
  color: ${DARK_CHARCOAL};
`;

const Message = styled.p`
  margin: 0 0 20px 0;
  color: ${LEAD_GREY};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:primary {
    background: ${GREEN};
    color: ${WHITE};
    
    &:hover {
      background: ${FERN};
    }
  }
  
  &:secondary {
    background: ${GAINSBORO};
    border: 1px solid ${COSMONAUT};
    
    &:hover {
      background: ${CULTURED};
    }
  }
`;

const LayoutConfirmation = ({ isOpen, onClose, onConfirm, layoutSize }) => {
  if (!isOpen) return null;
  
  // Add escape key handler to close the confirmation dialog
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Add the event listener when the dialog is open
    window.addEventListener('keyup', handleEscKey);
    
    // Remove the event listener when the dialog is closed
    return () => {
      window.removeEventListener('keyup', handleEscKey);
    };
  }, [onClose]);

  return (
    <Modal>
      <ModalContent>
        <Title>Change Layout</Title>
        <Message>
          Changing the layout will clear all current tiles. Are you sure you want to continue?
        </Message>
        <ButtonGroup>
          <Button className="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="primary" onClick={() => {
            onConfirm(layoutSize);
            onClose();
          }}>
            Change Layout
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default LayoutConfirmation;
