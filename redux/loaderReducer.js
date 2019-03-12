
const loaderReducer = (state = { loading: false, fetchingPicks: false, fetchingGames: false }, action) => {
    switch (action.type) {

        case 'FETCHING_PICKS':
            console.log('fetching picks');
            if (state.loading) {
                console.log('loading, games, picks');
                return { ...state, fetchingPicks: true };
            } else {
                return { ...state, loading: true, fetchingPicks: true };
            }


        case 'PICKS_FETCHED':
            console.log('picks fetched');

            if (state.fetchingGames) {
                return { ...state, fetchingPick: false };
            } else {
                console.log('all false');
                return { ...state, loading: false, fetchingPicks: false };
            }

        case 'FETCHING_GAMES':
            console.log('fetching games');
            if (state.loading) {

                return { ...state, fetchingGame: true };
            } else {
                console.log('loading, games');
                return { ...state, loading: true, fetchingGames: true };
            }


        case 'GAMES_FETCHED':
            console.log('games fetched');
            if (state.fetchingPicks) {
                console.log('loading, picks');
                return { ...state, fetchingGames: false };
            } else {
                return { ...state, loading: false, fetchingGames: false };
            }





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