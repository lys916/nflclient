import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import axios from 'axios';
import {
  Image, TextInput, Button, KeyboardAvoidingView,
  Platform, Picker, Keyboard, Dimensions, UIManager,
  ScrollView, Animated, TouchableHighlight, AsyncStorage,
  StyleSheet, TouchableNativeFeedback,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const { State: TextInputState } = TextInput;
import { createLeague } from '../redux/leagueAction';
// import { WebBrowser } from 'expo';

// import { MonoText } from '../components/StyledText';

// import { createPick, deletePick, getPicks, updatePick } from '../redux/pickAction';

class CreateLeagueScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    name: '',
    pin: '',
    startWeek: '',
    endWeek: '',
    shift: new Animated.Value(0),
    weekError: '',
    user: {},
    nameError: null,
    pinError: null,
    startWeekError: null,
    endWeekError: null
  }

  async componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    this.setState({ user });
  }

  handleKeyboardDidShow = (event) => {

    const { height: windowHeight } = Dimensions.get('window');

    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    // console.log('keyboard showing height', keyboardHeight);
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= (0 + 100)) {
        // console.log('no gap');
        return;
      }
      // console.log('gap', gap);
      Animated.timing(
        this.state.shift,
        {
          toValue: gap - 100,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  handleKeyboardDidHide = () => {
    // console.log('keyboard hiding');
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }

  createLeague = async () => {
    const { name, pin, startWeek, endWeek, notes, nameError, pinError, startWeekError, endWeekError } = this.state;
    if (name === '') {
      this.setState({ nameError: 'Name is required' });
    } else { this.setState({ nameError: null }) }

    if (pin === '') {
      this.setState({ pinError: 'Pin is required' });
    } else if (pin.length !== 4) {
      this.setState({ pinError: 'Pin must be 4 digits' });
    } else { this.setState({ pinError: null }) }

    if (startWeek === '') {
      this.setState({ startWeekError: 'Start week is required' });
    } else if (startWeek > endWeek) {
      this.setState({ startWeek: 'Start week must be before end week' });
    } else { this.setState({ startWeekError: null }) }

    if (endWeek === '') {
      this.setState({ endWeekError: 'End week is required' });
    } else { this.setState({ endWEekError: null }) }


    if (!nameError || !pinError || !startWeekError || !endWeekError) {
      const jsonUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(jsonUser);

      const weekValues = [];
      const weeks = this.props.season.availableWeeks.filter(week => {
        if (week.value >= startWeek && week.value <= endWeek) {
          weekValues.push(week.value);
        }
        return week.value >= startWeek && week.value <= endWeek;
      });

      console.log('wants to join league');
      const league = { name, pin, weeks, notes, user: user._id, weekValues };
      // console.log('league to save', league);
      const res = await axios.post(`http://192.168.1.67:5000/league/create`, league);

      // console.log('league created', res.data);
      alert("You have succesfully created a league! You can invite players, get your league ID or PIN under 'Settings'.");

      // set updated user to asycn storage then redirect to Main screen
      const userData = JSON.stringify(res.data);
      await AsyncStorage.setItem('user', userData);
      this.props.navigation.navigate('Main');

    }

  }

  setstartWeek = (startWeek) => {
    if (this.state.endWeek !== '') {
      if (startWeek > this.state.endWeek) {
        this.setState({ weekError: 'Ending week must be after starting week.' });
      } else {
        this.setState({ startWeek });
      }

    } else {
      this.setState({ startWeek });
    }

  }

  setEndWeek = (endWeek) => {
    if (this.state.startWeek !== '') {

      if (endWeek < this.state.startWeek) {

        this.setState({ weekError: 'Ending week must be after starting week.' });
      }
      else {
        console.log('setting end week');
        this.setState({ endWeek });
      }

    } else {
      console.log('setting end week');
      this.setState({ endWeek });
    }

  }
  render() {
    const { shift } = this.state;
    console.log('create league renders');
    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
        <ScrollView style={styles.root}>
          <View style={styles.header}>
            <Text>You're logged in as: {this.state.user.name}</Text>
            <Text onPress={this.signOut}>Sign out</Text>
          </View>
          <Text style={styles.logo}>
            {/* Super Pick'em NFL */}
            Super Pick'em
                    </Text>

          <Text style={styles.label}>League Name* <Text style={{ color: 'red', fontSize: 14 }}>{this.state.nameError}</Text></Text>
          <TextInput
            style={styles.input}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.text}
          />

          <Text style={styles.label}>League PIN* <Text style={{ color: 'red', fontSize: 14 }}>{this.state.pinError}</Text></Text>
          <TextInput
            style={styles.input}
            onChangeText={(pin) => this.setState({ pin })}
            value={this.state.text}
          />
          <Text style={{ color: 'red', fontSize: 14 }}>{this.state.startWeekError}</Text>
          <Text style={{ color: 'red', fontSize: 14 }}>{this.state.endWEekError}</Text>
          <View style={styles.weekBox}>

            <View>

              <Text style={styles.labelStart}>Start week*</Text>
              <Picker
                selectedValue={this.state.startWeek}
                style={{ height: 50, width: 140 }}
                onValueChange={(startWeek) => { this.setstartWeek(startWeek) }}
              >
                <Picker.Item label="Select" value="" />
                {
                  this.props.season.availableWeeks.map(week => {
                    return (
                      <Picker.Item label={week.name} value={week.value} key={week.value} />
                    );
                  })
                }
              </Picker>
            </View>
            <View>

              <Text style={styles.labelEnd}>End week*</Text>
              <Picker
                selectedValue={this.state.endWeek}
                style={{ height: 50, width: 150 }}
                onValueChange={(endWeek) => { this.setEndWeek(endWeek) }}
              >
                <Picker.Item label="Select" value="" />
                {
                  this.props.season.availableWeeks.map(week => {
                    return (
                      <Picker.Item label={week.name} value={week.value} key={week.value} />
                    );
                  })
                }
              </Picker>
            </View>
          </View>


          <Text style={styles.labelEnd}>League notes ( you can edit it later )</Text>
          <TextInput
            style={styles.textArea}
            onChangeText={(notes) => this.setState({ notes })}
            value={this.state.text}
            multiline={true}
            numberOfLines={30}
          />
          <TouchableNativeFeedback onPress={this.createLeague} underlayColor="white">
            <View style={styles.button}>
              <Text style={styles.buttonText}>Join</Text>
            </View>
          </TouchableNativeFeedback >




          <Text style={styles.bottomText}>Already have a league? <Text style={{ color: '#0061ff' }} onPress={() => { this.props.navigation.navigate('JoinLeague') }}>Join!</Text></Text>


        </ScrollView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  root: {
    // flex: 1,
    backgroundColor: '#fff',
    padding: 30
  },
  textArea: {
    textAlignVertical: "top",
    height: 100,
    borderColor: 'gray',
    borderWidth: 1
  },
  weekBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
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
  labelStart: {
    fontSize: 18,
    marginTop: 10,
    paddingBottom: -10
  },
  labelEnd: {
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
    season: state.season,
    // games: state.games,
    // others: state.others
  }
}

export default connect(mapStateToProps, { createLeague })(CreateLeagueScreen);
