import React from 'react';
import { StyleSheet, SafeAreaView, AppState, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, Button, Icon, Divider, Layout, TopNavigation, TopNavigationAction, Input, ListItem, List, Card, InputClearButton, Modal } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import config from './app.json';
// import { View } from 'react-native-animatable';
// import curencies_symbol from './cur.json';
const curencies_symbol = require('./cur.json');

const BackIcon = (props) => (
	<Icon {...props} name='arrow-back' />
);

const CloseIcon = (props) => (
	<Icon {...props} name='close-outline' />
);


export const AddScreen = ({ navigation }) => {

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
		navigateBack();
	};
	
	React.useEffect(() => {
		// сохранение обновленного списка валют в AsyncStorage
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

				// const toDay = new Date();
				// const updDay = new Date(exchange.update_date.toString());
				// toDay.setDate(toDay.getDate() - 1);
				// if (toDay.getTime() < updDay.getTime()) { // разница между сохраненным значением и сегодняшней датой меньше суток
				 	setRates(exchange);
				// } else { // разница между сохраненным значением и сегодняшней датой больше суток
				//	fetchCurrencies();
				// }
			} else {
				fetchCurrencies();
			}

		} catch (error) {
			console.error('Error updating rates:', error);
		}
	};

	React.useEffect(() => {
		updateCurrencies();
	}, []);


	const themeContext = React.useContext(ThemeContext);

	const navigateBack = () => {
		navigation.goBack();
	};

	const BackAction = () => (
		<TopNavigationAction icon={BackIcon} onPress={navigateBack} />
	);
	const CloseAction = () => (
		<TopNavigationAction icon={CloseIcon} onPress={navigateBack} />
	);

	const getCurrencies = async () => {
		try {
			const exchengeRate = await AsyncStorage.getItem('exchange'); // получение данных
			if (exchengeRate !== null) {
				const exchange = JSON.parse(exchengeRate);
			}
		} catch (error) {
			console.error('Error updating rates:', error);
		}
	};

	React.useEffect(() => {
		getCurrencies();
	}, []);


	const [filterText, setFilterText] = React.useState('');
	  
	const filteredCurrencies = Object.values(curencies_symbol).filter(currency => {
			const { code, name_ru, name, symbol} = currency;
			const filterLower = filterText.toLowerCase();
			return (
				code.toLowerCase().includes(filterLower) ||
				name_ru.toLowerCase().includes(filterLower) ||
				name.toLowerCase().includes(filterLower) ||
				symbol.toLowerCase().includes(filterLower)
			);			
	});

	const filteredRates = rates ? Object.entries(rates)
      	.filter(([currency]) =>
        	filteredCurrencies.map(({ code }) => code).includes(currency)
      	)
  	: [];
	
	
	const renderItems = ({ item, index }) => {	
		if (!(item[0] in curencies_symbol)) {
			return null; 
		}
		else {
			return (
				<ListItem 
					key={item[0]} 
					title={`${curencies_symbol[item[0]].name_ru} ${curencies_symbol[item[0]].symbol}`}
					description={`1 ${curencies_symbol[item[0]].symbol} = ${(rates["RUB"]/item[1]).toFixed(2)} р. `}
					onPress={() => addCurrency(item[0])}
				/>
			)
		}
	};



	if (!rates) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<TopNavigation title='Конвертик' alignment='center' accessoryRight={BackAction} />
				<Divider />
				<Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={styles.text} category='h1'>Загрузка</Text>
				</Layout>
			</SafeAreaView>
		);
	}
	else {
		// console.log("Json 3:", JSON.stringify(Object.entries(rates)));
		return (
		<SafeAreaView style={{ flex: 1 }}>
			<TopNavigation
				title='Добавить валюту'
				alignment='center'
				//accessoryLeft={BackAction}
				accessoryRight={CloseAction} />
			<Divider />
			<Input
				placeholder='Найти по названию'
				style={{ marginLeft: 10, marginRight: 10 }}
				value={filterText}
				accessoryRight = {<Icon name={'search-outline'}/>}
				onChangeText={setFilterText}
				/>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
				<List
					keyboardDismissMode="on-drag"
					data={filteredRates}
					renderItem={renderItems}
					keyExtractor={([currency]) => currency}
					ItemSeparatorComponent={Divider}
				/>
			</KeyboardAvoidingView>

		</SafeAreaView>
		);
	}

};

const styles = StyleSheet.create({
	topContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	card: {
		width: '98%',
		flex: 1,
		margin: 2,
	},
	footerContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	footerControl: {
		marginHorizontal: 2,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	text: {
		marginTop: 15,
		marginLeft: 20,
		marginRight: 20,
	},
	input: {
		width: '98%',
	},
	clearButton: {
		color: 'red',
	},
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	backdrop: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	}, 
	modalContainer: {
		maxWidth: 300,
		maxHeight: 600,
	},
});