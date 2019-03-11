import React from 'react';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import images from '../images';
import {
  Container, StatusBar, Header,
  Content, Card, CardItem,
  Body, Text, Icon, Spinner
} from 'native-base';

import {
  Image, AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet, ProgressBarAndroid, TouchableWithoutFeedback,
  // Text,
  TouchableOpacity, TouchableNativeFeedback, TouchableHighlight,
  View,
} from 'react-native';

import { WebBrowser } from 'expo';
import { showUserFromStorage } from '../helperFunctions';

import { MonoText } from '../components/StyledText';

import { createPick, deletePick, getPicks, updatePick } from '../redux/pickAction';
import { fetchUsers } from '../redux/userAction';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loadingIndex: null,
    user: {}
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }


  // async componentDidMount() {
  //   await Font.loadAsync({
  //     'Roboto': require('native-base/Fonts/Roboto.ttf'),
  //     'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
  //     ...Ionicons.font,
  //   });
  // }

  async componentWillMount() {
    //before the component renders, we want to load the user for later use
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    this.setState({ user });
    this.props.getPicks(user.currentLeague);
  }

  addPickToGame = (games, picks) => {
    if (games.length > 0 && picks.length > 0) {
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
        if (!game.selected && game.winner !== null) {
          game.result = 'lose';
        }
      });

    }
  }

  handleCreatePick = async (game, selected, index) => {
    if (game.winner) {
      return;
    }
    this.setState({ loadingIndex: index });
    // get user from storage
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);

    if (!game.selected) {
      const pick = {
        game: game._id,
        user: user._id,
        league: user.currentLeague,
        selected
      };

      await this.props.createPick(pick);
    }
    else if (game.selected === selected) {
      // remove pick
      // console.log('remove pick', game.localPickId);
      await this.props.deletePick(game.localPickId);
    }
    else {
      // update pick
      // console.log('update pick');
      await this.props.updatePick(game.localPickId);
    }
    this.setState({ loadingIndex: null });

  }

  render() {
    const { picks, games, screenProps } = this.props;

    this.addPickToGame(games, picks);

    // showUserFromStorage('Home Screen');
    return (
      <ScrollView style={styles.root}>
        <Weeks screenProps={this.props.screenProps} />

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
                  <TouchableWithoutFeedback onPress={() => { this.handleCreatePick(game, 'road', index) }}>
                    {/* <CardItem style={game.selected === 'road' ? styles[game.result + 'Team'] : styles.openTeam} > */}
                    <CardItem style={game.selected === 'road' ? styles.teamSelected : styles.team} >
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
                  </TouchableWithoutFeedback  >

                  {/* Home team */}
                  <TouchableWithoutFeedback onPress={() => { this.handleCreatePick(game, 'home', index) }}>
                    <CardItem style={game.selected === 'home' ? styles.teamSelected : styles.team}>
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
                  </TouchableWithoutFeedback >
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
            // <View style={styles.gameBox} key={game._id}>

            //   <TouchableOpacity
            //     style={game.selected === 'road' ? styles.teamBoxSelected : styles.teamBox} onPress={() => { this.handleCreatePick(game, 'road') }}>
            //     <Text style={styles.teamName}>{game.roadTeam.name} {game.roadSpread}</Text>
            //   </TouchableOpacity>

            //   <Text style={styles.at}>at</Text>

            //   <TouchableOpacity
            //     style={game.selected === 'home' ? styles.teamBoxSelected : styles.teamBox} onPress={() => { this.handleCreatePick(game, 'home') }}>
            //     <Text style={styles.teamName}>{game.homeTeam.name} {game.homeSpread}</Text>
            //   </TouchableOpacity>

            // </View>

          );
        })}

        {/* Test card */}

        {/* <Container>
          <Header />
          <Content>
            <Card>
              <CardItem>
                <Body>
                  <Text>
                  //Your text here
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container> */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
  gameBox: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#dedede'
  },
  teamSelected: {
    backgroundColor: '#dedede',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  team: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#dedede'
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
    backgroundColor: '#d5ffc9'
  },
  lose: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc9c9'
  },
  tie: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c9ddff'
  },
  pending: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dedede'
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
  // old down
  // gameBox: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#efefef',
  //   padding: 20
  // },
  // teamBox: {
  //   width: '45%',
  //   borderWidth: 2,
  //   borderColor: 'white'
  // },
  // teamBoxSelected: {
  //   width: '45%',
  //   borderWidth: 2,
  //   borderColor: 'blue'
  // },
  // teamName: {
  //   textAlign: 'center'
  // }
});

const mapStateToProps = (state) => {
  return {
    picks: state.picks,
    games: state.games,
    league: state.league
    // others: state.others
  }
}

export default connect(mapStateToProps, { fetchUsers, createPick, deletePick, getPicks, updatePick })(HomeScreen);
