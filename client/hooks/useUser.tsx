import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const USER_TOKEN_KEY = "user_token";

export const useUser = () => {
    const [userToken, setUserToken] = useState<string | null>(null);

    useEffect(() => {
        let token = localStorage.getItem(USER_TOKEN_KEY);

        if (!token) {
            token = uuidv4(); // Generate a unique ID
            localStorage.setItem(USER_TOKEN_KEY, token);
        }

        setUserToken(token);
    }, []);

    return userToken;
};
