import { combineReducers } from 'redux';
import pickReducer from './pickReducer';
import gameReducer from './gameReducer';
import leagueReducer from './leagueReducer';
// import transactionReducer from './transactionReducer';
import userReducer from './userReducer';
// import otherReducer from './otherReducer';
// import userListReducer from './userListReducer';
// import cartReducer from './cartReducer';

const rootReducer = combineReducers({
    picks: pickReducer,
    games: gameReducer,
    league: leagueReducer,
    // transactions: transactionReducer,
    users: userReducer,
    // others: otherReducer,
    // users: userListReducer
    // cart: cartReducer
});

export default rootReducer;