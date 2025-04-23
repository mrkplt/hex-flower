import React from 'react';
import styled from 'styled-components';
import { GREEN, FERN, CINNABAR, VIVALDI, WHITE, DARK_CHARCOAL, LEAD_GREY, BLACK_50_ALPHA } from '../constants/colors';

const Dialog = styled.div`
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

const DialogContent = styled.div`
  background: ${WHITE};
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  color: ${DARK_CHARCOAL};
`;

const Message = styled.p`
  margin: 0 0 20px 0;
  color: ${LEAD_GREY};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &.cancel {
    background: ${CINNABAR};
    color: ${WHITE};
    
    &:hover {
      background: ${VIVALDI};
    }
  }
  
  &.confirm {
    background: ${GREEN};
    color: ${WHITE};
    
    &:hover {
      background: ${FERN};
    }
  }
`;

const ConfirmationDialog = ({ isOpen, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <Dialog>
      <DialogContent>
        <Title>Confirm Deletion</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button className="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="confirm" onClick={onConfirm}>
            Delete All
          </Button>
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
