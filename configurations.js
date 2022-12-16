import React from 'react';
import {Colors, View, Text, TouchableOpacity, UIComponent} from 'react-native-ui-lib';
import {menuStructure, loadDemoConfigurations} from 'unicorn-demo-app';

loadDemoConfigurations();

UIComponent.defaultProps = {};
UIComponent.defaultProps.onError = error => console.error(error);
UIComponent.defaultProps.renderError = <View><Text>A componenent fail to render</Text></View>;