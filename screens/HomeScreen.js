import React from 'react';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';
import {
  Container, StatusBar, Header,
  Content, Card, CardItem,
  Body, Text, Icon, Spinner
} from 'native-base';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet, ProgressBarAndroid,
  // Text,
  TouchableOpacity, TouchableNativeFeedback,
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
    loading: true,
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

  componentWillMount() {
    console.log('Home screen did mount - fetching picks');
    this.props.getPicks();
  }

  addPickToGame = (games, picks) => {
    games.forEach(game => {
      game.selected = null;
      game.localPickId = null;
      picks.forEach(pick => {
        if (game._id === pick.game._id) {
          game.selected = pick.selected;
          game.localPickId = pick._id;
        }
      });
    });
  }

  handleCreatePick = async (game, selected) => {
    if (!game.selected) {
      const pick = {
        game,
        selected
      };
      this.setState({ loading: true });
      const loading = await this.props.createPick(pick);
      this.setState({ loading });
    }
    else if (game.selected === selected) {
      // remove pick
      // console.log('remove pick', game.localPickId);
      this.props.deletePick(game.localPickId);
    }
    else {
      // update pick
      // console.log('update pick');
      this.props.updatePick(game.localPickId);
    }

  }

  render() {
    const { picks, games, screenProps } = this.props;
    this.addPickToGame(games, picks);
    // showUserFromStorage('Home Screen');
    return (
      <ScrollView style={styles.root}>
        <Weeks screenProps={this.props.screenProps} />

        {games.map(game => {
          return (
            <Card key={game._id} style={styles.card}>
              <View style={styles.gameSection}>

                {/* Road team */}
                <TouchableNativeFeedback onPress={() => { this.handleCreatePick(game, 'road') }}>
                  <CardItem style={game.selected === 'road' ? styles.teamSectionSelected : styles.teamSection} >
                    {/* Team */}
                    <View style={styles.teamBox}>
                      {/* Name */}
                      <View>
                        <Image
                          style={{ height: 40, width: 40, marginRight: 8 }}
                          resizeMode="contain"
                          source={require('../assets/images/Steelers.png')}
                        />
                      </View>
                      <Text style={styles.teamName}>
                        {game.roadTeam.name}
                      </Text>
                    </View>
                    {/* Spread */}
                    <View style={styles.spreadBox}>
                      <Text style={styles.spread}>{game.roadSpread}</Text>
                      <Text>{game.selected === 'road' ? <Icon name='arrow-dropleft' /> : null}</Text>
                    </View>

                  </CardItem>
                </TouchableNativeFeedback >

                {/* Home team */}
                <TouchableNativeFeedback onPress={() => { this.handleCreatePick(game, 'home') }}>
                  <CardItem style={game.selected === 'home' ? styles.teamSectionSelected : styles.teamSection}>
                    {/* Team */}
                    <View style={styles.teamBox}>
                      {/* Name */}
                      <View>
                        <Image
                          style={{ height: 40, width: 40, marginRight: 8 }}
                          resizeMode="contain"
                          source={require('../assets/images/Giants.png')}
                        />
                      </View>
                      <Text style={styles.teamName}>
                        {game.roadTeam.name}
                      </Text>
                    </View>
                    {/* Spread */}
                    <View style={styles.spreadBox}>
                      <Text style={styles.spread}>{game.homeSpread}</Text>
                      <Text>{game.selected === 'home' ? <Icon name='arrow-dropleft' /> : null}</Text>
                    </View>

                  </CardItem>
                </TouchableNativeFeedback>
              </View>

              {/* Selection */}
              <View style={styles.pickSection}>
                {this.state.loading ? <ProgressBarAndroid /> : <Image
                  style={{ height: 60, width: 60, marginRight: 8, }}
                  resizeMode="contain"
                  source={require('../assets/images/Panthers.png')}
                />}

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
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10
  },
  gameSection: {
    width: '70%',
    borderRightWidth: 1,
    borderColor: '#dedede'
  },
  teamSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamSectionSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#efefef'
  },
  pickSection: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 20,
    color: '#2d2d2d'
  },
  teamBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  spreadBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  spread: {
    fontSize: 20,
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
    // others: state.others
  }
}

export default connect(mapStateToProps, { fetchUsers, createPick, deletePick, getPicks, updatePick })(HomeScreen);
