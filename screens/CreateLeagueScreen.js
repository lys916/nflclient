import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import axios from 'axios';
import {
  Image, TextInput, Button, KeyboardAvoidingView,
  Platform, Picker, Keyboard, Dimensions, UIManager,
  ScrollView, Animated, TouchableHighlight, AsyncStorage,
  StyleSheet,
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
    weekError: ''
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
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


    const { name, pin, startWeek, endWeek, notes } = this.state;
    if (name !== '' || pin !== '' || startWeek !== '' || endWeek !== '') {
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

    } else {
      alert('missing field');
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
          <Text>Create a league</Text>

          <Text>League Name*</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.text}
          />

          <Text>League PIN*</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(pin) => this.setState({ pin })}
            value={this.state.text}
          />

          <View style={styles.weekBox}>
            <View>
              <Text>Start week*</Text>
              <Picker
                selectedValue={this.state.startWeek}
                style={{ height: 50, width: 120 }}
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

              <Text>End week*</Text>
              <Picker
                selectedValue={this.state.endWeek}
                style={{ height: 50, width: 120 }}
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


          <Text>League rules or notes (buy-in, payout, fees etc)</Text>
          <TextInput
            style={styles.textArea}
            onChangeText={(notes) => this.setState({ notes })}
            value={this.state.text}
            multiline={true}
            numberOfLines={30}
          />
          <TouchableHighlight
            style={{
              borderRadius: 10,
              backgroundColor: "yellow",
              marginTop: 20,
              marginBottom: 20
            }}>
            <Button
              onPress={this.createLeague}
              title="Create"
              color="#337ab7"
              accessibilityLabel="Learn more about this purple button"
              style={styles.button}
            />
          </TouchableHighlight>



          <Text >Already have league? <Text onPress={() => { this.props.navigation.navigate('JoinLeague') }}>Join!</Text></Text>


        </ScrollView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
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
  button: {
    marginTop: 10,
    marginBottom: 10
  },
  weekBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state) => {
  return {
    season: state.season,
    // games: state.games,
    // others: state.others
  }
}

export default connect(mapStateToProps, { createLeague })(CreateLeagueScreen);
