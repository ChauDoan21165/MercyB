import { useState, useEffect } from 'react';

export const useColorMode = () => {
  const [useColorTheme, setUseColorTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem('mercyBladeColorMode');
    return saved !== 'blackWhite'; // Default to color theme
  });

  useEffect(() => {
    localStorage.setItem('mercyBladeColorMode', useColorTheme ? 'color' : 'blackWhite');
  }, [useColorTheme]);

  const toggleColorMode = () => setUseColorTheme(!useColorTheme);

  return { useColorTheme, toggleColorMode };
};
