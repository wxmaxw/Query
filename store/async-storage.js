import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setItem(key, value){
    try{
        await AsyncStorage.setItem(key, value);
        return true;
    }
    catch(error){
        console.error("Error saving item: ", key);
        return false;
    }
}

export async function getItem(key){
    try{
        const item = await AsyncStorage.getItem(key);
        return item;
    }
    catch(error){
        console.error("Error getting item: ", key);
        return null;
    }
}

export async function removeItem(key){
    try{
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(error){
        console.error("Error removing item: ", key);
        return false;
    }
}