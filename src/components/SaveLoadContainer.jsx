import React from 'react';
import styled from 'styled-components';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

const Container = styled.div`
  display: flex;
  gap: 10px;
  z-index: 100;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const SaveLoadButton = styled.button`
  width: 90px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: #4285F4;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 14px;

  &:hover {
    background: #357ABE;
  }

  &:focus,
  &:focus-visible {
    outline: 2px solid #357ABE;
    outline-offset: 2px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const InfoButton = styled.a`
  position: fixed;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6c6;
    transform: scale(1.1);
  }
`;

const SaveLoadContainer = ({ 
  tiles, 
  setTiles, 
  hexes, 
  setHexes, 
  layoutSize, 
  setLayoutSize, 
  downloadableElement,
  setToastMessage,
  setShowToast
}) => {
  const handleSave = async () => {
    try {
      // Convert all image URLs to base64
      const tilesWithBase64 = await Promise.all(
        tiles.map(async (tile) => {
          if (tile.image) {
            try {
              const response = await fetch(tile.image);
              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
              }
              const blob = await response.blob();
              const reader = new FileReader();
              
              return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                  resolve({
                    ...tile,
                    image: reader.result
                  });
                };
                reader.onerror = () => {
                  reject(new Error('Failed to read image'));
                };
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error('Error processing image:', error);
              return {
                ...tile,
                image: null
              };
            }
          }
          return tile;
        })
      );

      const saveData = {
        tiles: tilesWithBase64,
        hexes,
        layoutSize
      };
      
      // Create a blob from the JSON data
      const blob = new Blob([JSON.stringify(saveData)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hex-flower-state.json';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setToastMessage('State saved successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error saving state:', error);
      setToastMessage(`Failed to save state: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleLoad = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setToastMessage('No file selected');
      setShowToast(true);
      return;
    }

    try {
      const text = await file.text();
      const { tiles: savedTiles, hexes: savedHexes, layoutSize: savedLayoutSize } = JSON.parse(text);
      
      // Validate the saved state
      if (!Array.isArray(savedTiles) || typeof savedHexes !== 'object') {
        throw new Error('Invalid saved state format');
      }

      // Reset the state completely
      setTiles([]);
      setHexes({});
      
      // Set the new state
      setTiles(savedTiles);
      setHexes(savedHexes);
      setLayoutSize(savedLayoutSize || 'MEDIUM');

      setToastMessage('State loaded successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error loading state:', error);
      setToastMessage(`Failed to load state: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleSVGDownload = () => {
    if (downloadableElement) {
      toSvg(downloadableElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "hex-flower.svg";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Error converting to image:', err);
          setToastMessage('Error downloading image');
          setShowToast(true);
        });
    }
  };

  const handlePDFDownload = () => {
    if (downloadableElement) {
      // Convert element to canvas
      toPng(downloadableElement)
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          return new Promise((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              resolve(canvas);
            };
            img.onerror = reject;
          });
        })
        .then((canvas) => {
          // Create PDF in landscape orientation
          const pdf = new jsPDF('l');
          
          // Get PDF page dimensions
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          // Calculate scaling factor to fit image within PDF page
          const widthRatio = pdfWidth / canvas.width;
          const heightRatio = pdfHeight / canvas.height;
          const scaleFactor = Math.min(widthRatio, heightRatio) * 0.95;
          
          // Calculate centered position
          const x = (pdfWidth - (canvas.width * scaleFactor)) / 2;
          const y = (pdfHeight - (canvas.height * scaleFactor)) / 2;
          
          // Convert canvas to PNG data URL
          const pngDataUrl = canvas.toDataURL('image/png');
          
          // Add image to PDF
          pdf.addImage(pngDataUrl, 'PNG', x, y, canvas.width * scaleFactor, canvas.height * scaleFactor);
          
          // Save the PDF
          pdf.save('hex-flower.pdf');
        })
        .catch((err) => {
          console.error('Error creating PDF:', err);
          setToastMessage('Error creating PDF');
          setShowToast(true);
        });
    }
  };

  return (
    <Container>
      <SaveLoadButton type="save" onClick={handleSave}>
        Save
      </SaveLoadButton>
      <FileInput
        accept="application/json"
        onChange={handleLoad}
      />
      <SaveLoadButton onClick={(e) => e.currentTarget.previousElementSibling.click()}>
        Load
      </SaveLoadButton>
      <SaveLoadButton onClick={handleSVGDownload}>
        SVG
      </SaveLoadButton>
      <SaveLoadButton onClick={handlePDFDownload}>
        PDF
      </SaveLoadButton>
      <InfoButton 
        href="https://github.com/mrkplt/hex-flower" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Github"
      >
        i
      </InfoButton>
    </Container>
  );
};

export default SaveLoadContainer;
