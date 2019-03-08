import React from 'react';
import { connect } from 'react-redux';

import { Icon } from 'expo';
import { Platform, ScrollView, StyleSheet, View, Text, Picker, AsyncStorage } from 'react-native';
import { fetchGames } from '../redux/gameAction';
import { fetchLeague } from '../redux/leagueAction';
import { fetchUsers } from '../redux/userAction';


import Colors from '../constants/Colors';

class Weeks extends React.Component {
  state = {

  }
  async componentDidMount() {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
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
        <Text>League: {this.props.league.name}</Text>
        <Picker
          selectedValue={this.props.screenProps.currentWeek}
          style={{ height: 50, width: 120 }}
          onValueChange={(week) => { this.handleValueChange(week) }}
        >
          <Picker.Item label="Week 1" value="1" />
          <Picker.Item label="Week 2" value="2" />
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderColor: '#efefef',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => {
  return {
    // picks: state.picks,
    // others: state.others
    league: state.league
  }
}

export default connect(mapStateToProps, { fetchGames, fetchLeague, fetchUsers })(Weeks);