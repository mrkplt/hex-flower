import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Cropper from 'react-cropper';
import '../styles/cropper.css';
import { SketchPicker } from 'react-color';
import { getHexDimensions } from '../constants/hexLayout';

const HEX_CLIP_PATH = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

const { width: HEX_WIDTH, height: HEX_HEIGHT, margin: HEX_MARGIN } = getHexDimensions();

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: white;
  padding: 28px 24px 24px 24px;
  border-radius: 12px;
  width: 430px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  max-height: 90vh;
  overflow-y: auto;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: ${props => props.color};
  padding: 8px 12px;
  cursor: pointer;
  position: relative;
  color: ${props => {
    // Calculate contrast color for text
    const r = parseInt(props.color.slice(1, 3), 16);
    const g = parseInt(props.color.slice(3, 5), 16);
    const b = parseInt(props.color.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white text for dark colors, black text for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }};
  text-align: center;
  font-weight: 500;
  
  &:hover {
    border-color: #4CAF50;
  }
`;
const HexPreview = styled.div`
  width: ${HEX_WIDTH}px;
  height: ${HEX_HEIGHT}px;
  position: relative;
  margin: 0 auto 12px auto;
  padding: 0px;
  background: black;
  overflow: hidden;
  clip-path: ${HEX_CLIP_PATH};
`;
const HexPreviewContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: ${HEX_CLIP_PATH};
`;
const HexPreviewInterior = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 1px;
  left: 1px;
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  background-color: ${props => props.color};
  clip-path: ${HEX_CLIP_PATH};
  overflow: hidden;
`;
const HexPreviewImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 1px;
  left: 1px;
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  clip-path: ${HEX_CLIP_PATH};
  overflow: hidden;
`;
const PreviewImage = styled.img`
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  object-position: center;
`;
const PreviewText = styled.div`
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
  color: ${props => {
    // Convert hex color to RGB
    if (!props.color) return '#222';
    const r = parseInt(props.color.slice(1, 3), 16);
    const g = parseInt(props.color.slice(3, 5), 16);
    const b = parseInt(props.color.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white text for dark colors, black text for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }};
`;
const DropZone = styled.div`
  border: 2px dashed #bbb;
  border-radius: 8px;
  padding: 14px;
  text-align: center;
  color: #888;
  background: #fafbfc;
  cursor: pointer;
  transition: border 0.2s;
  margin-bottom: 5px;
  &:hover {
    border-color: #4caf50;
    color: #333;
  }
`;
const CropperWrapper = styled.div`
  width: 100%;
  margin: 0 auto 8px auto;
  > div {
    width: 100% !important;
    // height: 260px !important;
  }
`;
const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 10px 0 5px 0;
`;
const TextField = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 40px;
  font-size: 1rem;
  width: 100%;
  
  &::placeholder {
    font-weight: 500;
    color: #666;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;
const Button = styled.button`
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  &.primary {
    background: #4CAF50;
    color: white;
    &:hover { background: #45a049; }
  }
  &.secondary {
    background: #f5f5f5;
    border: 1px solid #ddd;
    &:hover { background: #e5e5e5; }
  }
`;
const Error = styled.div`
  color: #f44336;
  padding: 6px;
  background: #ffebee;
  border-radius: 4px;
  margin-top: 6px;
  text-align: center;
  font-size: 0.9rem;
`;
const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;
const CropperActionButton = styled.button`
  min-width: 36px;
  height: 32px;
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  background: #e0e0e0;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 0.9rem;
  margin-right: 4px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #e5e5e5;
  }
  
  &.primary {
    background: #4CAF50;
    color: white;
    border: none;
    &:hover { background: #45a049; }
  }
  
  &.danger {
    background: #f44336;
    color: white;
    border: none;
    &:hover { background: #d32f2f; }
  }
`;

const FormSection = styled.div`
  margin-bottom: 10px;
  background: #f0f0f0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  
  > *:last-child {
    margin-bottom: 0;
  }
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px;
  padding: 12px;
  background: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  
  > *:last-child {
    margin-bottom: 0;
  }
`;

const TileCreator = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [liveCropImage, setLiveCropImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState(null);
  const [pickerPosition, setPickerPosition] = useState({ left: 0, top: 0 });
  const fileInputRef = useRef();
  const cropperRef = useRef(null);
  const modalRef = useRef(null);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageURL(e.target.result);
        setIsCropping(true);
        setCroppedImage(null);
        setLiveCropImage(null);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    if (isCropping && imageURL) {
      // Wait for Cropper to mount, then trigger crop
      setTimeout(() => {
        handleLiveCrop();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCropping, imageURL]);

  useEffect(() => {
    const cropper = cropperRef.current?.cropper;
    if (!isCropping || !cropper) return;
    function update() {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) setLiveCropImage(canvas.toDataURL('image/png'));
    }
    // Attach crop event
    if (cropper && typeof cropper.on === 'function') {
      cropper.on('crop', update);
      update(); // Initial
      return () => cropper.off('crop', update);
    } else {
      // Fallback: poll for crop changes (for older react-cropper)
      update();
      const interval = setInterval(update, 200);
      return () => clearInterval(interval);
    }
  }, [isCropping, imageURL]);

  const handleLiveCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        setLiveCropImage(canvas.toDataURL('image/png'));
      }
    }
  }, [isCropping, imageURL]);

  // Drag-and-drop handlers
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // File input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  // Cropper controls
  const handleRotate = (dir) => {
    if (cropperRef.current?.cropper) cropperRef.current?.cropper.rotate(dir === 'left' ? -90 : 90);
  };
  const handleZoom = (dir) => {
    if (cropperRef.current?.cropper) cropperRef.current?.cropper.zoom(dir === 'in' ? 0.1 : -0.1);
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setImageURL(null);
    setCroppedImage(null);
    setIsCropping(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save/cancel
  const handleSubmit = (e) => {
    e.preventDefault();
    let imageData = null;
    // If cropping is enabled and cropper is present, get the cropped image at save time
    if (imageURL && cropperRef.current?.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      if (canvas) {
        imageData = canvas.toDataURL('image/png');
      }
    } else if (croppedImage) {
      imageData = croppedImage;
    }
    onSave({ text, color, image: imageData });
    setText('');
    setColor('#ffffff');
    handleRemoveImage();
    setShowColorPicker(false);
    setError(null);
  };
  const handleCancel = () => {
    onClose();
    setText('');
    setColor('#ffffff');
    handleRemoveImage();
    setShowColorPicker(false);
    setError(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    window.addEventListener('keyup', handleEsc);
    return () => window.removeEventListener('keyup', handleEsc);
  }, [isOpen]);

  const updatePickerPosition = useCallback(() => {
    if (modalRef.current && showColorPicker) {
      const modalRect = modalRef.current.getBoundingClientRect();
      setPickerPosition({
        left: modalRect.right + 20,
        top: modalRect.top * 1.5
      });
    }
  }, [showColorPicker]);

  useEffect(() => {
    updatePickerPosition();
    
    // Handle window resize to update picker position
    const handleResize = () => {
      updatePickerPosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePickerPosition, showColorPicker]);

  useEffect(() => {
    // Handle clicks outside the color picker
    const handleClickOutside = (event) => {
      // If the color picker is showing and the click is outside both the picker and the color button
      if (showColorPicker && 
          colorPickerRef.current && 
          !colorPickerRef.current.contains(event.target) && 
          !event.target.closest('.color-preview')) {
        setShowColorPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  // Function to handle color button click
  const handleColorButtonClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setShowColorPicker(prevState => !prevState);
  };

  if (!isOpen) return null;

  return (
    <Modal>
      <ModalContent ref={modalRef} onClick={e => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            {!imageFile && (
              <DropZone
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                tabIndex={0}
                role="button"
                aria-label="Add image"
              >
                Drag & drop an image here, or click to select
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </DropZone>
            )}
            {/* Cropper UI */}
            {isCropping && imageURL && (
              <CropperWrapper>
                <Cropper
                  ref={cropperRef}
                  src={imageURL}
                  crossOrigin="anonymous"
                  aspectRatio={1}
                  viewMode={1}
                  guides={true}
                  autoCropArea={1}
                  background={false}
                  responsive={true}
                  dragMode="move"
                  cropBoxResizable={true}
                  cropBoxMovable={true}
                  style={{ width: '100%', height: 220 }}
                />
                <Controls>
                  <CropperActionButton type="button" onClick={() => handleRotate('left')} title="Rotate Left">↺</CropperActionButton>
                  <CropperActionButton type="button" onClick={() => handleRotate('right')} title="Rotate Right">↻</CropperActionButton>
                  <CropperActionButton type="button" onClick={() => handleZoom('in')} title="Zoom In">+</CropperActionButton>
                  <CropperActionButton type="button" onClick={() => handleZoom('out')} title="Zoom Out">-</CropperActionButton>
                  <CropperActionButton type="button" className="danger" onClick={handleRemoveImage}>Remove</CropperActionButton>
                </Controls>
                {error && (
                  <Error style={{marginTop: '10px'}}>{error}</Error>
                )}
              </CropperWrapper>
            )}
            {/* Remove image button after crop */}
            {croppedImage && (
              <Button type="button" className="secondary" onClick={handleRemoveImage} style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                Remove Image
              </Button>
            )}
          </FormSection>
          <FormSection>
            <FormRow>
              <TextField
                type="text"
                placeholder="Enter Tile Text..."
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={100}
              />
            </FormRow>
            <FormRow>
              <ColorPreview 
                className="color-preview" 
                color={color} 
                onClick={handleColorButtonClick} 
                title="Pick color">
                Background Color
              </ColorPreview>
              {showColorPicker && modalRef.current && (
                <div ref={colorPickerRef} style={{ 
                  position: 'fixed',
                  zIndex: 2000, 
                  left: `${pickerPosition.left}px`,
                  top: `${pickerPosition.top}px`,
                  transform: 'scale(1.25)',
                  transformOrigin: 'top left'
                }}>
                  <SketchPicker 
                    color={color} 
                    onChange={c => setColor(c.hex)}
                    disableAlpha={true}
                  />
                </div>
              )}
            </FormRow>
          </FormSection>
          <PreviewSection>
            <HexPreview>
              <HexPreviewContent>
                <HexPreviewInterior color={color} />
                <HexPreviewImageContainer>
                  {isCropping && liveCropImage && <PreviewImage src={liveCropImage} alt="Tile" />}
                  {isCropping && !liveCropImage && imageURL && <PreviewImage src={imageURL} alt="Tile" />}
                  {!isCropping && croppedImage && <PreviewImage src={croppedImage} alt="Tile" />}
                  {!isCropping && !croppedImage && imageURL && <PreviewImage src={imageURL} alt="Tile" style={{ opacity: imageURL ? 1 : 0 }} />}
                </HexPreviewImageContainer>
                {text && <PreviewText color={color}>{text}</PreviewText>}
              </HexPreviewContent>
            </HexPreview>
          </PreviewSection>
          <ButtonGroup>
            <Button type="button" className="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="primary">
              Save
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default TileCreator;
