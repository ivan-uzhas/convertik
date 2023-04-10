import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './home.component';
import { DetailsScreen } from './details.component';
import { AddScreen } from './add.component';
import { ThemeContext } from './theme-context'; // импортируем контекст темы

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => {
  const { theme } = useContext(ThemeContext); // получаем текущую тему из контекста

  return (
    <Navigator 
      screenOptions={{
        headerShown: false,
        headerStyle: { elevation: 0 },
        cardStyle: { backgroundColor: theme === 'light' ? '#ffffff' : '#242B43' } // устанавливаем цвет фона на основе текущей темы
      }} 
    >
      <Screen name='Home' component={HomeScreen}/>
      <Screen name='Details' component={DetailsScreen}/>
      <Screen name='Add' component={AddScreen}/>
    </Navigator>
  );
};

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator/>
  </NavigationContainer>
);
