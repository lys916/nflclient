
// const pickReducer = (state = [], action) => {
//     switch (action.type) {

//         case 'PICKS_FETCHED':
//             return action.payload;

//         // case 'PICK_CREATED':
//         //     return [...state, action.payload];

//         // case 'PICK_DELETED':
//         //     const filterDeleted = state.filter(pick => {
//         //         return pick._id !== action.payload._id;
//         //     });
//         //     // console.log('after filted delete', filterDeleted);
//         //     return filterDeleted;

//         // case 'PICK_UPDATED':
//         //     const updateState = state.map(pick => {
//         //         if (pick._id === action.payload._id) {
//         //             return action.payload;
//         //         } else {
//         //             return pick;
//         //         }
//         //     });
//         //     return updateState;

//         // // insert transaction id into event transactions array
//         // case 'TRANSACTION_CREATED':
//         //     const insertTranId = state.map(event => {
//         //         if (event._id === action.payload.event._id) {

//         //             event.transactions.push(action.payload);

//         //             return event;
//         //         }
//         //         return event;
//         //     });
//         //     console.log('tran creaated in event', insertTranId);
//         //     return insertTranId

//         // // update transactions array in event
//         // case 'TRANSACTION_DELETED':
//         //     const removeTranId = state.map(event => {
//         //         if (event._id === action.payload.event) {
//         //             event.transactions.splice(event.transactions.indexOf(action.payload._id), 1);
//         //             return event;
//         //         }
//         //         return event;
//         //     });

//         //     return removeTranId;

//         // case "REMOVE_FROM_CART":
//         // 	const removeItem = state.filter(item=>{
//         // 		return item.id !== action.payload
//         // 	});
//         // 	localStorage.setItem('cart', JSON.stringify(removeItem));
//         // 	return removeItem;

//         // case 'ORDER_MADE':
//         // 	console.log(action.payload);
//         // 	localStorage.removeItem('cart');
//         // 	return [];

//         default:
//             return state;
//     }
// };

// export default pickReducer;