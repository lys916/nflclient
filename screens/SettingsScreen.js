import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import axios from 'axios';
import {
  Image, AsyncStorage, TextInput, TouchableHighlight, Button,
  Platform, ProgressBarAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    emails: '',
    phoneNumbers: '',
    inviting: false,
    invalid: false
  }
  componentDidMount() {
    // this.props.navigation.addListener('willFocus', (route) => {
    //   this.props.screenProps.changeScreen('settings');
    // });
  }
  signOut = async () => {
    await AsyncStorage.clear();
    const userToken = await AsyncStorage.getItem('user');
    // console.log('user auth after clear', userToken);
    this.props.navigation.navigate('Login');
  };

  validatedEmail = () => {
    const arr = this.state.emails.split(' ');
    const filtered = arr.filter(e => e !== '');
    let validated = true;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    filtered.forEach(email => {
      if (re.test(String(email).toLowerCase()) === false) {
        validated = false;
      }
    });
    return validated;
  }

  sendInvite = async () => {
    if (this.state.emails === '') {
      this.setState({ invalid: 'Please enter email.' });
    }
    else if (this.validatedEmail() && !this.state.inviting) {
      console.log('good to go');
      this.setState({ inviting: true, invalid: false });
      const jsonUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(jsonUser);
      if (user) {
        const invite = {
          user,
          emails: this.state.emails,
          league: {
            leagueName: this.props.league.name,
            leaguePin: this.props.league.pin,
            leagueId: this.props.league.leagueId,
            startWeek: this.props.league.weeks[0].name,
            endWeek: this.props.league.weeks[this.props.league.weeks.length - 1].name,
            leagueNotes: this.props.league.notes,
          }
        }
        const res = await axios.post(`http://192.168.1.67:5000/user/invite`, invite)
        console.log(res.data);
        alert('Invitation sent!');
        if (res.data.sent) {
          this.setState({ inviting: false, emails: '' });
        }
      }
    } else {
      this.setState({ invalid: 'Invalid email, please check and try again.' });
    }

  }
  render() {

    const { pin, leagueId, notes, name } = this.props.league;
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScrollView style={styles.root}>
        <View><Text onPress={this.signOut}>Sign Out</Text></View>
        <View><Text>{pin}</Text></View>
        <View><Text>{leagueId}</Text></View>
        <View><Text>{notes}</Text></View>
        <View><Text>{name}</Text></View>


        <Text>Enter email (Can be multiple emails seperated by space.)</Text>
        <Text>e.g: example1@mail.com example2@email.com</Text>
        <TextInput
          style={styles.textArea}
          onChangeText={(emails) => this.setState({ emails })}
          value={this.state.emails}
          multiline={true}
          numberOfLines={30}
        />
        {this.state.invalid ? <Text style={{ color: 'red' }}>{this.state.invalid}</Text> : <Text> </Text>}
        <TouchableHighlight
          style={{
            borderRadius: 10,
            backgroundColor: "yellow",
            marginTop: 20,
            marginBottom: 20
          }}>
          {this.state.inviting ? <ProgressBarAndroid /> :
            <Button
              onPress={this.sendInvite}
              title="Invite"
              color="#337ab7"
              accessibilityLabel="Learn more about this purple button"
              style={styles.button}
            />}
        </TouchableHighlight>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  textArea: {
    textAlignVertical: "top",
    height: 100,
    borderColor: 'gray',
    borderWidth: 1
  },
  button: {
    marginTop: 10,
    marginBottom: 10
  },

});

const mapStateToProps = (state) => {
  return {
    users: state.users,
    picks: state.picks,
    league: state.league
    // games: state.games,
    // others: state.others
  }
}

export default connect(mapStateToProps, {})(SettingsScreen);


