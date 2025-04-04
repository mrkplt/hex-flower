import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px;
  max-width: 90vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const ImageDropZone = styled.div`
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4CAF50;
    background: #e8f5e9;
  }

  ${props => props.isDragging && `
    border-color: #4CAF50;
    background: #e8f5e9;
  `}
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
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  ${props => props.type === 'submit' && `
    background: #4CAF50;
    color: white;
  `}

  ${props => props.type === 'button' && `
    background: #f44336;
    color: white;
  `}
`;

const TileForm = ({ onClose, onSubmit }) => {
  const [imageFile, setImageFile] = React.useState(null);
  const [imageName, setImageName] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);

  const handleImageDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setImageFile(files[0]);
      setImageName(files[0].name);
    }
  };

  const handleImageDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleImageDragLeave = () => {
    setIsDragging(false);
  };

  const handleImageClick = (event) => {
    event.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
        setImageName(e.target.files[0].name);
      }
    };
    input.click();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!imageFile && !imageName) {
      alert('Please provide either an image or a name');
      return;
    }
    onSubmit({ imageFile, imageName });
    onClose();
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="image">Image (optional)</Label>
          <ImageDropZone
            onDrop={handleImageDrop}
            onDragOver={handleImageDragOver}
            onDragLeave={handleImageDragLeave}
            onClick={handleImageClick}
            isDragging={isDragging}
          >
            {imageFile ? (
              <>
                <p>{imageFile.name}</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100px' }}
                />
              </>
            ) : (
              <p>Drag and drop an image here, or click to select</p>
            )}
          </ImageDropZone>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            type="text"
            id="name"
            placeholder="Enter a name for the tile"
          />
        </InputGroup>

        <ButtonGroup>
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default TileForm;
