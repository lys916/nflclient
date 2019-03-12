import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Image, AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  signOut = async () => {
    await AsyncStorage.clear();
    const userToken = await AsyncStorage.getItem('user');
    // console.log('user auth after clear', userToken);
    this.props.navigation.navigate('Login');
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View><Text onPress={this.signOut}>Sign Out</Text></View>
    );
  }
}


