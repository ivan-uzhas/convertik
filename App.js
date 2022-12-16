import React from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native';
import axios from 'axios';

const CURRENCIES_API_URL = 'https://api.apilayer.com/exchangerates_data/latest';

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
          apikey: 'YJgSxDxtZvVJAoAD8PPsUlSjPZkRBO7G'
        }
      });
  
      setRates(response.data.rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };
  
  React.useEffect(() => {
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
  

  return (
    <View style={{ backgroundColor: '#ebebeb', width: '100%', height: '100%', alignItems: 'center', alignItems: 'center', justifyContent: 'center' }}>
      <TextInput keyboardType='numeric' placeholder='Введи рубли'
        value={state.rubles} //.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB',minimumFractionDigits:0})}
        onChangeText={onChangeText}
      />

      <Text>Рубли: {state.rubles.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'})}</Text>
      <Text>Лари: {state.lari.toLocaleString('ka-GE', {style: 'currency', currency: 'GEL'})}</Text>
      <Text>Евро: {state.euro.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}</Text>
      <Text>Доллары: {state.dollars.toLocaleString('en-US', {/*format: '#,##0.00 ¤', */style: 'currency', currency: 'USD'})}</Text>
    </View>
  );
};

export default App;
