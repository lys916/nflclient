import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import images from '../images';
import _ from 'underscore';
import { fetchGames } from '../redux/gameAction';
import { fetchLeague } from '../redux/leagueAction';
import { ScrollView, View, StyleSheet, Image, Text, Switch, Slider, RefreshControl, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Colors from '../constants/Colors';

import {
  Container, StatusBar, Header, Segment, Button,
  Content, Card, CardItem, CheckBox,
  Body, Icon, Spinner
} from 'native-base';




class Picks extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // navigation.addListener('willFocus', () => {
    //   const screenProps = navigation.getScreenProps();
    //   screenProps.changeScreen('picks');
    //   console.log('Listener revoke');
    // });
    return { header: null }
  }

  state = {
    gameView: true,
    playerView: false,
    refreshing: false,
    week: null
  }


  // componentWillReceiveProps(nextProps) {
  //   console.log('WILL RECEIVE PROPS', nextProps.screenProps);
  //   this.setState({ week: nextProps.screenProps.viewWeek.name });
  // }

  componentDidMount() {
    // this.props.navigation.addListener('willFocus', (route) => {
    //   this.props.screenProps.changeScreen('picks');
    // });
  }

  toggleView = () => {
    // console.log('sldkfj');
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
    // console.log('FIRST XXXXXXXXXXXX', );

  }

  _onRefresh = async () => {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);

    this.setState({ refreshing: true });
    await this.props.fetchLeague(user.currentLeague);
    this.setState({ refreshing: false });
  }

  render() {
    console.log('Pick Screen navigation', this.props.navigation.state);
    const { league } = this.props;

    const games = league.games.filter(game => {
      // console.log(game.week.value, this.props.screenProps.viewWeek.value);
      return game.week === this.props.screenProps.viewWeek.value;
    });
    // console.log('after filter len', games.length);



    const picks = league.picks.filter(pick => {
      return pick.game.week === this.props.screenProps.viewWeek.value;
    });

    this.addUserListToGame(games, picks);
    // console.log('pick screen nagivation', this.props.navigation);
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
                // console.log('LEN???', len)
                dummyArray = _.range(len);
              }
              // console.log('DUMMY FROM MAP', dummyArray);
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


                      <View style={styles.roadPlayersBox}>

                        {game.roadUserList.map((user, index) => {
                          return (

                            <View style={styles.playerBox} key={index}>
                              <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
                              <Text>{user}</Text>
                            </View>
                          );
                        })}
                        {/* purpose of this dummyArray is to apply right border to road player section if its empty of less than the home section, therefore we have to give the icon white color */}
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
  }
});

const mapStateToProps = (state) => {
  return {
    league: state.league
    // others: state.others
  }
}

export default connect(mapStateToProps, { fetchGames, fetchLeague })(Picks);
