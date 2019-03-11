import React from 'react';
import { connect } from 'react-redux';

import { Platform, ScrollView, StyleSheet, View, Text, Picker, AsyncStorage } from 'react-native';
import { fetchGames } from '../redux/gameAction';
import { fetchLeague } from '../redux/leagueAction';
import { fetchUsers } from '../redux/userAction';

import { Icon } from 'native-base';

import Colors from '../constants/Colors';

class Weeks extends React.Component {
  state = {
    user: {}
  }
  async componentDidMount() {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    this.setState({ user });
    //fetch game
    this.props.fetchGames(this.props.screenProps.currentWeek);

    //fetch league and users
    if (user.currentLeague) {
      this.props.fetchLeague(user.currentLeague);
      this.props.fetchUsers(user.currentLeague);
    } else {
      alert("You don't belong to any league yet. You will get redirected to join a league.");
    }
  }
  handleValueChange = (week) => {
    // console.log(week);
    this.props.screenProps.changeWeek(week);
    this.props.fetchGames(week);
  }
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.userLeague}>
          <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
          <Text style={styles.user}>
            {this.state.user.name}
          </Text>
          <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='bookmark' />
          <Text>
            {this.props.league.name}
          </Text>
        </View>

        <View style={styles.weekBox}>
          <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='calendar' />
          <Picker
            selectedValue={this.props.screenProps.currentWeek}
            style={{ height: 50, width: 120 }}
            onValueChange={(week) => { this.handleValueChange(week) }}
          >
            <Picker.Item label="Week 1" value="1" />
            <Picker.Item label="Week 2" value="2" />
          </Picker>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderColor: '#efefef',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 80,
    elevation: 8
  },
  userLeague: {
    flexDirection: 'row',
  },
  user: {
    marginRight: 10
  },
  weekBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },

});

const mapStateToProps = (state) => {
  return {
    // picks: state.picks,
    // others: state.others
    league: state.league
  }
}

export default connect(mapStateToProps, { fetchGames, fetchLeague, fetchUsers })(Weeks);