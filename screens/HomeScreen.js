import React from 'react';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Colors from '../constants/Colors';
import Weeks from '../components/Weeks';
import images from '../images';
import { fetchLeague } from '../redux/leagueAction';
import { fetchGames } from '../redux/gameAction';
import { Card, CardItem, Text, Icon } from 'native-base';
import { Image, AsyncStorage, ScrollView, StyleSheet, ProgressBarAndroid, TouchableWithoutFeedback, View, Picker, RefreshControl, TouchableNativeFeedback, Alert } from 'react-native';
import { NavigationEvents } from 'react-navigation';

// var date = new Date('6/29/2011 1:00:00 AM UTC');
// console.log('MY TIME MMMMMMM', date.toString());



import { createPick, deletePick, getPicks, updatePick } from '../redux/pickAction';
import { fetchUsers, fetchSeason } from '../redux/userAction';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // navigation.addListener('willFocus', () => {
    //   const screenProps = navigation.getScreenProps();
    //   screenProps.changeScreen('games');
    //   console.log('Listener revoke');
    // });
    return { header: null }
  }

  state = {
    loadingIndex: null,
    user: {},
    refreshing: false,
  }

  // setModalVisible(visible) {
  //   this.setState({ modalVisible: visible });
  // }

  async componentDidMount() {
    // this.props.navigation.addListener('willFocus', (route) => {
    //   this.props.screenProps.changeScreen('games');
    // });
    this.props.screenProps.changeScreen('games');
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    // set user for refresh fetching games
    this.setState({ user });
    if (user) {
      // this.setState({ user });

      // fetch league and season here
      // so we can use it to set the weekly dropdown

      // if (user.currentLeague) {

      const league = await this.props.fetchLeague(user.currentLeague);
      // const season = await this.props.fetchSeason();
      if (league) {
        if (league.weeks[0].value > league.season.currentWeek.value) {
          this.props.screenProps.changeWeek(league.weeks[0]);
        } else {
          this.props.screenProps.changeWeek(league.season.currentWeek);
        }
      }


      // }

      //fetch game
      // const result = await this.props.fetchGames(user.currentLeague);

      // if (result.) { 

      // }
    }


    //before the component renders, we want to load the user for later use
    // const jsonUser = await AsyncStorage.getItem('user');
    // const user = JSON.parse(jsonUser);
    // this.setState({ user });

    // this.props.getPicks(user.currentLeague);
    //fetch league and user list
    // if (user.currentLeague) {

    //   // console.log('fetching users', user.currentLeague);
    //   this.props.fetchUsers(user.currentLeague);
    // } else {
    //   alert("You don't belong to any league yet. You will get redirected to join a league.");
    // }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('screen props', this.props.screenProps, nextProps.screenProps);
  //   if (this.props.screenProps.screen !== nextProps.screenProps.screen) {
  //     return false;
  //   }
  //   return true;
  // }

  addPickToGame = (games, picks) => {
    if (games.length > 0) {
      games.forEach(game => {
        // to start off, we assume none of the game has been selected
        game.selected = null;
        game.localPickId = null;
        game.pickImage = null;

        // assume all games open for selection
        game.result = 'open';


        // loop through picks to match the game
        picks.forEach(pick => {
          // game._id === pick.game._id && 
          // console.log('ZZZZZZZZZZZZZZZ: ', pick);
          // alert(user._id);
          if (game._id === pick.game._id && pick.user._id === this.state.user._id) {

            // if user made a selection for this game, apply selection
            game.selected = pick.selected;
            game.localPickId = pick._id;
            game.pickImage = game[pick.selected + 'Team'].name;

            // if game is locked, get lose or win result otherwise leave at pending
            if (game.winner) {
              // change result to either win, lose or tie
              if (game.winner === 'tie') {
                game.result = 'tie';
              } else if (game.winner === 'pending') {
                console.log('pending', game.roadTeam.city);
                game.result = 'pending';
              }
              else if (game.winner === pick.selected) {
                game.result = 'win';
              }
              else {
                game.result = 'lose'
              }
            }
          }

        });
        // console.log('????????????', game.selected);
        if (!game.selected && game.winner !== null) {
          // console.log('applying lose to result');
          game.result = 'lose';
        }
      });

    }
    // console.log('BEFORE', games);
  }

  handleCreatePick = async (game, selected, index) => {
    // game has a winner or already started then do nothing
    if (game.winner) {
      return;
    }
    // prevent user from tapping too fast when pick is still loading
    if (this.state.loadingIndex !== null) {
      return;
    }


    // get user from storage
    // const jsonUser = await AsyncStorage.getItem('user');
    // const user = JSON.parse(jsonUser);
    const { user } = this.state;

    // if game has no selection, we want to create a new pick
    if (!game.selected) {
      const pick = {
        game: game._id,
        user: user._id,
        league: user.currentLeague,
        selected
      };
      this.setState({ loadingIndex: index });
      await this.props.createPick(pick);
      this.setState({ loadingIndex: null });
    }
    // if game has the same selection, we want to delete that selection
    else if (game.selected === selected) {

      Alert.alert(
        '',
        'Are you sure you want to delete this pick?',
        [
          {
            text: 'CANCEL',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'YES', onPress: () => this.deletePick(game.localPickId, index) },
        ],
        { cancelable: false },
      );


    }
    // else we want to edit the selection
    else {
      Alert.alert(
        '',
        'Are you sure you want to switch the pick?',
        [
          {
            text: 'CANCEL',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'YES', onPress: () => this.updatePick(game.localPickId, index) },
        ],
        { cancelable: false },
      );

    }

  }

  updatePick = async (pickId, index) => {
    this.setState({ loadingIndex: index });
    await this.props.updatePick(pickId);
    this.setState({ loadingIndex: null });
  }

  deletePick = async (pickId, index) => {
    this.setState({ loadingIndex: index });
    await this.props.deletePick(pickId);
    this.setState({ loadingIndex: null });
  }

  _onRefresh = async () => {
    console.log('refreshing');
    this.setState({ refreshing: true });
    await this.props.fetchLeague(this.state.user.currentLeague);
    this.setState({ refreshing: false });
  }

  render() {
    // this.props.league.picks.forEach(pick => {
    //   console.log('homeScreen', pick.game.roadTeam.city, pick.game.winner);
    // });
    // // console.log('GAME SCREEN props', this.props.navigation);
    // console.log('HOEM SCREEN LEAGUE', this.props.league);

    // console.log('home screen LEAGUE', this.props.league);

    const { league } = this.props;
    // console.log('sfadsfds', this.props.screenProps.viewWeek);
    const games = league.games.filter(game => {
      // console.log(game.week.value, this.props.screenProps.viewWeek.value);
      return game.week === this.props.screenProps.viewWeek.value;
    });
    // console.log('after filter len', games.length);



    const picks = league.picks.filter(pick => {
      return pick.game.week === this.props.screenProps.viewWeek.value;
    });
    // console.log('PICKS XXXXXXXXXXXXXXXXXXXXX', picks);
    // console.log('LEAGUE', league);
    // console.log('WEEKLY GAMES', games);
    // console.log('PICK AFTER FILTER', picks);

    // console.log('LEAGUE', this.props.league);
    this.addPickToGame(games, picks);



    // console.log('AFTER');
    return (


      <ScrollView style={styles.root} stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {/* <Weeks /> */}
        {/* sticky weeks */}

        <View style={{ elevation: 10 }}>
          <Weeks screenProps={this.props.screenProps} navigation={this.props.navigation} />
        </View>

        {/* stickyHeaderIndices={[0]} */}

        {/* <NavigationEvents onWillForcus={payload => { alert() }} /> */}
        {this.props.loader.loading ?
          <View style={styles.loading}><ProgressBarAndroid /></View> :
          <View style={styles.container}>
            {games.map((game, index) => {

              return (

                <Card key={game._id} style={styles.card}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateTime}>Sunday, September 7</Text>
                    <Text style={styles.dateTime}>10:00 AM</Text>
                  </View>
                  <View style={styles.gameBox}>
                    <View style={styles.gameSection}>

                      {/* Road team */}
                      <TouchableNativeFeedback onPress={() => { this.handleCreatePick(game, 'road', index) }}>
                        {/* <CardItem style={game.selected === 'road' ? styles[game.result + 'Team'] : styles.openTeam} > */}
                        <CardItem style={game.selected === 'road' ? styles.teamRoadSelected : styles.teamRoad} >
                          {/* Team */}
                          <View style={styles.teamBox}>
                            {/* Name */}
                            <View>
                              <Image
                                style={{ height: 30, width: 30, marginRight: 8 }}
                                resizeMode="contain"
                                source={images.teams[game.roadTeam.name]}
                              />
                            </View>
                            <Text style={styles.teamName}>
                              {game.roadTeam.city}
                            </Text>
                          </View>
                          {/* Spread */}
                          <View style={styles.spreadBox}>
                            <Text style={styles.spread}>{game.roadSpread}</Text>
                            <Text>{game.selected === 'road' ? <Icon name='arrow-dropleft' /> : <Text style={{ color: 'white' }}>?</Text>}</Text>
                          </View>

                        </CardItem>
                      </TouchableNativeFeedback  >

                      {/* Home team */}
                      <TouchableNativeFeedback onPress={() => { this.handleCreatePick(game, 'home', index) }}>
                        <CardItem style={game.selected === 'home' ? styles.teamHomeSelected : styles.teamHome}>
                          {/* <CardItem style={game.selected === 'home' ? styles[game.result + 'Team'] : styles.openTeam}> */}
                          {/* Team */}
                          <View style={styles.teamBox}>
                            {/* Name */}
                            <View>
                              <Image
                                style={{ height: 30, width: 30, marginRight: 8 }}
                                resizeMode="contain"
                                source={images.teams[game.homeTeam.name]}
                              />
                            </View>
                            <Text style={styles.teamName}>
                              {game.homeTeam.city}
                            </Text>
                          </View>
                          {/* Spread */}
                          <View style={styles.spreadBox}>
                            <Text style={styles.spread}>{game.homeSpread}</Text>
                            <Text>{game.selected === 'home' ? <Icon name='arrow-dropleft' /> : <Text style={{ color: 'white' }}>?</Text>}</Text>
                          </View>

                        </CardItem>
                      </TouchableNativeFeedback >
                    </View>
                    {/* Selection */}
                    <View style={styles[game.result]}>

                      {this.state.loadingIndex === index ? <ProgressBarAndroid /> : <Image
                        style={{ height: 50, width: 50, marginRight: 8 }}
                        resizeMode="contain"
                        source={images.teams[game.pickImage]}
                      />}

                    </View>
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
  loading: {
    marginTop: 50
  },
  root: {
    flex: 1,
    backgroundColor: '#999999',
  },
  container: {
    marginTop: 15
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
  gameBox: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#dedede'
  },
  teamRoadSelected: {
    backgroundColor: '#dedede',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#dedede'
  },
  teamHome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamRoad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#dedede'
  },
  teamHomeSelected: {
    backgroundColor: '#dedede',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  gameSection: {
    width: '70%',
    borderRightWidth: 1,
    borderColor: '#dedede'
  },
  gameSectionWin: {
    width: '70%',
    borderRightWidth: 1,
    borderColor: '#e5ffe2'
  },
  gameSectionLose: {
    width: '70%',
    borderRightWidth: 1,
    borderColor: '#ffe2e2'
  },
  openTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15
  },
  winTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#e5ffe2'
  },
  loseTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#ffe2e2'
  },
  tieTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#e2edff'
  },
  pendingTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#efefef'
  },
  win: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.winColor
  },
  lose: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.loseColor
  },
  tie: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tieColor
  },
  pending: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.pendingColor
  },
  open: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamName: {
    color: '#2d2d2d'
  },
  teamBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spreadBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  spread: {
    paddingRight: 5
  }
});

const mapStateToProps = (state) => {
  return {
    // picks: state.picks,
    // games: state.games,
    league: state.league,
    loader: state.loader,
    // season: state.season
  }
}

export default connect(mapStateToProps, { fetchSeason, fetchUsers, fetchLeague, createPick, deletePick, getPicks, updatePick, fetchGames })(HomeScreen);
