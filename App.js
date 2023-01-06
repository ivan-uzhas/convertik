import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './navigation.component';
import { ThemeContext } from './theme-context';
import { default as theme } from './custom-theme (2).json'; // <-- Import app theme


export default () => {
  
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => {
   // theme={{ ...eva.light, ...theme }};
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack}/>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={eva[theme]}>
          <AppNavigator/>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
};
