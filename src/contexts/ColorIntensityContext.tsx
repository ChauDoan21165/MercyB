import React, { createContext, useContext, useState, useEffect } from 'react';

interface ColorIntensityContextType {
  intensity: number;
  setIntensity: (value: number) => void;
}

const ColorIntensityContext = createContext<ColorIntensityContextType | undefined>(undefined);

export const ColorIntensityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [intensity, setIntensity] = useState(() => {
    const saved = localStorage.getItem('keyword-color-intensity');
    return saved ? parseFloat(saved) : 1.0;
  });

  useEffect(() => {
    localStorage.setItem('keyword-color-intensity', intensity.toString());
  }, [intensity]);

  return (
    <ColorIntensityContext.Provider value={{ intensity, setIntensity }}>
      {children}
    </ColorIntensityContext.Provider>
  );
};

export const useColorIntensity = () => {
  const context = useContext(ColorIntensityContext);
  if (!context) {
    throw new Error('useColorIntensity must be used within ColorIntensityProvider');
  }
  return context;
};
