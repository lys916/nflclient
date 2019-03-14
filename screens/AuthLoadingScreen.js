import React from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { fetchSeason } from '../redux/userAction';
import { fetchLeague } from '../redux/leagueAction';

class AuthLoadingScreen extends React.Component {
	constructor(props) {
		super(props);
		this._bootstrapAsync();
	}

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {

		const jsonUser = await AsyncStorage.getItem('user');
		const user = JSON.parse(jsonUser);

		// This will switch to the App screen or Auth screen

		// screen will be unmounted and thrown away.
		// season
		if (user) {
			await this.props.fetchSeason();
		}

		if (!user) {
			this.props.navigation.navigate('Login');
		} else {
			if (!user.currentLeague) {
				this.props.navigation.navigate('JoinLeague');
			} else {
				// console.log('in authloading.. redirect to Main');

				this.props.navigation.navigate('Main');
			}
		}

	};

	// Render any loading content that you like here
	render() {

		// console.log('in authloading.. render');
		return (
			<View>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// season: state.season,
		// games: state.games,
		// others: state.others
	}
}

export default connect(mapStateToProps, { fetchLeague, fetchSeason })(AuthLoadingScreen);