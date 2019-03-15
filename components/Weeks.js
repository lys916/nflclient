import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, View, Text, Picker, AsyncStorage } from 'react-native';
import { fetchSeason } from '../redux/userAction';
import { fetchLeague } from '../redux/leagueAction';
import { NavigationActions } from 'react-navigation';
import { Icon } from 'native-base';

import Colors from '../constants/Colors';

class Weeks extends React.Component {
  state = {
    user: {},
    week: null
  }

  async componentDidMount() {

    //get user to display, league object does not single user info
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    this.setState({ user });

    //   if (league.weeks[0].value > league.season.currentWeek.value) {
    //     this.setState({ viewWeek: league.weeks[0].name });
    //   } else {
    //     this.setState({ viewWeek: league.season.currentWeek.name });
    //   }

  }
  handleWeekChange = (week) => {
    this.props.screenProps.changeWeek(week);
    const setParamsAction = NavigationActions.setParams({
      params: { value: week },
      // key: 'screen-123',
    });
    this.props.navigation.dispatch(setParamsAction);
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
            {/* ??? selectedValue only works with object? -> screenProps.viewWeek */}
            {/* when changed to screenProps.viewWeek.name, it doesn't work */}
            <Picker
              selectedValue={this.props.screenProps.viewWeek}
              style={{ height: 50, width: 142 }}
              onValueChange={(week) => {
                console.log('start week change', Date.now());
                this.props.screenProps.changeWeek(week)
              }}
            >


              {
                this.props.league.weeks.map(week => {
                  return (
                    <Picker.Item label={week.name} value={week} key={week.value} />
                  );
                })
              }
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

    backgroundColor: 'white',
    elevation: 6,
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
    backgroundColor: '#efefef',
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
    borderColor: '#aaaaaa'
  }
});

const mapStateToProps = (state) => {
  return {
    league: state.league,
    season: state.season
  }
}

export default connect(mapStateToProps, { fetchLeague, fetchSeason })(Weeks);

