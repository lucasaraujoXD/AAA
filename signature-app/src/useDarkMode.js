import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      setTheme(localTheme);
    } else {
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return [theme, toggleTheme];
};

export default useDarkMode;
