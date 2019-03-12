import React from 'react';
import axios from 'axios';
import { ExpoConfigView } from '@expo/samples';
import {
    Image, Platform, ScrollView, StyleSheet, Text,
    TouchableOpacity, View, AsyncStorage, TextInput,
    Button
} from 'react-native';
export default class Signup extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        name: '',
        email: '',
        password: ''
    }

    login = async () => {
        // console.log('user signing up');
        const { name, email, password } = this.state;
        const user = { name, email, password };
        const res = await axios.post(`http://192.168.1.67:5000/user/signup`, user);

        // console.log('after saved from server', res.data);

        if (res.data.errorMessage) {
            alert(res.data.errorMessage);
            this.props.navigation.navigate('Login');

        } else {
            const userData = JSON.stringify(res.data);
            await AsyncStorage.setItem('user', userData);
            alert("Welcome!, let's start by creating or joining a league.");
            this.props.navigation.navigate('JoinLeague');
        }


    };

    render() {
        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        return (
            <View style={styles.root}>
                <View>
                    <Text>
                        Super Pick'em NFL - Sign up
                    </Text>
                </View>
                <Text>Name</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(name) => this.setState({ name })}
                    value={this.state.text}
                />

                <Text>Email</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.text}
                />

                <Text>Password</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.text}
                    secureTextEntry={true}
                />

                <Button
                    onPress={this.login}
                    title="Signup"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />

                <Text style={styles.bottomText}>Already have an account? <Text style={styles.textLink} onPress={() => { this.props.navigation.navigate('Login') }}>Login!</Text></Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        padding: 30
    },
    gameBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        padding: 20
    },
    teamBox: {
        width: '45%',
    },
    teamBoxSelected: {
        width: '45%',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: 'blue'
    },
    teamName: {
        textAlign: 'center'
    }
});

