import React from 'react';
import { connect } from 'react-redux';

import { Platform, ScrollView, StyleSheet, View, Text, Picker, AsyncStorage } from 'react-native';
import { fetchLeague } from '../redux/leagueAction';
import { fetchUsers } from '../redux/userAction';

import { Icon } from 'native-base';

import Colors from '../constants/Colors';

class Publish extends React.Component {
    state = {
    }
    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.root}>
                <Text>Please wait for your commissioner to publish this league. Once it's published, you can start making your picks.</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {

    },
});

const mapStateToProps = (state) => {
    return {
        // picks: state.picks,
        // others: state.others
        league: state.league
    }
}

export default connect(mapStateToProps, { fetchLeague, fetchUsers })(Weeks);