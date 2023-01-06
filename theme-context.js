import React from 'react';
// import * as eva from '@eva-design/eva';
// import { default as theme } from './custom-theme (2).json'; // <-- Import app theme

export const ThemeContext = React.createContext({
  // theme: { ...eva.light, ...theme },
  theme: 'light',
  toggleTheme: () => {},
});