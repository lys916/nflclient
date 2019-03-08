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

export const fetchLeague = (id) => {
    console.log('action fetching league');
    return (dispatch) => {
        dispatch({
            type: 'FETCHING_LEAGUE'
        });
        return axios.get(`http://192.168.1.67:5000/league/fetch/${id}`).then(res => {
            console.log('league fetched from server');
            dispatch({
                type: 'LEAGUE_FETCHED',
                payload: res.data
            });

        });
    }
}