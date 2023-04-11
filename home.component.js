import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, RefreshControl, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import { Text, Button, Icon, Divider, Layout, TopNavigation, TopNavigationAction, Input, ListItem, List, Card, InputClearButton, Modal } from '@ui-kitten/components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormattedCurrency, FormattedNumber, FormattedMessage, IntlProvider } from 'react-intl';
import translations from './translations.json';
import { View } from 'react-native-animatable';
import curencies_symbol from './cur.json';

const InfoIcon = (props) => (
	<Icon {...props} name='info-outline' />
);
const AddIcon = (props) => (
	<Icon {...props} name='plus-outline' />
);

const CURRENCIES_API_URL = 'https://h304122827.nichost.ru/index_c.php';
// const CURRENCIES_API_URL = 'https://api.apilayer.com/exchangerates_data/latest';

export const HomeScreen = ({ navigation }) => {
	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = () => {
		setRefreshing(true);
		// здесь вы можете выполнить любую логику обновления данных
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
		// и после этого установить refreshing в false, чтобы скрыть индикатор обновления
		setRefreshing(false);
	  };

	const navigateDetails = () => {
		navigation.navigate('Details');
	};

	const navigateInfo = () => (
		<TopNavigationAction icon={InfoIcon} onPress={navigateDetails} />
	);

	const navigateAddScreen = () => {
		navigation.navigate('Add');
	};
	const navigateAdd = () => (
		<TopNavigationAction icon={AddIcon} onPress={navigateAddScreen} />
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

	const removeCurrency = (currency) => {
		// удаление валюты
		const { [currency]: _, ...newCurrencies } = state.cur;
		setState({ cur: newCurrencies });
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

	// const fetchCurrencies = async () => {
	// 	try {
	// 		const response = await axios.get(CURRENCIES_API_URL
	// 		);


	// 		setRates(response.data.rates);

	// 		response.data.rates.update_date = new Date().toISOString(); // Добавляем текущую дату
	// 		if (response && response.data && response.data.rates){
	// 			await AsyncStorage.setItem('exchange', JSON.stringify(response.data.rates)); // записываем в AsSt
	// 			setRates(response.data.rates);
	// 		}
	// 		else {
	// 			console.error('Error updating rates (response && response.data && response.data.rates):', error);
	// 		}
	// 	} 
	// 	catch (error) {
	// 		console.error('Error fetching rates:', error);
	// 	}
	// };

	const updateCurrencies = async () => {
		try {
			const exchengeRate = await AsyncStorage.getItem('exchange'); // получение данных

			if (exchengeRate !== null) {
				const exchange = JSON.parse(exchengeRate);

				//const toDay = new Date();
				//const updDay = new Date(exchange.update_date.toString());
				//toDay.setDate(toDay.getDate() - 1);
				//if (toDay.getTime() < updDay.getTime()) { // разница между сохраненным значением и сегодняшней датой меньше суток
				//	setRates(exchange);
				//} else { // разница между сохраненным значением и сегодняшней датой больше суток
					fetchCurrencies();
				//}
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
			for (const currency in prevState.cur) {
				newState.cur[currency] = rates[currency] * (text / rates[curCode]);
				if (currency === curCode) {
					newState.cur[currency] = newState.cur[currency].toFixed(0);
				} else {
					newState.cur[currency] = newState.cur[currency].toFixed(2);
				}

			}
			return newState;
		});
	};

	const DelIcon = (props) => (
		<Icon {...props} name='trash-outline' />
	);

	const renderItem = ({ currency, value, index }) => (
		<Card
			key={index}
			style={styles.card}
			header={() =>
				<Layout style={styles.container2}>
					<Layout style={styles.layout} level='1'>
						<Text
							style={styles.text}
							category='h6'
							currency={curencies_symbol[currency].name_ru}
							value={'1 ' + curencies_symbol[currency].symbol + ' = ' + (rates["RUB"] / rates[currency]).toFixed(2) + ' р.'}
						>
							{curencies_symbol[currency].name_ru}
						</Text>
						<Text
							style={styles.text}
							category='s1'
						>
							{'1 ' + curencies_symbol[currency].symbol + ' = ' + (rates["RUB"] / rates[currency]).toFixed(2) + ' р.'}
						</Text>
					</Layout>
					<Layout style={styles.layoutIcon} >
						<Button
							onPress={() => removeCurrency(currency)}
							style={{
								width: 24,
								height: 24,
							}}
							accessoryLeft={DelIcon}
							appearance='ghost' />
					</Layout>
				</Layout>
			}
		>
			<Input
				style={styles.input}
				size='medium'
				keyboardType='numeric'
				clearTextOnFocus
				onChangeText={(text) => onChange(text, currency)}
				value={value.toString()}
				clearButtonMode='while-editing'
				clearButton={() => <Icon name='close-outline' fill='red' />} // это не работает
				clearButtonStyle={styles.clearButton}
			/>
		</Card>
	);

	if (!rates) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<TopNavigation
					title='Конвертик'
					subtitle='обновляется'
					alignment='center'
					accessoryRight={navigateInfo}
				/>
				<Divider />
				<Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={styles.text} category='h1'>Загрузка</Text>
				</Layout>
			</SafeAreaView>
		);
	}
	else {
		// const updateDateEntry = Object.entries(rates).find(([currency]) => currency.includes('update_date'));
		// const updateDateString = updateDateEntry ? updateDateEntry[1] : '';
		const dateUpdate = new Date();
		const formattedDate = `${('0' + dateUpdate.getDate()).slice(-2)}.${('0' + (dateUpdate.getMonth() + 1)).slice(-2)}.${dateUpdate.getFullYear()}`;// ${('0' + dateUpdate.getHours()).slice(-2)}:${('0' + dateUpdate.getMinutes()).slice(-2)}`;


		return (
			<IntlProvider messages={translations} locale='en'>
				<SafeAreaView style={{ flex: 1 }}>

					<TopNavigation
						title='Конвертик'
						subtitle={`Курсы обновлены ${formattedDate}`}
						alignment='center'
						accessoryLeft={navigateInfo}
						accessoryRight={navigateAdd}
					/>
					<Divider />
					<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
						<ScrollView
							keyboardDismissMode="on-drag"
							refreshControl={
								<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
							}
						>
							<Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
								{Object.entries(state.cur).map(([currency, value], index) => renderItem({ currency, value, index }))}
							</Layout>
						</ScrollView>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</IntlProvider>
		);
	};
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
		marginTop: 5,
		marginLeft: 15,
		marginRight: 1,
		marginBottom: 5,
	},
	input: {
		width: '100%',
		margin: 2,
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
	container2: {
		flex: 1,
		flexDirection: 'row',
	},
	layout: {
		flex: 1,
		justifyContent: 'flex-start',
		//alignItems: 'center',
	},
	layoutIcon: {
		// flex: 1,
		// justifyContent: 'flex-start',
		//backgroundColor: 'rgba(0, 0, 0)',
		maxWidth: 24,
		height: 24,
		marginRight: 24,
	},
});