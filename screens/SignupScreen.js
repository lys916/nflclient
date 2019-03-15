import React from 'react';
import axios from 'axios';
import { ExpoConfigView } from '@expo/samples';
import {
    Image, Platform, ScrollView, StyleSheet, Text,
    TouchableOpacity, View, AsyncStorage, TextInput,
    Button, TouchableNativeFeedback, Alert
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

    signup = async () => {
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

            Alert.alert(
                "Welcome to Super Pick'em.",
                'Would you like to start by joining a league or creating a new league?',
                [
                    {
                        text: 'CREATE A NEW LEAGUE',
                        onPress: () => this.props.navigation.navigate('CreateLeague')
                    },
                    {
                        text: 'JOIN A LEAGUE',
                        onPress: () => this.props.navigation.navigate('JoinLeague')
                    },
                ],
                { cancelable: false },
            );


        }
    };

    render() {
        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        return (
            <View style={styles.root}>
                <View>
                    <Text style={styles.logo}>
                        Super Pick'em
                    </Text>
                </View>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(name) => this.setState({ name })}
                    value={this.state.text}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.text}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.text}
                    secureTextEntry={true}
                />

                <TouchableNativeFeedback onPress={this.signup} underlayColor="white">
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </View>
                </TouchableNativeFeedback >

                <Text style={styles.bottomText}>Already have an account? <Text style={styles.textLink} onPress={() => { this.props.navigation.navigate('Login') }}>Login!</Text></Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        padding: 20,
        backgroundColor: 'white'
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
        color: '#337ab7'
    },
    logo: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 30,
        color: '#337ab7',
        marginBottom: 10
    },
});

