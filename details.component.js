import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, AppState } from 'react-native';
import { Divider, Icon, Layout, Text, Button, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';
import config from './app.json';

const BackIcon = (props) => (
	<Icon {...props} name='checkmark-outline' />
);

const CloseIcon = (props) => (
	<Icon {...props} name='close-outline' />
);


export const DetailsScreen = ({ navigation }) => {

	const themeContext = React.useContext(ThemeContext);

	const navigateBack = () => {
		navigation.goBack();
	};

	const styles = StyleSheet.create({
		container: {
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
		button: {
			margin: 2,
		},
		controlContainer: {
			margin: 2,
			padding: 6,
			borderRadius: 4,
			justifyContent: 'center',
			backgroundColor: '#3366FF',
		},
		row: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		text: {
			margin: 2,
			marginLeft: 20,
		},
	});

	const BackAction = () => (
		<TopNavigationAction icon={BackIcon} onPress={navigateBack} />
	);
	const CloseAction = () => (
		<TopNavigationAction icon={CloseIcon} onPress={navigateBack} />
	);

	const [appState, setAppState] = useState({
		version: '',
		buildDate: '',
	});

	useEffect(() => {
		setAppState({
			version: config.version,
			buildDate: config.buildDate,
		});
	}, []);


	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TopNavigation
				title='Конвертик: Инфо'
				alignment='center'
				accessoryLeft={BackAction}
				accessoryRight={CloseAction} />
			<Divider />
			<Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
				<Text style={styles.text} category='h4'>Настройки</Text>
				<Button style={styles.button} onPress={themeContext.toggleTheme} appearance='ghost' status='primary'>
					Ночь / День
				</Button>
				<Text style={styles.text} category='h4'>О приложении</Text>
				<Text style={styles.text} >Версия приложения: {appState.version}</Text>
				<Text style={styles.text} >Дата сборки: {appState.buildDate}</Text>
				<Text style={styles.text} >Разработчик: Владимир Языджи</Text>
			</Layout>
		</SafeAreaView>
	);

};