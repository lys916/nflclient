
import { AsyncStorage } from 'react-native';

const showUserFromStorage = async (location) => {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    console.log(`In ${location}, user is: `, user);
}

export { showUserFromStorage };