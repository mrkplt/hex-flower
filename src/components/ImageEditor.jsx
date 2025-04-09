import React, { useRef, useEffect, useState } from 'react';
import Cropper from 'react-cropper';
import '../styles/cropper.css';
import styled from 'styled-components';

const ImageEditor = ({ image, onSave, onCancel }) => {
  const cropperRef = useRef();
  const [cropper, setCropper] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  useEffect(() => {
    if (imageURL && cropperRef.current) {
      try {
        // Get the cropper instance
        const cropperInstance = cropperRef.current.cropper;
        if (cropperInstance) {
          // Set the aspect ratio to match the hex size (110%)
          const hexSize = 110 * 1.1;
          
          // Initialize the cropper with proper settings
          cropperInstance.setAspectRatio(hexSize / hexSize);
          cropperInstance.setData({
            width: hexSize,
            height: hexSize,
            naturalWidth: hexSize,
            naturalHeight: hexSize,
            rotate: 0,
            scaleX: 1,
            scaleY: 1
          });
          
          // Set the crop box size
          cropperInstance.setCropBoxData({
            width: hexSize,
            height: hexSize
          });

          setCropper(cropperInstance);
          setIsReady(true);
        } else {
          throw new Error('Cropper instance not available');
        }
      } catch (err) {
        console.error('Error setting cropper properties:', err);
        setError('Failed to initialize image editor. Please try again.');
      }
    }
  }, [imageURL]);

  const handleSave = () => {
    if (!cropper || !isReady) {
      setError('Image editor is not ready. Please try again.');
      return;
    }

    try {
      // Get the cropped canvas
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        // Convert to Data URL
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
      } else {
        setError('Failed to create cropped image. Please try again.');
      }
    } catch (err) {
      console.error('Error saving cropped image:', err);
      setError('Failed to save cropped image. Please try again.');
    }
  };

  const handleRotate = (direction) => {
    if (!cropper || !isReady) {
      setError('Image editor is not ready. Please try again.');
      return;
    }

    try {
      // Get current data
      const data = cropper.getData();
      if (!data) {
        throw new Error('No image data available');
      }

      // Update rotation
      const newRotation = direction === 'left' ? data.rotate - 90 : data.rotate + 90;
      cropper.setData({
        ...data,
        rotate: newRotation
      });
    } catch (err) {
      console.error('Error rotating image:', err);
      setError('Failed to rotate image. Please try again.');
    }
  };

  const handleZoom = (direction) => {
    if (!cropper || !isReady) {
      setError('Image editor is not ready. Please try again.');
      return;
    }

    try {
      // Get current data
      const data = cropper.getData();
      if (!data) {
        throw new Error('No image data available');
      }

      // Update zoom
      const newZoom = direction === 'in' ? data.scaleX * 1.1 : data.scaleX * 0.9;
      cropper.setData({
        ...data,
        scaleX: newZoom,
        scaleY: newZoom
      });
    } catch (err) {
      console.error('Error zooming image:', err);
      setError('Failed to zoom image. Please try again.');
    }
  };

  return (
    <Container>
      <Editor>
        {imageURL && (
          <Cropper
            ref={cropperRef}
            src={imageURL}
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={1}
            guides={true}
            viewMode={1}
            dragMode="move"
            autoCropArea={1}
            background={true}
            zoomOnWheel={true}
            cropBoxResizable={true}
            cropBoxMovable={true}
          />
        )}

        <Controls>
          <Button className="secondary" onClick={() => handleRotate('right')}>&#x21B7;</Button>
          <Button className="secondary" onClick={() => handleRotate('left')}>&#x21B6;</Button>
          <Button className="secondary" onClick={() => handleZoom('in')}>&#x2B05;</Button>
          <Button className="secondary" onClick={() => handleZoom('out')}>&#x27A1;</Button>
        </Controls>

        {error && (
          <Error>
            {error}
          </Error>
        )}
      </Editor>

      <ButtonGroup>
        <Button className="secondary" onClick={onCancel}>Cancel</Button>
        <Button className="primary" onClick={handleSave}>Save</Button>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Editor = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  ${props => props.className === 'primary' ? `
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
    }
  ` : `
    background: #f44336;
    color: white;
    
    &:hover {
      background: #d32f2f;
    }
  `}
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const Error = styled.div`
  color: #f44336;
  padding: 8px;
  background: #ffebee;
  border-radius: 4px;
  margin-top: 10px;
`;

export default ImageEditor;
