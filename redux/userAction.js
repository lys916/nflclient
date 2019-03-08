import axios from 'axios';

// export const deletePick = (id) => {
//     return (dispatch) => {
//         dispatch({
//             type: 'DELETING_PICK'
//         });
//         return axios.post(`http://192.168.1.67:5000/pick/delete`, { id }).then(res => {
//             // console.log('after deleted pick', res.data);
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
//             // console.log('after updated pick', res.data);
//             dispatch({
//                 type: 'PICK_UPDATED',
//                 payload: res.data
//             });

//         });
//     }
// }

export const fetchUsers = (leagueId) => {
    console.log('action fetching for users');
    return (dispatch) => {
        dispatch({
            type: 'FETCHING_USERS'
        });
        return axios.get(`http://192.168.1.67:5000/user/byLeagueId/${leagueId}`).then(res => {
            console.log('got users from server');
            dispatch({
                type: 'FETCHED_USERS',
                payload: res.data
            });

        });
    }
}