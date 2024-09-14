import { QueryClient } from "@tanstack/react-query";
 
const QueryClient = new QueryClient();

export async function sendRequest({api, data, token}){
    const url = process.env.EXPO_PUBLIC_API_URL

    const config = { 
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({api, data: {token, ...data}}),
    };

    const response = await fetch(url, config);

    if(!response.ok){
        const error = new Error("An error occured while sending request!");
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }
    const result = await response.json();

    return result
};
