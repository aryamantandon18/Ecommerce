import React, { useState } from 'react';

const CustomImageMagnifier = ({
  src,
  alt,
  width = 485,
  height = 540,
  magnifierHeight = 100,
  magnifierWidth = 100,
  zoomLevel = 3,
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([width, height]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left, width: elemWidth, height: elemHeight } = elem.getBoundingClientRect();
    
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    
    setXY([x, y]);
    setSize([elemWidth, elemHeight]);
  };

  const magnifierX = Math.max(0, Math.min(x - magnifierWidth / 2, imgWidth - magnifierWidth));
  const magnifierY = Math.max(0, Math.min(y - magnifierHeight / 2, imgHeight - magnifierHeight));

  return (
    <div style={{ display: 'flex'}} >
      <div 
        style={{
          position: 'relative',
          height: `${height}px`,
          width: `${width}px`,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ height: '100%', width: '100%'}}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowMagnifier(false)}
        />
        {/* Lens */}
        {showMagnifier && (
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              height: `${magnifierHeight}px`,
              width: `${magnifierWidth}px`,
              top: `${magnifierY}px`,
              left: `${magnifierX}px`,
              border: '1px solid #000',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imgWidth * 1.3}px ${imgHeight * 1.3}px`,
              backgroundPositionX: `${-magnifierX * 1.3}px`,
              backgroundPositionY: `${-magnifierY * 1.3}px`,
            }}
          />
        )}
      </div>
      {showMagnifier && (
        <div
          style={{
            marginLeft: '30px',
            border: '1px solid #ccc',
            height: `760px`,
            width: `800px`,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
          }}
        >  
          <img
            src={src}
            alt={alt}
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: `${-(y + 60) / 2 * zoomLevel + height / 2 - 140}px`,  
              left: `${-x / 70 * zoomLevel + width / 2 - 240}px`,
              height: `${imgHeight * zoomLevel}px`,
              width: `${imgWidth * zoomLevel + 20}px`,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CustomImageMagnifier;
