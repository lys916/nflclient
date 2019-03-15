import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Card, CheckBox, Icon
} from 'native-base';

import { ExpoLinksView } from '@expo/samples';
import Colors from '../constants/Colors';



class StandingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
  }

  getRankings = (picks, users) => {
    const Main = {};

    users.forEach(user => {
      // initialize all user for ranking
      Main[user._id] = {
        user,
        win: 0,
        tie: 0,
        loss: 0
      }
    });
    picks.forEach(pick => {
      // if game has started or ended
      if (pick.game.winner !== null) {
        if (pick.game.winner !== 'pending') {
          if (pick.game.winner === 'tie') {
            Main[pick.user._id].tie++;
          }
          else if (pick.game.winner === pick.selected) {
            Main[pick.user._id].win++;
          }
          else {
            Main[pick.user._id].loss++;
          }
        }
      }
    });
    return Object.values(Main).sort(function (a, b) { return b.win - a.win });
  }
  render() {
    const { users, picks } = this.props.league;
    const rankings = this.getRankings(picks, users);
    console.log(rankings);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerBox}>
          <Text style={styles.headerPlayer}>PLAYERS</Text>
          <Text style={styles.headerWin}>WIN</Text>
          <Text style={styles.headerLoss}>LOSS</Text>
          <Text style={styles.headerTie}>TIE</Text>
          <Text style={styles.headerPick}>PICK</Text>
        </View>
        {rankings.map((rank, index) => {
          const rankNum = index < 10 ? '0' + (index + 1) : index;
          return (

            <View key={rank.user._id} style={styles.listBox}>
              <View style={styles.playerBox}>
                <View style={styles.nameBox}>
                  <Text style={styles.rankNum}>{rankNum}</Text>
                  <Icon style={{ fontSize: 20, color: '#777777', marginLeft: 2, marginRight: 5 }} name='contact' />
                  <Text style={styles.playerName}>{rank.user.name}</Text>

                </View>
                <Text style={styles.playerWin}>{rank.win}</Text>
                <Text style={styles.playerLoss}>{rank.loss}</Text>
                <Text style={styles.playerTie}>{rank.tie}</Text>
                <Text style={styles.playerPick}>{rank.win + rank.tie + rank.loss}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  headerBox: {
    flexDirection: 'row',

  },
  headerPlayer: {
    width: '50%',
    backgroundColor: '#dedede',
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  headerWin: {
    width: '12.5%',
    textAlign: 'center',
    backgroundColor: Colors.winColor,
    paddingTop: 10,
    paddingBottom: 10
  },
  headerTie: {
    width: '12.5%',
    textAlign: 'center',
    backgroundColor: Colors.tieColor,
    paddingTop: 10,
    paddingBottom: 10

  },
  headerLoss: {
    width: '12.5%',
    textAlign: 'center',
    backgroundColor: Colors.loseColor,
    paddingTop: 10,
    paddingBottom: 10

  },
  headerPick: {
    width: '12.5%',
    textAlign: 'center',
    backgroundColor: '#dedede',
    paddingTop: 10,
    paddingBottom: 10

  },
  playerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#dedede',
  },
  rankNum: {
    fontSize: 17,
    marginRight: 5,

  },
  nameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  playerName: { fontSize: 17 },
  playerWin: { width: '12.5%', textAlign: 'center', fontSize: 17, padding: 10 },
  playerTie: { width: '12.5%', textAlign: 'center', fontSize: 17, padding: 10 },
  playerLoss: { width: '12.5%', textAlign: 'center', fontSize: 17, padding: 10 },
  playerPick: { width: '12.5%', textAlign: 'center', fontSize: 17, padding: 10 },


});

const mapStateToProps = (state) => {
  return {
    league: state.league
  }
}

export default connect(mapStateToProps, {})(StandingsScreen);
