import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import axios from 'axios';
import { showUserFromStorage } from '../helperFunctions';
import { Button } from 'react-native-elements';
import {
  Image, TextInput, TouchableHighlight,
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
    // console.log('wants to join league', this.state);
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
      <ScrollView style={styles.root}>
        <View>
          <Text>User: {this.state.user.name}</Text>
          <Text onPress={this.signOut}>Sign out</Text>
        </View>
        <Text>Join a league</Text>
        <Text>Ask your league commissioner for league ID and PIN</Text>

        <Text>Enter League ID</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(id) => this.setState({ id })}
          value={this.state.text}
        />

        <Text>Enter League PIN</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(pin) => this.setState({ pin })}
          value={this.state.text}
        />

        {/* <TouchableHighlight
          style={{
            borderRadius: 10,
            backgroundColor: "yellow",
            marginTop: 20,
            marginBottom: 20
          }}>
          <Button
            onPress={this.joinLeague}
            title="Join"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            style={{ height: 40 }}
          />
        </TouchableHighlight> */}
        <View style={styles.button}>
          <Button
            title="Join League"
            loading={this.state.loading}
            raised={true}
            onPress={this.joinLeague}
          />
        </View>

        <Text>Don't have a league? <Text onPress={() => { this.props.navigation.navigate('CreateLeague') }}>Create one!</Text></Text>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#30343a',
    padding: 30
  },
  button: {
    marginTop: 30
  }

});

const mapStateToProps = (state) => {
  return {
    // picks: state.picks,
    // games: state.games,
    // others: state.others
  }
}

export default connect(mapStateToProps, {})(JoinLeagueScreen);
