import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, Button, Icon, Divider, Layout, TopNavigation, TopNavigationAction, Input  } from '@ui-kitten/components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    rubles: 0,
    lari: 0,
    euro: 0,
    dollars: 0,
    ils: 0 ,
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
          console.log("toDay < updDay ! Use AsSt");
          setRates(object);
        } else { // разница между сохраненным значением и сегодняшней датой больше суток
          console.log("toDay >= updDay ! Use fetchCurrencies");
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


  const calculateFromRubles = (rubles) => {
    setState((prevState) => ({
      ...prevState,
      rubles: rubles,
      lari: (rates['GEL'] * rubles).toFixed(2),
      euro: (rates['EUR'] * rubles).toFixed(2),
      dollars: (rates['USD'] * rubles).toFixed(2),
      ils: (rates['ILS'] * rubles).toFixed(2),
    }));
  };
  const calculateFromLary = (lari) => {
    setState((prevState) => ({
      ...prevState,
      lari: lari,
      rubles: (lari / rates['GEL']).toFixed(2),
      euro: (rates['EUR'] * (lari / rates['GEL'])).toFixed(2),
      dollars: (rates['USD'] * (lari / rates['GEL'])).toFixed(2),
      ils: (rates['ILS'] * (lari / rates['GEL'])).toFixed(2),
    }));
  };

  const calculateFromEur = (euro) => {
    setState((prevState) => ({
      ...prevState,
      euro: euro,
      rubles: (euro / rates['EUR']).toFixed(2),
      lari: (rates['GEL'] * (euro / rates['EUR'])).toFixed(2),
      dollars: (rates['USD'] * (euro / rates['EUR'])).toFixed(2),
      ils: (rates['ILS'] * (euro / rates['EUR'])).toFixed(2),
    }));
  };

  const calculateFromUsd = (dollars) => {
    setState((prevState) => ({
      ...prevState,
      dollars: dollars,
      rubles: (dollars / rates['USD']).toFixed(2),
      euro: (rates['EUR'] * (dollars / rates['USD'])).toFixed(2),
      lari: (rates['GEL'] * (dollars / rates['USD'])).toFixed(2),
      ils: (rates['ILS'] * (dollars / rates['USD'])).toFixed(2),
    }));
  };

  const calculateFromIls = (ils) => {
    setState((prevState) => ({
      ...prevState,
      ils: ils,
      rubles: (ils / rates['ILS']).toFixed(2),
      euro: (rates['EUR'] * (ils / rates['ILS'])).toFixed(2),
      lari: (rates['GEL'] * (ils / rates['ILS'])).toFixed(2),
      dollars: (rates['USD'] * (ils / rates['ILS'])).toFixed(2),
    }));
  };


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

  const onChangeIls = (text) => {
    text = checkVal(text);
    setState((prevState) => ({ ...prevState, text }));
    calculateFromIls(text);
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
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title='Конвертик' alignment='center' accessoryRight={navigateInfo}/>
      <Divider/>
      <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Text style={styles.text} category='s1'>Рубли</Text>
        <Input
            style={styles.input}
            placeholder=''
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={onChangeRub}
            value={state.rubles.toString()}
        />
        <Text style={styles.text} category='s1'>Лари</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={onChangeLar}
            value={state.lari.toString()}
        />
        <Text style={styles.text} category='s1'>Евро</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            onChangeText={onChangeEur}
            value={state.euro.toString()}
        />
        <Text style={styles.text} category='s1'>Доллары</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            value={state.dollars.toString()}
            onChangeText={onChangeUsd}
        />
        <Text style={styles.text} category='s1'>Шекели</Text>
        <Input
            style={styles.input}
            size='medium'
            keyboardType='numeric' 
            clearTextOnFocus
            value={state.ils.toString()}
            onChangeText={onChangeIls}
        />
      </Layout>
    </SafeAreaView>
    );
  };
};