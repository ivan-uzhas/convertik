import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, Button, Icon, Divider, Layout, TopNavigation, TopNavigationAction, Input  } from '@ui-kitten/components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormattedCurrency, FormattedNumber,FormattedMessage,IntlProvider} from 'react-intl';
import translations from './translations.json';

  const InfoIcon = (props) => (
    <Icon {...props} name='info-outline'/>
  );

  const styles = StyleSheet.create({
    text:{
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
    <TopNavigationAction icon={InfoIcon} onPress={navigateDetails}/>
  );

  const [state, setState] = React.useState({
    val: {
      ['RUB']: 1,
      ['GEL']: 0,
      ['EUR']: 0,
      ['USD']: 0,
      ['ILS']: 0 ,
    }
  });

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
      setRates(response.data.rates);

      response.data.rates.update_date = new Date().toISOString(); // Добавляем текущую дату
      await AsyncStorage.setItem('key', JSON.stringify(response.data.rates)); // записываем в AsSt
      console.log("UPDATED:",JSON.stringify(response.data.rates.update_date));

    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const updateCurrencies= async () => {
    try {
      const value = await AsyncStorage.getItem('key'); // получение данных

      if (value !== null) {
        const object = JSON.parse(value);

        const toDay = new Date();
        const updDay = new Date(object.update_date.toString());
        toDay.setDate(toDay.getDate() - 1);
        if (toDay.getTime() < updDay.getTime()){ // разница между сохраненным значением и сегодняшней датой меньше суток
         // console.log("toDay < updDay ! Use AsSt");
          setRates(object);
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

  React.useEffect(() =>{
    //fetchCurrencies();
    updateCurrencies();
  }, []);

  const checkVal = (text) => { // проверка входного значения
    const MAX_RUBLES = 9223372036854775807; // максимальное для int

    let val = parseInt(text);
    if (isNaN(val)) {
      val = 0;
    }
    if (val > MAX_RUBLES) {
      val = MAX_RUBLES;
    }
    return val;
  }

  const onChange = (text, curCode) => {
    text = checkVal(text);
  
    setState(prevState => {
      const newState = { ...prevState };
      for (const currency in rates) {
        newState.val[currency] = rates[currency] * (text / rates[curCode]);
        if (currency===curCode){
          newState.val[currency] = newState.val[currency].toFixed(0);
        } else {
          newState.val[currency] = newState.val[currency].toFixed(4);
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
  
  if (!rates){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title='Конвертик' alignment='center' accessoryRight={navigateInfo}/>
        <Divider/>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.text} category='h1'>Загрузка</Text>
        </Layout>
      </SafeAreaView>
    );
  }
  else{
    return (
      <IntlProvider messages={translations} locale='en'>
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title='Конвертик' alignment='center' accessoryRight={navigateInfo}/>
      <Divider/>
      <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Text style={styles.text} category='s1'>Рубли {state.val['RUB'].toString()}</Text>
        <Input
            style={styles.input}
            placeholder=''
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={(text) => onChange(text, 'RUB')}
         // keyboardType="decimal-pad"
            value={state.val['RUB'].toString()}
        />
        <Text style={styles.text} category='s1'><CurrencyName currencyCode="GEL" />{state.val['GEL'].toString()}</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={(text) => onChange(text, 'GEL')}
            value={state.val['GEL'].toString()}
        />
        <Text style={styles.text} category='s1'>Евро {state.val['EUR'].toString()}</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={(text) => onChange(text, 'EUR')}
            value={state.val['EUR'].toString()}
        />
        <Text style={styles.text} category='s1'>Доллары {state.val['USD'].toString()}</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={(text) => onChange(text, 'USD')}
            value={state.val['USD'].toString()}
        />
        <Text style={styles.text} category='s1'>Шекели {state.val['ILS'].toString()}</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={(text) => onChange(text, 'ILS')}
            value={state.val['ILS'].toString()}
        />
      </Layout>
    </SafeAreaView>
    </IntlProvider>
    );
  };
};