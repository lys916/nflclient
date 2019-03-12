import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';


// redux stuff
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux/rootReducer';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)

);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    currentWeek: '1'
  };

  getUser = async () => {
    console.log('in app.js.. getUser async');
    try {
      const value = await AsyncStorage.getItem('user');
      return value;
    } catch (error) {
      // Error retrieving data
      alert(error);
    }
  }

  changeWeek = (week) => {
    this.setState({ currentWeek: week });
  }
  render() {
    console.log('in app.js.. render');
    const screenProps = {
      currentWeek: this.state.currentWeek,
      changeWeek: this.changeWeek
    }
    // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', screenProps);
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      console.log('in app.js.. loading not complete');
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      console.log('in app.js.. loading completed');
      return (
        <Provider store={store}>
          <View style={styles.container}>

            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator screenProps={screenProps} />
          </View>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    console.log('in app.js.. start loadResourceAsync');
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    console.log('in app.js.. finish loading');
    this.setState({ isLoadingComplete: true });

  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
