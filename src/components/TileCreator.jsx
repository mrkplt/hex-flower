import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Cropper from 'react-cropper';
import '../styles/cropper.css';
import { SketchPicker } from 'react-color';

const HEX_CLIP_PATH = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

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
  padding: 32px 24px 24px 24px;
  border-radius: 12px;
  width: 430px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const Label = styled.label`
  font-weight: 500;
  margin-bottom: 4px;
`;
const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const ColorPreview = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: ${props => props.color};
`;
const HexPreview = styled.div`
  width: 220px;
  height: 190px;
  margin: 0 auto 12px auto;
  background: ${props => props.color};
  clip-path: ${HEX_CLIP_PATH};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
`;
const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  position: absolute;
  top: 0; left: 0;
`;
const PreviewText = styled.div`
  position: absolute;
  width: 90%;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => {
    // Contrast: white for dark bg, black for light bg
    if (!props.bg) return '#222';
    const c = props.bg.replace('#','');
    const r = parseInt(c.substring(0,2),16), g = parseInt(c.substring(2,4),16), b = parseInt(c.substring(4,6),16);
    return (0.299*r + 0.587*g + 0.114*b) > 186 ? '#222' : '#fff';
  }};
  font-size: 1.15rem;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
  z-index: 2;
  pointer-events: none;
`;
const DropZone = styled.div`
  border: 2px dashed #bbb;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  color: #888;
  background: #fafbfc;
  cursor: pointer;
  transition: border 0.2s;
  margin-bottom: 10px;
  &:hover {
    border-color: #4caf50;
    color: #333;
  }
`;
const CropperWrapper = styled.div`
  width: 100%;
  margin: 0 auto 16px auto;
  > div {
    width: 100% !important;
    // height: 260px !important;
  }
`;
const Controls = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 20px 0 0 0;
`;
const TextField = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 40px;
  font-size: 1rem;
  width: 100%;
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
`;
const Button = styled.button`
  padding: 8px 18px;
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
  padding: 8px;
  background: #ffebee;
  border-radius: 4px;
  margin-top: 10px;
  text-align: center;
`;
const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
`;
const FormLabel = styled(Label)`
  min-width: 120px;
  margin-bottom: 0;
`;
const CropperActionButton = styled.button`
  width: 110px;
  height: 38px;
  padding: 8px 0;
  border: none;
  border-radius: 4px;
  background: #f0f0f0;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 14px;
  margin-right: 10px;
  &:hover {
    background: #e0e0e0;
  }
  &.primary {
    background: #4CAF50;
    color: white;
    &:hover { background: #45a049; }
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
  const fileInputRef = useRef();
  const cropperRef = useRef(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageURL(url);
      setIsCropping(true);
      setCroppedImage(null);
      setLiveCropImage(null);
      return () => URL.revokeObjectURL(url);
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
  const handleCrop = () => {
    if (liveCropImage) {
      setCroppedImage(liveCropImage);
      setIsCropping(false);
      setError(null);
    } else {
      setError('Failed to crop image.');
    }
  };
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
    onSave({ text, color, image: croppedImage || null });
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

  if (!isOpen) return null;

  return (
    <Modal onClick={handleCancel}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
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
                aspectRatio={1}
                viewMode={1}
                guides={true}
                autoCropArea={1}
                background={false}
                responsive={true}
                dragMode="move"
                cropBoxResizable={true}
                cropBoxMovable={true}
                style={{ width: '100%', height: 260 }}
              />
              <Controls>
                <CropperActionButton type="button" onClick={() => handleRotate('left')} title="Rotate Left">&#x21B6;</CropperActionButton>
                <CropperActionButton type="button" onClick={() => handleRotate('right')} title="Rotate Right">&#x21B7;</CropperActionButton>
                <CropperActionButton type="button" onClick={() => handleZoom('in')} title="Zoom In">&#x2B05;</CropperActionButton>
                <CropperActionButton type="button" onClick={() => handleZoom('out')} title="Zoom Out">&#x27A1;</CropperActionButton>
                <CropperActionButton type="button" className="primary" onClick={handleCrop}>Crop</CropperActionButton>
                <CropperActionButton type="button" onClick={handleRemoveImage}>Remove Image</CropperActionButton>
              </Controls>
              {error && <Error>{error}</Error>}
            </CropperWrapper>
          )}

          {/* Remove image button after crop */}
          {croppedImage && (
            <Button type="button" className="secondary" onClick={handleRemoveImage} style={{ alignSelf: 'flex-start' }}>
              Remove Image
            </Button>
          )}
          <FormRow>
            <FormLabel>Tile Text:</FormLabel>
            <TextField
              type="text"
              placeholder="Enter tile text..."
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={100}
            />
          </FormRow>
          <FormRow>
            <FormLabel>Background Color:</FormLabel>
            <ColorPreview color={color} onClick={() => setShowColorPicker(v => !v)} title="Pick color" />
            {showColorPicker && (
              <div style={{ position: 'absolute', zIndex: 2000, left: 170 }}>
                <SketchPicker color={color} onChange={c => setColor(c.hex)} />
              </div>
            )}
          </FormRow>

          <Label>Preview:</Label>
          <HexPreview color={color}>
            {isCropping && liveCropImage && <PreviewImage src={liveCropImage} alt="Tile" />}
            {isCropping && !liveCropImage && imageURL && <PreviewImage src={imageURL} alt="Tile" />}
            {!isCropping && croppedImage && <PreviewImage src={croppedImage} alt="Tile" />}
            {!isCropping && !croppedImage && imageURL && <PreviewImage src={imageURL} alt="Tile" style={{ opacity: imageURL ? 1 : 0 }} />}
            {text && <PreviewText bg={color}>{text}</PreviewText>}
          </HexPreview>
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
