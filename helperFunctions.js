
import { AsyncStorage } from 'react-native';

const showUserFromStorage = async (location) => {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
}

export { showUserFromStorage };