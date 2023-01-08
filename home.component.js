import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Icon, Divider, Layout, TopNavigation, TopNavigationAction, Input, ListItem, List } from '@ui-kitten/components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormattedCurrency, FormattedNumber, FormattedMessage, IntlProvider } from 'react-intl';
import translations from './translations.json';
import { View } from 'react-native-animatable';

const InfoIcon = (props) => (
  <Icon {...props} name='info-outline' />
);

const styles = StyleSheet.create({
  text: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

const CURRENCIES_API_URL = 'https://api.apilayer.com/exchangerates_data/latest';


export const HomeScreen = ({ navigation }) => {

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  const navigateInfo = () => (
    <TopNavigationAction icon={InfoIcon} onPress={navigateDetails} />
  );

  const [state, setState] = React.useState({
    cur: {
      ['RUB']: 0,
      ['GEL']: 0,
      ['EUR']: 0,
      ['USD']: 0,
    }
  });

  React.useEffect(() => {
    async function loadCurrencies() {
      // получение данных из AsyncStorage
      const currenciesString = await AsyncStorage.getItem('currenciesList');
      let currenciesList = JSON.parse(currenciesString);

      // если данные существуют, обновляем состояние
      if (currenciesList) {
        setState({ cur: currenciesList });
      } else {
        // данных нет, сохраняем исходный список валют в AsyncStorage
        await AsyncStorage.setItem('currenciesList', JSON.stringify(state.cur));
      }
    }

    loadCurrencies();
  }, []);

  // функция добавления новой валюты
  const addCurrency = async (currency) => {
    // добавление новой валюты
    const newCurrency = { [currency]: 0 };
    setState((prevState) => ({
      cur: { ...prevState.cur, ...newCurrency }
    }));

    // сохранение обновленного списка валют в AsyncStorage
    await AsyncStorage.setItem('currenciesList', JSON.stringify(state.cur));
  };
  const removeCurrency = (currency) => {
    // удаление валюты
    const { [currency]: _, ...newCurrencies } = state.cur;
    setState({ cur: newCurrencies });
  
    console.log("DELETE currency:", currency, "NEW cur:", (state.cur), "NEW { cur: newCurrencies }", {cur: newCurrencies });
  };
  
  React.useEffect(() => {
    // сохранение обновленного списка валют в AsyncStorage

   // AsyncStorage.removeItem('currenciesList');
    AsyncStorage.setItem('currenciesList', JSON.stringify(state.cur));
  }, [state.cur]);

  const [rates, setRates] = React.useState(null);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(CURRENCIES_API_URL, {
        params: {
          base: 'RUB',
        },
        headers: {
          apikey: '6rOLEhF1PKO8tbicWoLG9wCXSRwlE3hk'
        }
      });

      response.data.rates.update_date = new Date().toISOString(); // Добавляем текущую дату
      await AsyncStorage.setItem('exchange', JSON.stringify(response.data.rates)); // записываем в AsSt
     // console.log("UPDATED:", JSON.stringify(response.data.rates.update_date));

      setRates(response.data.rates);

    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const updateCurrencies = async () => {
    try {
      const exchengeRate = await AsyncStorage.getItem('exchange'); // получение данных

      if (exchengeRate !== null) {
        const exchange = JSON.parse(exchengeRate);

        const toDay = new Date();
        const updDay = new Date(exchange.update_date.toString());
        toDay.setDate(toDay.getDate() - 1);
        if (toDay.getTime() < updDay.getTime()) { // разница между сохраненным значением и сегодняшней датой меньше суток
          // console.log("toDay < updDay ! Use AsSt");
          setRates(exchange);
        } else { // разница между сохраненным значением и сегодняшней датой больше суток
          //console.log("toDay >= updDay ! Use fetchCurrencies");
          fetchCurrencies();
        }
      } else {
        fetchCurrencies();
      }

    } catch (error) {
      console.error('Error updating rates:', error);
    }
  };

  React.useEffect(() => {
    //fetchCurrencies();
    updateCurrencies();
  }, []);

  const checkVal = (text) => { // проверка входного значения
    const MAX_RUBLES = 9223372036854775807; // максимальное для int

    let inputCur = parseInt(text);
    if (isNaN(inputCur)) {
      inputCur = 0;
    }
    if (inputCur > MAX_RUBLES) {
      inputCur = MAX_RUBLES;
    }
    return inputCur;
  }

  const onChange = (text, curCode) => {
    text = checkVal(text);

    setState(prevState => {
      const newState = { ...prevState };
      for (const currency in prevState.cur) { // rates OR cur
        newState.cur[currency] = rates[currency] * (text / rates[curCode]);
        if (currency === curCode) {
          newState.cur[currency] = newState.cur[currency].toFixed(0);
        } else {
          newState.cur[currency] = newState.cur[currency].toFixed(4);
        }

      }
      return newState;
    });
  };

  // const CurrencyString = ({ currencyCode, value }) => {
  //   const currencyString = (
  //     <FormattedNumber
  //       value={value}
  //       style="currency"
  //       currency={currencyCode}
  //     />
  //   );

  //   return currencyString;
  // };

  // const CurrencyDisplay = ({ currencyCode, values }) => (
  //   <FormattedCurrency
  //     values={values}
  //     currency={currencyCode}
  //   />
  // );


  const CurrencyName = ({ currencyCode }) => {
    const currencyName = (
      <FormattedMessage
        id={`currencies.${currencyCode}`}
        defaultMessage={currencyCode}
      />
    );

    return currencyName;
  };

  const DelIcon = (props) => (
    <Icon {...props} name='trash-outline'/>
  );

  if (!rates) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title='Конвертик' alignment='center' accessoryRight={navigateInfo} />
        <Divider />
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.text} category='h1'>Загрузка</Text>
        </Layout>
      </SafeAreaView>
    );
  }
  else {
    return (
      <IntlProvider messages={translations} locale='en'>
        <SafeAreaView style={{ flex: 1 }}>
          <TopNavigation title='Конвертик' alignment='center' accessoryRight={navigateInfo} />
          <Divider />
          <ScrollView>
            <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              {Object.entries(state.cur).map(([currency, value]) => (
                <ListItem
                  key={currency}
                  title={<CurrencyName currencyCode={currency} />}
                  accessoryRight={() => <Icon name='trash-2-outline' onPress={() => removeCurrency(currency)} />}
                >
                  <Text style={styles.text} category='s1'>
                    <CurrencyName currencyCode={currency} />
                  </Text>
                  <Input
                    style={styles.input}
                    size='medium'
                    keyboardType='numeric'
                    clearTextOnFocus
                    onChangeText={(text) => onChange(text, currency)}
                    value={value.toString()}
                  />
                  <Button 
                    name='trash-2-outline2' 
                    onPress={() => removeCurrency(currency)}
                    accessoryLeft={DelIcon}
                    appearance='ghost'
                  />
                </ListItem>
              ))}
            </Layout>
          </ScrollView>
        </SafeAreaView>
      </IntlProvider>
    );
  };
};