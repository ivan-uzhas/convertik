import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './navigation.component';
import { ThemeContext } from './theme-context';
import { default as appTheme } from './custom-theme (2).json';

export default () => {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const containerStyle = theme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={styles.container}>
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={{ ...eva[theme], ...appTheme }}>
          <View style={containerStyle}>
            <AppNavigator />
          </View>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
    </View>
  );
};

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // светлый фон
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#000000', // темный фон
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF' // Цвет фона - белый (#FFFFFF)
  }
});