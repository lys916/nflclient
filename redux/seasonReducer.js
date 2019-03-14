
const seasonReducer = (state = { availableWeeks: [], currentWeek: {} }, action) => {
    switch (action.type) {

        case 'SEASON_FETCHED':
            return action.payload

        // case 'LOGGED_OUT':
        //     return {}

        // case 'SAVED_GOAL':
        //     return action.payload

        default:
            return state;
    }
};

export default seasonReducer;