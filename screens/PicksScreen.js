import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import images from '../images';
import _ from 'underscore';
import { fetchLeague } from '../redux/leagueAction';
import { ScrollView, View, StyleSheet, Image, Text, RefreshControl, AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';

import {
  Card, CheckBox, Icon
} from 'native-base';

class Picks extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    gameView: true,
    playerView: false,
    refreshing: false,
    week: null
  }

  toggleView = () => {
    this.setState({
      gameView: !this.state.gameView,
      playerView: !this.state.playerView
    });
  }

  addUserListToGame = (games, picks) => {
    games.forEach(game => {
      // apply colors
      if (game.winner === 'pending') {
        game.roadColor = 'roadPending',
          game.homeColor = 'homePending'
      }
      if (game.winner === 'tie') {
        game.roadColor = 'roadTie',
          game.homeColor = 'homeTie'
      }
      if (game.winner === 'road') {
        game.roadColor = 'roadWin',
          game.homeColor = 'homeLose'
      }
      if (game.winner === 'home') {
        game.roadColor = 'roadLose',
          game.homeColor = 'homeWin'
      }
      if (!game.winner) {
        game.roadColor = 'roadOpen',
          game.homeColor = 'homeOpen'
      }

      game.roadUserList = [];
      game.homeUserList = [];
      picks.forEach(pick => {
        if (game.winner && game._id === pick.game._id && pick.selected === 'road') {
          game.roadUserList.push(pick.user.name);
        }
        if (game.winner && game._id === pick.game._id && pick.selected === 'home') {
          game.homeUserList.push(pick.user.name);
        }
      });
    });
  }

  getPlayerView = (picks, users) => {

    const Main = {};

    users.forEach(user => {
      // initialize all user for ranking
      Main[user._id] = {
        user,
        winPicks: [],
        lossPicks: [],
        tiePicks: [],
        pendingPicks: [],
        winCount: 0
      }
    });
    picks.forEach(pick => {
      // if game has started or ended
      if (pick.game.winner !== null) {
        if (pick.game.winner === 'tie') {
          Main[pick.user._id].tiePicks.push(pick);
        }
        else if (pick.game.winner === pick.selected) {
          Main[pick.user._id].winPicks.push(pick);
          Main[pick.user._id].winCount++;
        }
        else {
          Main[pick.user._id].lossPicks.push(pick);
        }
      }
    });
    return Object.values(Main).sort(function (a, b) { return b.winCount - a.winCount });
  }

  _onRefresh = async () => {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);

    this.setState({ refreshing: true });
    await this.props.fetchLeague(user.currentLeague);
    this.setState({ refreshing: false });
  }

  render() {

    const { league } = this.props;

    const games = league.games.filter(game => {
      return game.week === this.props.screenProps.viewWeek.value;
    });

    const picks = league.picks.filter(pick => {
      return pick.game.week === this.props.screenProps.viewWeek.value;
    });

    this.addUserListToGame(games, picks);
    const playerView = this.getPlayerView(picks, league.users);
    console.log('PLAYER VIEW', playerView);
    return (
      <ScrollView style={styles.root} stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {/* sticky weeks */}
        <View style={{ elevation: 10 }}>
          <Weeks screenProps={this.props.screenProps} navigation={this.props.navigation} />
        </View>

        <View style={styles.viewBox}>
          <View style={styles.gameView}>
            <CheckBox checked={this.state.gameView} onPress={this.toggleView} />
            <Text style={styles.viewTitle}>Game View</Text>
          </View>

          <View style={styles.playerView}>
            <CheckBox checked={this.state.playerView} onPress={this.toggleView} />
            <Text style={styles.viewTitle}>Player View</Text>
          </View>
        </View>

        {this.state.gameView ?
          // Game View
          <View>
            {games.map(game => {

              let dummyArray = [];

              if (game.roadUserList.length < game.homeUserList.length) {
                const len = game.homeUserList.length - game.roadUserList.length;
                dummyArray = _.range(len);
              }
              return (
                <Card key={game._id} style={styles.card}>

                  <View style={styles.dateBox}>
                    <Text style={styles.dateTime}>Sunday, September 7</Text>
                    <Text style={styles.dateTime}>10:00 AM</Text>
                  </View>

                  <View style={styles.gameBox}>
                    {/* Road Team */}
                    <View style={styles.leftSection}>

                      <View style={styles[game.roadColor]}>
                        <View style={styles.logoBox}>
                          <View>
                            <Image
                              style={{ height: 30, width: 30, marginRight: 8 }}
                              resizeMode="contain"
                              source={images.teams[game.roadTeam.name]}
                            />
                          </View>
                          <Text style={{ fontSize: 16 }}>{game.roadTeam.city}</Text>
                        </View>
                        <Text style={{ fontSize: 16 }}>{game.roadSpread}</Text>
                      </View>


                      <View style={styles.roadPlayersBox}>

                        {game.roadUserList.map((user, index) => {
                          return (

                            <View style={styles.playerBox} key={index}>
                              <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
                              <Text style={styles.userListName}>{user}</Text>
                            </View>
                          );
                        })}
                        {/* purpose of this dummyArray is to apply right border to road player section if its empty or less than the home section, therefore we also have to give the icon white color */}
                        {dummyArray.map(i => {
                          return (
                            <View style={styles.playerBox} key={i}>
                              <Icon style={{ fontSize: 20, color: 'white', marginLeft: 2, marginRight: 5 }} name='contact' />
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    {/* Home Team */}
                    <View style={styles.rightSection}>
                      <View style={styles[game.homeColor]}>
                        <View style={styles.logoBox}>
                          <View>
                            <Image
                              style={{ height: 30, width: 30, marginRight: 8 }}
                              resizeMode="contain"
                              source={images.teams[game.homeTeam.name]}
                            />
                          </View>
                          <Text style={{ fontSize: 16 }}>{game.homeTeam.city}</Text>
                        </View>
                        <Text style={{ fontSize: 16 }}>{game.homeSpread}</Text>
                      </View>
                      {game.homeUserList.length > 0 ?
                        <View style={styles.homePlayersBox}>

                          {game.homeUserList.map((user, index) => {
                            return (
                              <View style={styles.playerBox} key={index}>
                                <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
                                <Text style={styles.userListName}>{user}</Text>
                              </View>
                            );
                          })}
                        </View> : null
                      }
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
          :
          // Player View Style
          <View>
            {playerView.map((player, index) => {


              return (
                <Card key={index} style={styles.playerCard}>
                  {/* player name */}
                  <View style={styles.playerViewBox}>
                    <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
                    <Text style={styles.playerName}>{player.user.name}</Text>
                  </View>

                  <View style={styles.pickBox}>
                    {player.winPicks.map(pick => {
                      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', pick.selected)
                      return (
                        <View key={pick._id} style={styles.winImage}>
                          {/* <Text>{pick.game[pick.selected + 'Team'].city}</Text> */}
                          <Image
                            style={{ height: 30, width: 30, marginRight: 4 }}
                            resizeMode="contain"
                            source={images.teams[pick.game[pick.selected + 'Team'].name]}
                          />
                          <Text>{pick.game[pick.selected + 'Spread']}</Text>
                        </View>

                      );
                    })}

                  </View>

                  <View style={styles.pickBox}>
                    {player.lossPicks.map(pick => {
                      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', pick.selected)
                      return (
                        <View key={pick._id} style={styles.loseImage}>
                          {/* <Text>{pick.game[pick.selected + 'Team'].city}</Text> */}
                          <Image
                            style={{ height: 30, width: 30, marginRight: 4 }}
                            resizeMode="contain"
                            source={images.teams[pick.game[pick.selected + 'Team'].name]}
                          />
                          <Text>{pick.game[pick.selected + 'Spread']}</Text>
                        </View>

                      );
                    })}
                  </View>

                  <View style={styles.pickBox}>
                    {player.tiePicks.map(pick => {
                      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', pick.selected)
                      return (
                        <View key={pick._id} style={styles.tieImage}>
                          {/* <Text>{pick.game[pick.selected + 'Team'].city}</Text> */}
                          <Image
                            style={{ height: 30, width: 30, marginRight: 4 }}
                            resizeMode="contain"
                            source={images.teams[pick.game[pick.selected + 'Team'].name]}
                          />
                          <Text>{pick.game[pick.selected + 'Spread']}</Text>
                        </View>

                      );
                    })}
                  </View>

                  <View style={styles.pickBox}>
                    {player.pendingPicks.map(pick => {
                      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', pick.selected)
                      return (
                        <View key={pick._id} style={styles.pendingImage}>
                          {/* <Text>{pick.game[pick.selected + 'Team'].city}</Text> */}
                          <Image
                            style={{ height: 30, width: 30, marginRight: 4 }}
                            resizeMode="contain"
                            source={images.teams[pick.game[pick.selected + 'Team'].name]}
                          />
                          <Text>{pick.game[pick.selected + 'Spread']}</Text>
                        </View>

                      );
                    })}
                  </View>

                </Card>
              );
            })}
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#999999',
  },
  card: {
    marginBottom: 15
  },
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  dateTime: {
    color: '#777777'
  },
  viewBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10
  },
  gameView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4
  },
  playerView: {
    flexDirection: 'row',
    paddingBottom: 4,
    alignItems: 'center'
  },
  viewTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 20
  },
  gameBox: {
    flexDirection: 'row',
  },
  leftSection: {
    width: '50%',
  },
  rightSection: {
    width: '50%',
  },
  userListName: {
    fontSize: 16
  },
  roadOpen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: '#efefef',
    alignItems: 'center',
  },
  homeOpen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#efefef',
  },

  roadPending: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    borderRightWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
    backgroundColor: Colors.pendingColor

  },
  homePending: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: Colors.pendingColor
  },
  roadLose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: Colors.loseColor
  },
  homeLose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: Colors.loseColor
  },
  roadWin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: Colors.winColor
  },
  homeWin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: Colors.winColor
  },
  roadTie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    borderRightWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    backgroundColor: Colors.tieColor
  },
  homeTie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    borderColor: '#dedede',
    backgroundColor: Colors.tieColor
  },


  logoBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roadPlayersBox: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#dedede',
  },
  homePlayersBox: {
    padding: 5,

  },
  playerBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: 'white'
  },

  // Player View
  playerCard: {
    paddingBottom: 13,
    marginBottom: 15
  },
  playerViewBox: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef'
  },
  playerName: {
    fontSize: 17
  },
  pickBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  winImage: {
    padding: 10,
    backgroundColor: Colors.winColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  loseImage: {
    padding: 10,
    backgroundColor: Colors.loseColor, flexDirection: 'row',
    alignItems: 'center'
  },
  tieImage: {
    padding: 10,
    backgroundColor: Colors.tieColor, flexDirection: 'row',
    alignItems: 'center'
  },

  pendingImage: {
    padding: 10,
    backgroundColor: Colors.pendingColor, flexDirection: 'row',
    alignItems: 'center'
  }

});


const mapStateToProps = (state) => {
  return {
    league: state.league
  }
}
export default connect(mapStateToProps, { fetchLeague })(Picks);
