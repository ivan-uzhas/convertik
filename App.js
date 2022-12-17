import React from 'react';
//import { View, Text } from 'react-native';
import { TextInput,ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

import {useColorScheme} from 'react-native';
//import {Component} from 'react';
import {View, TextField, Text, Button} from 'react-native-ui-lib';

const CURRENCIES_API_URL = 'https://api.apilayer.com/exchangerates_data/latest';

const INPUT_SPACING = 10;

const App = () => {
  const [state, setState] = React.useState({
    rubles: 1,
    lari: 1,
    euro: 1,
    dollars: 1,
  });

  const [rates, setRates] = React.useState(null);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(CURRENCIES_API_URL, {
        params: {
          base: 'RUB',
        },
        headers: {
          apikey: 'dOlPBagbrjZHQKlDfaHSWCp25cqVb4YL'
        }
      });
      setRates(response.data.rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };
  
  React.useEffect(() =>{
    fetchCurrencies();
  }, []);
  
  const calculateValues = (rubles) => {
    setState((prevState) => ({
      ...prevState,
      lari: rates['GEL'] * rubles,
      euro: rates['EUR'] * rubles,
      dollars: rates['USD'] * rubles,
    }));
  };

  const colorScheme = useColorScheme();
  
  const MAX_RUBLES = 9223372036854775807;

  const onChangeText = (text) => {
    let rubles = parseInt(text);
    if (isNaN(rubles)) {
      rubles = 0;
    }
    if (rubles > MAX_RUBLES) {
      rubles = MAX_RUBLES;
    }
    setState((prevState) => ({ ...prevState, rubles }));
    calculateValues(rubles);
  };

  if (!rates){
    return (
      <View flex paddingH-25 paddingT-120 >
        <Text blue50 text20 containerStyle={{marginBottom: INPUT_SPACING}}>Конвертик</Text>
        <Text text60 containerStyle={{marginBottom: INPUT_SPACING}}>Загрузка курса валют</Text>
        <ActivityIndicator size="large"/>
        
      </View>
    );
  }
  else{
    return (
      <View flex paddingH-25 paddingT-120 >
          <Text blue50 text20>Конвертик</Text>
          <Text>useColorScheme(): {colorScheme}</Text>
          {/* <TextField 
            text50
            placeholder='Введи рубли'
            containerStyle={{marginBottom: INPUT_SPACING}}
            keyboardType='numeric' 
            //floatingPlaceholder 
            helperText="this is an helper text"
            value={state.rubles}//.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB',minimumFractionDigits:0})}
            onChangeText={onChangeText}

          /> */}
          <TextField
            text50
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            placeholder="Рубли"
            keyboardType='numeric' 
          //  rightIconSource='MM'
            onChangeText={onChangeText}
            value={state.rubles.toString()}//.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'})}
          />
           {/* <Text>{rates['GEL']}</Text> */}
          <TextField
            text60
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            placeholder={'Лари ('+rates['GEL'].toFixed(2)+')'}
            //multiline
            value={state.lari.toFixed(2).toString()}//.toLocaleString('ka-GE', {style: 'currency', currency: 'GEL'})}
          />
          <TextField
            text60
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            placeholder={'Евро ('+rates['EUR'].toFixed(2)+')'}
            //multiline
            value={state.euro.toFixed(2).toString()}//.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
          />
          <TextField
            text60
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            placeholder={'Доллары ('+rates['USD'].toFixed(2)+')'}
            //multiline
            value={state.dollars.toFixed(2).toString()}//.toLocaleString('en-US', {/*format: '#,##0.00 ¤', */style: 'currency', currency: 'USD'})}
          />
      {/* <Text>Рубли: {state.rubles.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'})}</Text>
      <Text>Лари: {state.lari.toLocaleString('ka-GE', {style: 'currency', currency: 'GEL'})}</Text>
      <Text>Евро: {state.euro.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}</Text>
      <Text>Доллары: {state.dollars.toLocaleString('en-US', {/*format: '#,##0.00 ¤', style: 'currency', currency: 'USD'})}</Text> */}
    </View>
    
  );
        };
};

export default App;
