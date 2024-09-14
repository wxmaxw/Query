import {setItem, getItem, removeItem} from "./async-storage";
import {queryClient, sendRequest } from "../util/http";

export async function setToken(token) {
    try{
        await setItem("token", token);
        return true;
    }
    catch(error){
        console.log("Error setting token: ", error);
        return null;
    }
}

export async function getToken() {
    try{
        const token = await getItem("token");
        return token;
    }
    catch(error){
        console.log("Error getting token: ", error);
        return null;
    }
}

export async function removeToken() {
    try{
        await removeItem("token");
        return true;
    }
    catch(error){
        console.log("Error removing token: ", error);
        return null;
    }
}

export async function checkAuth() {
    try{
        // this function is in fact here to check the authentication through an api
        // yet, at the current stage, there is no api for this
        const isAuthenticated = await checkAuth();
        return isAuthenticated;
    }
    catch(error){
        console.log("Error checking auth: ", error);
        return null;
    }
}

export async function checkIsNotFirstTime() {
    try {
        const isFirstNotTime = await getItem("notFirstTime");
        return isFirstNotTime;
    } catch (error) {
        console.error("Error getting notFirstTime:", error);
        return null;
    }
}

export async function login(token) {
    try {
        const isTokenSet = await setToken(token);
        if(!isTokenSet) throw Error("Token is not set");
        ["isAuthenticated", "token", "userData"].forEach((item) => {
            queryClient.invalidateQueries({queryKey: [item]});
        });
        return true;;
        }
    catch (error) {
        console.error("Error logging in:", error);
        return null; 
    }
}

export async function logout() {
    try {
        await sendRequest({
            api: "/user/logout",
            token: queryClient.getQueryData(["token"]),
            data: { pushToken: queryClient.getQueryData(["pushToken"]) },
        });
        removeToken();
        ["isAuthenticated", "token", "userData"].forEach((item) => {
            queryClient.invalidateQueries({ queryKey: [item] });
        });
        return true;
    } catch (error) {
        console.error("Error logging out:", error);
        return null;
    }
}

