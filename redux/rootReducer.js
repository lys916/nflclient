import { combineReducers } from 'redux';
import pickReducer from './pickReducer';
import gameReducer from './gameReducer';
import leagueReducer from './leagueReducer';
import loaderReducer from './loaderReducer';
import seasonReducer from './seasonReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    // picks: pickReducer,
    // games: gameReducer,
    league: leagueReducer,
    loader: loaderReducer,
    season: seasonReducer,
    users: userReducer,
});

export default rootReducer;