import React from 'react';
import { connect } from 'react-redux';
import Weeks from '../components/Weeks';

import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

class Picks extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    gameView: true
  }

  toggleView = () => {
    this.setState({
      gameView: !this.state.gameView
    });
  }

  addUserListToGame = (games, picks) => {
    games.forEach(game => {
      game.roadUserList = [];
      game.homeUserList = [];
      picks.forEach(pick => {
        if (game._id === pick.game._id && pick.selected === 'road') {
          game.roadUserList.push(pick.user);
        }
        if (game._id === pick.game._id && pick.selected === 'home') {
          game.homeUserList.push(pick.user);
        }
      });
    });
  }

  render() {
    const { games } = this.props;

    this.addUserListToGame(games, this.props.picks);
    // console.log('GAMESXXXXXX In PickScreen', games);
    return (
      <ScrollView style={styles.root}>
        <Weeks screenProps={this.props.screenProps} />
        <Text onPress={this.toggleView}>Game View</Text>
        <Text onPress={this.toggleView}>User View</Text>
        {this.state.gameView ?
          // Game View
          <View>
            {games.map(game => {
              return (
                <View style={styles.table} key={game._id}>

                  <Text style={styles.username}>
                    {game.roadTeam.name} at {game.homeTeam.name}
                  </Text>

                  <View style={styles.headerBox}>
                    <Text style={styles.header}>
                      {game.roadTeam.name} {game.roadSpread}
                    </Text>
                    <Text style={styles.header}>
                      {game.homeTeam.name} {game.homeSpread}
                    </Text>
                  </View>

                  <View style={styles.dataBox}>
                    <View style={styles.dataSectionLeft}>
                      {game.roadUserList.map((user, index) => {
                        return (
                          <Text style={styles.gameViewData} key={index}>
                            {user}
                          </Text>
                        );
                      })}
                    </View>

                    <View style={styles.dataSectionRight}>
                      {game.homeUserList.map((user, index) => {
                        return (
                          <Text style={styles.gameViewData} key={index}>
                            {user}
                          </Text>
                        );
                      })}
                    </View>
                  </View>

                </View>
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

  },
  username: {
    textAlign: 'center',
    backgroundColor: 'gray',
    color: 'white'
  },
  table: {

  },
  headerBox: {
    flexDirection: 'row',
    backgroundColor: 'gray',
    borderTopWidth: 1,
    borderColor: '#999999'
  },
  header: {
    borderRightWidth: 1,
    borderColor: '#999999',
    width: '50%',
    color: 'white',
    textAlign: 'center'
  },
  dataBox: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  data: {
    borderRightWidth: 1,
    borderColor: '#efefef',
    width: '50%',
    textAlign: 'center'
  },
  dataSectionLeft: {
    width: '50%',
    borderRightWidth: 1,
    borderColor: '#efefef',
  },
  dataSectionRight: {
    width: '50%'
  },
  gameViewData: {
    textAlign: 'center'

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
