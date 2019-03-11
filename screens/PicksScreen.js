import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import images from '../images';

import { ScrollView, View, StyleSheet, Image, Text, Switch, Slider } from 'react-native';
import { ExpoLinksView } from '@expo/samples';


import {
  Container, StatusBar, Header, Segment, Button,
  Content, Card, CardItem, CheckBox,
  Body, Icon, Spinner
} from 'native-base';




class Picks extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    gameView: true,
    playerView: false
  }

  toggleView = () => {
    console.log('sldkfj');
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
    console.log('FIRST XXXXXXXXXXXX', );

  }

  render() {
    const { games } = this.props;

    this.addUserListToGame(games, this.props.picks);
    console.log('SECONDXXXXXXXXXXXX', games);
    return (
      <ScrollView style={styles.root}>
        <Weeks screenProps={this.props.screenProps} />

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
                          <Text>{game.roadTeam.city}</Text>
                        </View>
                        <Text>{game.roadSpread}</Text>
                      </View>

                      {game.roadUserList.length > 0 ?
                        <View style={styles.roadPlayersBox}>

                          {game.roadUserList.map((user, index) => {
                            return (

                              <View style={styles.playerBox} key={index}>
                                <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
                                <Text>{user}</Text>
                              </View>
                            );
                          })}

                        </View> : null
                      }
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
                          <Text>{game.homeTeam.city}</Text>
                        </View>
                        <Text>{game.homeSpread}</Text>
                      </View>
                      {game.homeUserList.length > 0 ?
                        <View style={styles.homePlayersBox}>

                          {game.homeUserList.map((user, index) => {
                            return (
                              <View style={styles.playerBox} key={index}>
                                <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
                                <Text>{user}</Text>
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
          // User View
          <View style={styles.table}>
            <Text style={styles.username}>Lo Saephan</Text>

            <View style={styles.headerBox}>
              <Text style={styles.header}>Games</Text>
              <Text style={styles.header}>Picks</Text>
            </View>

            <View style={styles.dataBox}>
              <Text style={styles.data}>Patriots -7 at Rams +7</Text>
              <Text style={styles.data}>Patriots -7</Text>
            </View>

          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#999999'
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
    justifyContent: 'space-around'
  },
  gameView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5
  },
  playerView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 20
  },
  card: {
    marginBottom: 20
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
    backgroundColor: '#dedede'
  },
  homePending: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: '#dedede'
  },
  roadLose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: '#ffe2e2'
  },
  homeLose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: '#ffe2e2'
  },
  roadWin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: '#e5ffe2'
  },
  homeWin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    backgroundColor: '#e5ffe2'
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
    backgroundColor: '#e2edff'
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
    backgroundColor: '#e2edff'
  },


  logoBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roadPlayersBox: {
    padding: 10,

  },
  homePlayersBox: {
    padding: 10,

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
  }
});

const mapStateToProps = (state) => {
  return {
    picks: state.picks,
    games: state.games,
    // others: state.others
  }
}

export default connect(mapStateToProps, {})(Picks);
