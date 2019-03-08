import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

class StandingsScreen extends React.Component {
    static navigationOptions = {
        title: 'Standings',
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.props.users.map(user => {
                    return (
                        <Text key={user._id}>{user.name}</Text>
                    );
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});

const mapStateToProps = (state) => {
    return {
        users: state.users,
        // games: state.games,
        // others: state.others
    }
}

export default connect(mapStateToProps, {})(StandingsScreen);
