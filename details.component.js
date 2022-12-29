import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Divider, Icon, Layout, Text, Button, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import { ThemeContext } from './theme-context';

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
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
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );
  const CloseAction = () => (
    <TopNavigationAction icon={CloseIcon} onPress={navigateBack}/>
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation 
            title='Конвертик: Инфо' 
            alignment='center' 
            accessoryLeft={BackAction}
            accessoryRight={CloseAction}/>
        <Divider/>
        <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Text style={styles.text} category='h4'>Настройки</Text>
            <Button style={styles.button} onPress={themeContext.toggleTheme} appearance='ghost' status='primary'>
                Ночь / День
            </Button>
            <Text style={styles.text} category='h4'>О приложении</Text>
            <Text style={styles.text}>Версия: 0.1 (29.12.2022)</Text>
            <Text style={styles.text}>Разработчик: Владимир Языджи</Text>
        </Layout>
    </SafeAreaView>
  );
   
};