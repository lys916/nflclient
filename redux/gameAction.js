import axios from 'axios';

// export const createPick = (pick) => {
//     return (dispatch) => {
//         dispatch({
//             type: 'CREATING_PICK'
//         });
//         return axios.post(`http://192.168.1.67:5000/pick/create`, pick).then(res => {
//             dispatch({
//                 type: 'PICK_CREATED',
//                 payload: res.data
//             });

//         });
//     }
// }

// export const deletePick = (id) => {
//     return (dispatch) => {
//         dispatch({
//             type: 'DELETING_PICK'
//         });
//         return axios.post(`http://192.168.1.67:5000/pick/delete`, { id }).then(res => {
//             console.log('after deleted pick', res.data);
//             dispatch({
//                 type: 'PICK_DELETED',
//                 payload: res.data
//             });

//         });
//     }
// }

// export const updatePick = (id) => {
//     return (dispatch) => {
//         dispatch({
//             type: 'UPDATING_PICK'
//         });
//         return axios.post(`http://192.168.1.67:5000/pick/update`, { id }).then(res => {
//             console.log('after updated pick', res.data);
//             dispatch({
//                 type: 'PICK_UPDATED',
//                 payload: res.data
//             });

//         });
//     }
// }

export const fetchGames = (week, league) => {
    // console.log('action week', week);
    return (dispatch) => {
        dispatch({
            type: 'FETCHING_GAMES'
        });
        // console.log('GETTING GAMES');
        return axios.get(`http://192.168.1.67:5000/game/fetch/${week}`).then(res => {
            // console.log('after fetched gameXXXXXXXXXX', res.data);
            // console.log('GOT GAMES', Date.now());
            dispatch({
                type: 'GAMES_FETCHED',
                payload: res.data
            });
            return true;

        });
    }
}