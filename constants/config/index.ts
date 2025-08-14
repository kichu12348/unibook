const API_CONFIG:{
    BASE_URI: string;
    TIMEOUT: number;
    HEADERS: {
        "Content-Type": string;
    };
}={
    BASE_URI: process.env.EXPO_PUBLIC_API_URL,
    TIMEOUT: 10000,
    HEADERS: {
        "Content-Type": "application/json",
    },
}

const APP_CONFIG = {
    TOKEN_KEY: "auth_token",
    USER_KEY: "user_data",
    AUTHOR:"kichu aka betmen"
};

export { API_CONFIG, APP_CONFIG };