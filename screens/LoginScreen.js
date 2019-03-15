import React from 'react';
import axios from 'axios';
import { ExpoConfigView } from '@expo/samples';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import {
    Image, Platform, ScrollView, StyleSheet, Text,
    TouchableOpacity, View, AsyncStorage, TextInput,
    Button, TouchableHighlight, TouchableNativeFeedback
} from 'react-native';
export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        email: '',
        password: '',
        emailError: null,
        passwordError: null
    }

    login = async () => {
        // console.log('user logging in');
        const { email, password, emailError, passwordError } = this.state;
        if (email === '') {
            await this.setState({ emailError: 'Email is required' });
        } else { await this.setState({ emailError: null }) }

        if (password === '') {
            await this.setState({ passwordError: 'Password is required' });
        } else { await this.setState({ passwordError: null }) }

        if (!this.state.emailError || !this.state.passwordError) {

            const user = { email, password };

            const res = await axios.post(`http://192.168.1.67:5000/user/login`, user);
            // console.log('after login', res.data);
            if (res.data.errorMessage) {
                alert(res.data.errorMessage);
                this.setState({ email: '', password: '' });
            } else {
                // save user to storage
                const userData = JSON.stringify(res.data);
                await AsyncStorage.setItem('user', userData);

                if (res.data.currentLeague) {
                    // alert('found current league');
                    this.props.navigation.navigate('Main');
                } else {
                    alert("It doesn't look like you're in any league, start by joining or creating one.");
                    this.props.navigation.navigate('JoinLeague');
                }

            }
        }



    };

    redirectSignup = () => {
        this.props.navigation.navigate('Signup');
    }

    render() {

        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        return (
            <View style={styles.root}>
                <View>
                    <Text style={styles.logo}>
                        {/* Super Pick'em NFL */}
                        Super Pick'em
                    </Text>
                </View>

                <Text style={styles.label}>Email <Text style={{ color: 'red', fontSize: 14 }}>{this.state.emailError}</Text></Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.text}
                />

                <Text style={styles.label}>Password <Text style={{ color: 'red', fontSize: 14 }}>{this.state.passwordError}</Text></Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.text}
                    secureTextEntry={true}
                />

                <TouchableNativeFeedback onPress={this.login} underlayColor="white">
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </View>
                </TouchableNativeFeedback >

                <Text style={styles.bottomText}>Don't have an account? <Text style={styles.textLink} onPress={this.redirectSignup}>Sign up!</Text></Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        padding: 20,
        backgroundColor: 'white'
    },
    logo: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 30,
        color: '#337ab7',
        marginBottom: 10
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
    },
    input: {
        height: 50,
        borderColor: '#ababab',
        borderWidth: 1,
        fontSize: 20,
        borderRadius: 5,
        padding: 3
    },
    label: {
        fontSize: 18,
        marginTop: 10
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: '#337ab7',
        borderRadius: 5
    },
    buttonText: {
        padding: 10,
        fontSize: 18,
        color: 'white'
    },
    bottomText: {
        fontSize: 17,
        textAlign: 'center'
    },
    textLink: {
        color: '#0061ff'
    }
});

