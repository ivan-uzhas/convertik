import React from 'react';
//import { View, Text } from 'react-native';
import { TextInput,ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

import {useColorScheme} from 'react-native';
//import {Component} from 'react';
import {View, TextField, Text, Button, Switch, Colors} from 'react-native-ui-lib';
// import { View, Text, Switch, Colors}from "react-native-ui-lib";
Colors.loadSchemes({
  light: {
    screenBG: Colors.white,
    textColor: Colors.grey10,
  },
  dark: {
    screenBG: Colors.grey10,
    textColor: Colors.white,
  },
});

const CURRENCIES_API_URL = 'https://api.apilayer.com/exchangerates_data/latest';

const INPUT_SPACING = 10;


const setTheme = (dark: boolean): void => {
  Colors.setScheme(dark ? 'dark' : 'light');
};

const App = () => {

  const [darkTheme, setDarkTheme] = React.useState(false);
  
  setTheme(darkTheme);

  const [state, setState] = React.useState({
    rubles: 0,
    lari: 0,
    euro: 0,
    dollars: 0,
  });

  const [rates, setRates] = React.useState(null);
  //const [upd, setUpd] = React.useState({
  //  updateDate:'Не получены курсы',
  //});

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
      // timest = response.data.timestamp;
      // console.log(timest);
      // upde = new Date(timest * 1000);
      // updateDate = upde.toLocaleString('ru-RU', {
      //   hour: 'numeric',
      //   minute: 'numeric',
      //   second: 'numeric',
      //   day: 'numeric',
      //   month: 'numeric',
      //   year: 'numeric',
      // });
      // setUpd(updateDate);
      // console.log(updateDate);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };
  
  React.useEffect(() =>{
    fetchCurrencies();
  }, []);
  
  const calculateFromRubles = (rubles) => {
    setState((prevState) => ({
      ...prevState,
      lari: rates['GEL'] * rubles,
      euro: rates['EUR'] * rubles,
      dollars: rates['USD'] * rubles,
    }));
  };
  const calculateFromLary = (lari) => {
    setState((prevState) => ({
      ...prevState,
      rubles: lari / rates['GEL'],
      euro: rates['EUR'] * (lari / rates['GEL']),
      dollars: rates['USD'] * (lari / rates['GEL']),
    }));
  };

  const calculateFromEur = (euro) => {
    setState((prevState) => ({
      ...prevState,
      rubles: euro / rates['EUR'],
      lari: rates['GEL'] * (euro / rates['EUR']),
      dollars: rates['USD'] * (euro / rates['EUR']),
    }));
  };

  const calculateFromUsd = (dollars) => {
    setState((prevState) => ({
      ...prevState,
      rubles: dollars / rates['USD'],
      euro: rates['EUR'] * (dollars / rates['USD']),
      lari: rates['GEL'] * (dollars / rates['USD']),
    }));
  };

  const colorScheme = useColorScheme();
  
  const MAX_RUBLES = 9223372036854775807;

  const checkVal = (text) => {
    let val = parseInt(text);
    if (isNaN(val)) {
      val = 0;
    }
    if (val > MAX_RUBLES) {
      val = MAX_RUBLES;
    }
    return val;
  }

  const onChangeRub = (text) => {
    text = checkVal(text);
    setState((prevState) => ({ ...prevState, text }));
    calculateFromRubles(text);
  };

  const onChangeLar = (text) => {
    text = checkVal(text);
    setState((prevState) => ({ ...prevState, text }));
    calculateFromLary(text);
  };

  const onChangeEur = (text) => {
    text = checkVal(text);
    setState((prevState) => ({ ...prevState, text }));
    calculateFromEur(text);
  };

  const onChangeUsd = (text) => {
    text = checkVal(text);
    setState((prevState) => ({ ...prevState, text }));
    calculateFromUsd(text);
  };

  if (!rates){
    return (
      <View flex paddingH-25 paddingT-120 bg-screenBG>
        <Text blue50 text20 containerStyle={{marginBottom: INPUT_SPACING}} >Конвертик</Text>
        <Text text60 textColor containerStyle={{marginBottom: INPUT_SPACING}}>Загрузка курса валют</Text>
        <ActivityIndicator size="large"/>

        <Switch value={darkTheme} onValueChange={value => setDarkTheme(value)} />
        
      </View>
    );
  }
  else{
    return (
      <View flex paddingH-20 paddingT-50 bg-screenBG>
          <View >
            <Text blue50 text20 >Конвертик </Text>
          </View>
          <View right>
            <Switch value={darkTheme} onValueChange={value => setDarkTheme(value)} />
          </View>
          <TextField 
            text60
            textColor
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            placeholder="Рубли"
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={onChangeRub}
            value={state.rubles.toFixed(2).toString()}
          />
          <TextField 
            text60
            textColor
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            placeholder={'Лари ('+(1/rates['GEL']).toFixed(2)+')'}
            keyboardType='numeric' 
            onChangeText={onChangeLar}
            clearTextOnFocus
            value={state.lari.toFixed(2).toString()}
          />
          <TextField
            text60
            textColor
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            onChangeText={onChangeEur}
            placeholder={'Евро ('+(1/rates['EUR']).toFixed(2)+')'}
            keyboardType='numeric' 
            clearTextOnFocus
            value={state.euro.toFixed(2).toString()}
          />
          <TextField
            text60
            textColor
            containerStyle={{marginBottom: INPUT_SPACING}}
            floatingPlaceholder
            onChangeText={onChangeUsd}
            placeholder={'Доллары ('+(1/rates['USD']).toFixed(2)+')'}
            keyboardType='numeric' 
            clearTextOnFocus
            value={state.dollars.toFixed(2).toString()}
          />
          {/* <Text>Дата обновления: {upd.updateDate}</Text> */}
      </View>
    );
  };
};

export default App;
