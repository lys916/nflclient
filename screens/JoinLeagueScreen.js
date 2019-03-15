import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import axios from 'axios';
import { showUserFromStorage } from '../helperFunctions';
import { Button } from 'react-native-elements';
import {
  Image, TextInput, TouchableHighlight, TouchableNativeFeedback,
  Platform, AsyncStorage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { WebBrowser } from 'expo';

// import { MonoText } from '../components/StyledText';

// import { createPick, deletePick, getPicks, updatePick } from '../redux/pickAction';

class JoinLeagueScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    id: '',
    pin: '',
    user: {},
    loading: false
  }

  async componentDidMount() {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    this.setState({ user });
  }

  joinLeague = async () => {

    const { id, pin } = this.state;
    if (id !== '' || pin !== '') {
      const jsonUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(jsonUser);
      // console.log('wants to join league');
      const league = { id, pin, user: user._id };
      // console.log('league to save', league);
      const res = await axios.post(`http://192.168.1.67:5000/league/join`, league);

      // handle league not found or incorrect pin
      if (res.data.errorMessage) {
        alert(res.data.errorMessage);
      } else {
        alert("You have succesfully joined a league!");
        // set updated user to asycn storage then redirect to Main screen
        const userData = JSON.stringify(res.data);
        await AsyncStorage.setItem('user', userData);
        this.props.navigation.navigate('Main');
      }
    } else {
      alert('missing field');
    }

  }

  signOut = async () => {
    await AsyncStorage.clear();
    const userToken = await AsyncStorage.getItem('user');
    // console.log('user auth after clear', userToken);
    this.props.navigation.navigate('Login');
  };
  render() {

    // showUserFromStorage('join league screen');
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <Text>You're logged in as: {this.state.user.name}</Text>
          <Text onPress={this.signOut}>Sign out</Text>
        </View>

        <Text style={styles.logo}>
          Super Pick'em
        </Text>

        <Text style={styles.label}>Enter League ID</Text>
        <TextInput
          style={styles.input}
          onChangeText={(id) => this.setState({ id })}
          value={this.state.text}
        />

        <Text style={styles.label}>Enter League PIN</Text>
        <TextInput
          style={styles.input}
          onChangeText={(pin) => this.setState({ pin })}
          value={this.state.text}
        />

        <TouchableNativeFeedback onPress={this.joinLeague} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Join</Text>
          </View>
        </TouchableNativeFeedback >

        <Text style={styles.bottomText}>Don't have a league? <Text onPress={() => { this.props.navigation.navigate('CreateLeague') }} style={{ color: '#0061ff' }}>Create one!</Text></Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    padding: 20,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    fontSize: 17,
    color: '#999999'
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

const mapStateToProps = (state) => {
  return {
    // picks: state.picks,
    // games: state.games,
    // others: state.others
  }
}

export default connect(mapStateToProps, {})(JoinLeagueScreen);
