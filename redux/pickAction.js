import axios from 'axios';

export const createPick = (pick) => {
    return (dispatch) => {
        dispatch({
            type: 'CREATING_PICK'
        });
        return axios.post(`http://192.168.1.67:5000/pick/create`, pick).then(res => {
            dispatch({
                type: 'PICK_CREATED',
                payload: res.data
            });

        });
    }
}

export const deletePick = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'DELETING_PICK'
        });
        return axios.post(`http://192.168.1.67:5000/pick/delete`, { id }).then(res => {
            // console.log('after deleted pick', res.data);
            dispatch({
                type: 'PICK_DELETED',
                payload: res.data
            });

        });
    }
}

export const updatePick = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'UPDATING_PICK'
        });
        return axios.post(`http://192.168.1.67:5000/pick/update`, { id }).then(res => {
            // console.log('after updated pick', res.data);
            dispatch({
                type: 'PICK_UPDATED',
                payload: res.data
            });

        });
    }
}

export const getPicks = (league) => {
    // console.log('action attemping to fetch picks', league);
    return (dispatch) => {
        dispatch({
            type: 'FETCHING_PICKS'
        });
        // console.log('GETTING PICKS');
        const before = Date.now();
        return axios.post(`http://192.168.1.67:5000/pick/fetch`, { league }).then(res => {
            // console.log('got picks from server', res.data);
            // console.log('GOT PICKS', Date.now());
            dispatch({
                type: 'PICKS_FETCHED',
                payload: res.data
            });
        });
    }
}