// import { AsyncStorage } from 'react-native';
// AsyncStorage.clear();
// let userInit = {
//     // logged_in: false,
//     // userName: '',
//     // userId: '',
//     // goal: {}

// }
// const _storeData = async () => {
//     try {
//         await AsyncStorage.setItem('user', 'testuser');
//     } catch (error) {
//         // Error saving data
//     }
// };

// _storeData();

// const _retrieveData = async () => {
//     try {
//         const value = await AsyncStorage.getItem('user');
//         if (value !== null) {
//             // We have data!!
//             // console.log(value);
//             userInit = value
//         }
//     } catch (error) {
//         // Error retrieving data
//     }
// };

// _retrieveData();


// if user exists in local storage, assign username to user initial name
// const user = JSON.parse(localStorage.getItem('user'));
// if (user) {
//     userInit = user;
// }

const userReducer = (state = [], action) => {
    switch (action.type) {

        case 'FETCHED_USERS':
            return action.payload

        default:
            return state;
    }
};

export default userReducer;