import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Linking } from 'react-native';
import { Divider, Icon, Layout, Text, Button, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';
import config from './app.json';

const BackIcon = (props) => (
	<Icon {...props} name='checkmark-outline' />
);

const CloseIcon = (props) => (
	<Icon {...props} name='close-outline' />
);


	const handleTelegramLink = async () => {
	  const telegramLink = 'https://t.me/yazydzhi';
	  const supported = await Linking.canOpenURL(telegramLink);
  
	  if (supported) {
		await Linking.openURL(telegramLink);
	  } else {
		console.log("Don't know how to open telegram link");
	  }
	};

	const privacyLink = async () => {
		const privLink = 'https://ivan-uzhas.github.io/convertik/privacy_policy_ru.html';
		const supported = await Linking.canOpenURL(privLink);
	
		if (supported) {
		  await Linking.openURL(privLink);
		} else {
		  console.log("Don't know how to open privacyLink");
		}
	  };

	  const termsLink = async () => {
		const termLink = 'https://ivan-uzhas.github.io/convertik/terms_and_conditions_ru.html';
		const supported = await Linking.canOpenURL(termLink);
	
		if (supported) {
		  await Linking.openURL(termLink);
		} else {
		  console.log("Don't know how to open termsLink");
		}
	  };

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
			margin: 10,
			marginLeft: 20,
		},
		controlContainer: {
			margin: 2,
			padding: 6,
			borderRadius: 4,
			justifyContent: 'center',
			backgroundColor: '#393646',
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
		<SafeAreaView style={{ flex: 1}}>
			<TopNavigation
				title='О приложении'
				alignment='center'
				accessoryLeft={BackAction}
				// accessoryRight={BackAction} 
			/>
			<Divider />
			<Layout
				style={{ 
					flex: 1, 
					//justifyContent: 'center', 
					alignItems: 'center'
				 }}>
				<Text style={styles.text} category='h4'>Настройки</Text>
				<Button
					style={styles.button} 
					accessoryLeft={<Icon name='moon-outline'/>}
					accessoryRight={<Icon name='sun-outline'/>}
					onPress={themeContext.toggleTheme} 
					// appearance='ghost' 
					appearance='outline'
					status='primary'>
						Тема
				</Button>
				<Text style={styles.text} category='h4'>О приложении</Text>
				<Text style={styles.text} >Версия приложения: {appState.version}</Text>
				<Text style={styles.text} >Дата сборки: {appState.buildDate}</Text>
				<Text style={styles.text} >Разработчик: Владимир Языджи</Text>
				<Button 
					style={styles.button} 
					accessoryLeft={<Icon name='paper-plane-outline'/>}
					//accessoryRight={<Icon name='sun-outline'/>}
					onPress={handleTelegramLink} 
					appearance='ghost' 
					// appearance='outline'
					status='primary'>
						Написать
				</Button>
				<Divider />
				<Text style={styles.text} onPress={privacyLink}>Политика конфиденциальности</Text>
				<Text style={styles.text} onPress={termsLink}>Усливия использования</Text>
			</Layout>
		</SafeAreaView>
	);

};