const leagueReducer = (state = { weeks: [], games: [], picks: [], users: [], admin: {} }, action) => {
    switch (action.type) {

        case 'LEAGUE_FETCHED':
            return action.payload

        case 'GAMES_FETCHED':
            return { ...state, games: action.payload }

        case 'PICK_CREATED':

            return { ...state, picks: [...state.picks, action.payload] }

        case 'PICK_DELETED':
            const filterDeleted = state.picks.filter(pick => {
                return pick._id !== action.payload._id;
            });
            // console.log('after filted delete', filterDeleted);
            return { ...state, picks: filterDeleted };

        case 'PICK_UPDATED':
            const updateState = state.picks.map(pick => {
                if (pick._id === action.payload._id) {
                    return action.payload;
                } else {
                    return pick;
                }
            });
            return { ...state, picks: updateState };

        // case 'LOGGED_OUT':
        //     return {}

        // case 'SAVED_GOAL':
        //     return action.payload

        default:
            return state;
    }
};

export default leagueReducer;