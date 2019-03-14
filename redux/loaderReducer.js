
const loaderReducer = (state = { fetchingLeague: false }, action) => {
    switch (action.type) {

        case 'FETCHING_LEAGUE':
            return { ...state, fetchingLeague: true }
        case 'LEAGUE_FETCHED':
            return { ...state, fetchingLeague: false }


        // case 'PICKS_FETCHED':


        //     if (state.fetchingGames) {
        //         return { ...state, fetchingPick: false };
        //     } else {

        //         return { ...state, loading: false, fetchingPicks: false };
        //     }

        // case 'FETCHING_GAMES':

        //     if (state.loading) {

        //         return { ...state, fetchingGame: true };
        //     } else {

        //         return { ...state, loading: true, fetchingGames: true };
        //     }


        // case 'GAMES_FETCHED':

        //     if (state.fetchingPicks) {

        //         return { ...state, fetchingGames: false };
        //     } else {
        //         return { ...state, loading: false, fetchingGames: false };
        //     }





        // // insert transaction id into event transactions array
        // case 'TRANSACTION_CREATED':
        //     const insertTranId = state.map(event => {
        //         if (event._id === action.payload.event._id) {

        //             event.transactions.push(action.payload);

        //             return event;
        //         }
        //         return event;
        //     });
        //     console.log('tran creaated in event', insertTranId);
        //     return insertTranId

        // // update transactions array in event
        // case 'TRANSACTION_DELETED':
        //     const removeTranId = state.map(event => {
        //         if (event._id === action.payload.event) {
        //             event.transactions.splice(event.transactions.indexOf(action.payload._id), 1);
        //             return event;
        //         }
        //         return event;
        //     });

        //     return removeTranId;

        // case "REMOVE_FROM_CART":
        // 	const removeItem = state.filter(item=>{
        // 		return item.id !== action.payload
        // 	});
        // 	localStorage.setItem('cart', JSON.stringify(removeItem));
        // 	return removeItem;

        // case 'ORDER_MADE':
        // 	console.log(action.payload);
        // 	localStorage.removeItem('cart');
        // 	return [];

        default:
            return state;
    }
};

export default loaderReducer;