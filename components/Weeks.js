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
    const result = await this.props.fetchGames(this.props.screenProps.currentWeek, user.currentLeague);

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
        <View style={styles.userLeagueWeekBox} >

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
        {/* Color representatiosn */}
        <View style={styles.colorsBox}>

          <View style={styles.colorBox}>
            <View style={styles.winIcon}></View><Text style={styles.winTitle}>Win</Text>
          </View>

          <View style={styles.colorBox}>
            <View style={styles.loseIcon}></View><Text style={styles.loseTitle}>Lose</Text>
          </View>

          <View style={styles.colorBox}>
            <View style={styles.tieIcon}></View><Text style={styles.winTitle}>Tie</Text>
          </View>

          <View style={styles.colorBox}>
            <View style={styles.pendingIcon}></View><Text style={styles.loseTitle}>In progress</Text>
          </View>

          <View style={styles.colorBox}>
            <View style={styles.openIcon}></View><Text style={styles.winTitle}>Open</Text>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderColor: '#efefef',
    backgroundColor: 'white',
    marginBottom: 10,
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 100,
    elevation: 8
  },
  userLeagueWeekBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  colorsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#efefef',
    paddingTop: 2
  },
  colorBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  winIcon: {
    width: 15,
    height: 15,
    backgroundColor: Colors.repColors.win,
    marginRight: 3,
  },
  loseIcon: {
    width: 15,
    height: 15,
    backgroundColor: Colors.repColors.lose,
    marginRight: 3,
  },
  tieIcon: {
    width: 15,
    height: 15,
    backgroundColor: Colors.repColors.tie,
    marginRight: 3,
  },
  pendingIcon: {
    width: 15,
    height: 15,
    backgroundColor: Colors.repColors.pending,
    marginRight: 3,
  },
  openIcon: {
    width: 15,
    height: 15,
    marginRight: 3,
    borderWidth: 1,
    borderColor: '#dedede'
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