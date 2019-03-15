import axios from 'axios';

export const createLeague = (league) => {
    return (dispatch) => {
        dispatch({
            type: 'CREATING_LEAGUE'
        });
        return axios.post(`http://192.168.1.67:5000/league/create`, league).then(res => {
            dispatch({
                type: 'LEAGUE_FETCHED',
                payload: res.data.league
            });
            return res.data.user;
        });
    }
}

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
    // console.log('fetching league');
    return (dispatch) => {
        dispatch({
            type: 'FETCHING_LEAGUE'
        });
        return axios.get(`http://192.168.1.67:5000/league/fetch/${id}`).then(res => {
            dispatch({
                type: 'LEAGUE_FETCHED',
                payload: res.data
            });
            return res.data;

        });
    }
}