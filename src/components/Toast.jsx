import React from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.show {
    opacity: 1;
  }
`;

const ToastMessage = styled.div`
  background: #333;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 300px;
  text-align: center;
`;

const Toast = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastContainer className="show">
      <ToastMessage>
        {message}
      </ToastMessage>
    </ToastContainer>
  );
};

export default Toast;
