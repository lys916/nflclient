import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';



class StandingsScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		// this.props.navigation.addListener('willFocus', (route) => {
		// 	this.props.screenProps.changeScreen('standings');
		// });
	}

	getRankings = (picks, users) => {
		// console.log('PICKKKKKKKKKKKKKKKKKK', picks);
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


			// if game has stared or ended
			if (pick.game.winner !== null) {
				if (pick.game.winner !== 'pending') {
					// console.log('game decided', pick.game.roadTeam.city);
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
			// // if user already exist in the Main object

			// if (pick.game.winner !== null) {
			// 	if (pick.game.winner !== 'pending') {
			// 		if (pick.game.winner === 'tie') {
			// 			Main[pick.user._id].tie++;
			// 		}
			// 		else if (pick.game.winner === pick.selected) {
			// 			Main[pick.user._id].win++;
			// 		}
			// 		else {
			// 			Main[pick.user._id].loss++;
			// 		}
			// 	}

			// }



		});

		return Object.values(Main).sort(function (a, b) { return b.win - a.win });
	}

	render() {
		// console.log('GAMES: ', this.props.league.games);
		const { users, picks } = this.props.league;
		const rankings = this.getRankings(picks, users);
		// console.log('ARRAY RANKINGS', rankings);
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
					return (

						<View key={rank.user._id} style={styles.listBox}>
							<View style={styles.playerBox}>
								<Text style={styles.playerName}>{index + 1} {rank.user.name}</Text>
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
		padding: 10
	},
	headerPlayer: {
		width: '50%',

	},
	headerWin: {
		width: '12.5%',
		textAlign: 'center'
	},
	headerTie: {
		width: '12.5%',
		textAlign: 'center'
	},
	headerLoss: {
		width: '12.5%',
		textAlign: 'center'
	},
	headerPick: {
		width: '12.5%',
		textAlign: 'center'
	},
	playerName: { width: '50%', fontSize: 17 },
	playerWin: { width: '12.5%', textAlign: 'center', fontSize: 17 },
	playerTie: { width: '12.5%', textAlign: 'center', fontSize: 17 },
	playerLoss: { width: '12.5%', textAlign: 'center', fontSize: 17 },
	playerPick: { width: '12.5%', textAlign: 'center', fontSize: 17 },

	playerBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderColor: '#dedede',
		padding: 10
	},
});

const mapStateToProps = (state) => {
	return {
		// users: state.users,
		picks: state.picks,
		league: state.league
		// games: state.games,
		// others: state.others
	}
}

export default connect(mapStateToProps, {})(StandingsScreen);
