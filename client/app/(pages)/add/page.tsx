"use client";
import React, { useState } from 'react';

function Page() {
  const [colors, setColors] = useState(['#ffffff', '#ffffff', '#ffffff', '#ffffff']);

  const handleColorChange = (index, event) => {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>New Color Palette</h1>
      <p>Create a new palette and contribute to ColorBee's library</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 100px)', gridTemplateRows: 'repeat(2, 100px)', gap: '10px' }}>
        {colors.map((color, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="color"
              value={color}
              onChange={(event) => handleColorChange(index, event)}
              style={{ width: '100px', height: '100px', border: 'none', cursor: 'pointer' }}
            />
            <span style={{ marginTop: '5px', fontSize: '14px' }}>{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;