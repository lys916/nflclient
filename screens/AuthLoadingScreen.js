import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const jsonUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(jsonUser);

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        if (!user) {
            this.props.navigation.navigate('Login');
        } else {
            if (!user.currentLeague) {
                this.props.navigation.navigate('JoinLeague');
            } else {
                this.props.navigation.navigate('Main');
            }
        }

    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}